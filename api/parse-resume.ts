import OpenAI from "openai";
import { supabaseClient } from "./_lib/supabase-client";
import { z } from 'zod';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { randomUUID } from 'crypto';


const UPLOADED_RESUMES_TABLE = "uploaded_resumes";
const MASTER_RESUMES_TABLE = "master_resumes";
const STORAGE = "resumes";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});


// Define the Resume Schema
const ResumeSchema = z.object({
    name: z.string().default("Your Name"),
    email: z.string().default("Email"),
    phone: z.string().default("Phone"),
    location: z.string().default("Location"),
    summary: z.string().default("Executive summary"),
    skills: z.array(z.string()).default([]),
    experience: z.array(
        z.object({
            company: z.string().default("Company name"),
            title: z.string().default("Job title"),
            startDate: z.string().default("Start date"),
            endDate: z.string().default("End date"),
            description: z.string().default("Job description"),
            achievements: z.array(z.string()).default([]),
        })
    ).default([]),
    education: z.array(
        z.object({
            school: z.string().default("School name"),
            degree: z.string().default("Degree"),
            fieldOfStudy: z.string().default("Field of study"),
            year: z.string().default("Graduation year"),
            gpa: z.string().default("gpa")
        })
    ).default([]),
    projects: z.array(
        z.object({
            title: z.string().default("Project name"),
            description: z.string().default("Project description"),
            technologies: z.array(z.string()).default([]),
            url: z.string().nullable(),
        })
    ).default([]),
});

type Resume = z.infer<typeof ResumeSchema>;



//////////////// HANDLER /////////////////////////////////////////////////////////////////

export default async function handler(
    req: { method?: string; body?: any, headers?: any },
    res: { status: (code: number) => { json: (data: any) => any } }
) {

    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    // Verify the caller is logged in
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Invalid Token" });

    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) return res.status(401).json({ error: "Invalid User" });

    const { resumeId } = req.body as { resumeId?: string };
    if (!resumeId) return res.status(400).json({ error: 'Missing resumeId' });

    try {


        // Make sure the resume belongs to this user
        const { data: resume } = await supabaseClient
            .from(UPLOADED_RESUMES_TABLE)
            .select('*')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single();

        if (!resume) return res.status(404).json({ error: "Error reading resume" });


        // Update status to processing
        await supabaseClient.from(UPLOADED_RESUMES_TABLE).update({ status: 'processing' }).eq('id', resumeId);


        const { data: blob, error: downloadError } = await supabaseClient.storage
            .from(STORAGE)
            .download(resume.file_path);
        if (downloadError || !blob) throw new Error('Download failed');


        const fileBuffer = Buffer.from(await blob.arrayBuffer());

        const parsed = await parseWithClaude(fileBuffer, resume.file_path);

        // Save parsed results to master_resumes table
        const masterResume = await saveResults(resumeId, user.id, parsed);

        // Update uploaded_resume status to completed
        await supabaseClient.from(UPLOADED_RESUMES_TABLE).update({ status: 'completed', master_resume_id: masterResume.id }).eq('id', resumeId);

        return res.status(200).json({ ok: true, masterResumeId: masterResume.id, data: masterResume });
    } catch (err) {
        console.error('Resume parsing failed:', err);
        await supabaseClient.from(UPLOADED_RESUMES_TABLE).update({ status: 'error' }).eq('id', resumeId);
        return res.status(500).json({ error: 'Parsing failed' });
    }
}



//////////////// PARSE RESUME //////////////////////////////////////////////////////////////
async function parseWithClaude(buffer: Buffer, filePath: string): Promise<Resume> {

    // will use this later
    const isPdf = filePath.toLowerCase().endsWith('.pdf');
    const isDoc = filePath.toLowerCase().endsWith('.docx');
    const isTxt = filePath.toLowerCase().endsWith('.txt') || filePath.toLowerCase().endsWith('.md');

    const INSTRUCTIONS = `
    Extract this resume into JSON with exactly these keys: 
    name, 
    email, 
    phone (optional),
    location (optional),
    summary (optional),
    skills (array of strings), 
    experience (array of objects with: company, title, startDate, endDate, description, string array of achievements),
    education (array of objects with: school, degree, year graduated (or range of time),fieldOfStudy, grade point average (gpa)
    projects (array of objects with: title, description, technologies as array, url optional)
    
 
    For achievements: each achievement is typically a bullet or separate line below the description.If none found, use empty array [].
    For projects: If none found in resume, use empty array [].
    
    ignore unknown string values. Always use arrays for achievements, technologies, skills, experience, education, projects.
    Respond with ONLY the JSON object, no markdown formatting.`;


    let documentContent = "";

    // 2. Parse the file based on its type
    if (isPdf) {
        const parser = new PDFParse({ data: buffer });
        const textResult = await parser.getText();
        documentContent = textResult.text;
        await parser.destroy();


    } else if (isDoc) {
        // Mammoth extracts raw text from the underlying XML structure of a .docx
        const docxData = await mammoth.extractRawText({ buffer: buffer });
        documentContent = docxData.value;

    } else if (isTxt) {
        documentContent = buffer.toString('utf-8');
    } else {
        throw new Error("Unsupported file type. Please upload a PDF, DOCX, MD, or TXT file.")
    }

    // Safety check: ensure we actually extracted text content
    if (!documentContent.trim()) {
        throw new Error("The uploaded document appears to be empty or unparseable.");
    }


    // console.log("Document extracted, sending to OpenAI...");

    // 3. Pass the extracted string to the AI agent
    const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
            { role: "system", content: INSTRUCTIONS },
            { role: "user", content: `Here is the document content:\n\n${documentContent}` }
        ],
        max_tokens: 5000,
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    if (!aiContent) {
        throw new Error("No response from AI");
    }

    //console.log("AI Response:", aiContent);

    // Parse the AI response as JSON
    const resume = JSON.parse(aiContent);

    // Validate the resume structure
    const validated = ResumeSchema.parse(resume);

    return validated;
}

//////////////// SAVE RESULTS //////////////////////////////////////////////////////////////
async function saveResults(_resumeId: string, userId: string, r: Resume) {
    // Transform the parsed resume into master_resumes structure
    const workExperience = r.experience.map((e) => ({
        id: randomUUID(),
        company: e.company || null,
        title: e.title || null,
        startDate: e.startDate || null,
        endDate: e.endDate || null,
        description: e.description || null,
        achievements: e.achievements || null,
        currentlyWorking: !e.endDate
    }));

    const education = r.education.map((e) => ({
        id: randomUUID(),
        school: e.school,
        degree: e.degree || null,
        fieldOfStudy: e.fieldOfStudy || null,
        year: e.year || null,
        gpa: e.gpa || null,

    }));

    const skills = r.skills.map((skill) => ({
        id: randomUUID(),
        name: skill,
        category: null,
        proficiencyLevel: null,
    }));

    const projects = (r.projects || []).map((p) => ({
        id: randomUUID(),
        title: p.title,
        description: p.description,
        technologies: p.technologies || [],
        url: p.url || null,
        startDate: null,
        endDate: null,
    }));

    // Insert into master_resumes table
    const { data: masterResume, error: insertError } = await supabaseClient
        .from(MASTER_RESUMES_TABLE)
        .insert({
            user_id: userId,
            title: 'Master Resume',
            name: r.name || undefined,
            email: r.email || undefined,
            phone: r.phone || undefined,
            location: r.location || undefined,
            summary: r.summary || undefined,
            work_experience: workExperience,
            education: education,
            skills: skills,
            projects: projects,
        })
        .select()
        .single();

    if (insertError) {
        throw new Error(`Failed to save master resume: ${insertError.message}`);
    }

    if (!masterResume) {
        throw new Error("Failed to retrieve saved master resume");
    }

    return masterResume;
}






