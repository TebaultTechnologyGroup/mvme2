import type { MasterResume } from '@/types/resume';

/**
 * Generates a professional HTML representation of the resume for PDF export
 */
export function generateResumeHTML(resume: MasterResume): string {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return date;
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .resume-container {
            max-width: 8.5in;
            height: 11in;
            margin: 0 auto;
            padding: 0.5in;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            color: #1a73e8;
            border-bottom: 2px solid #1a73e8;
            padding-bottom: 8px;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }
        
        .experience-item,
        .education-item,
        .project-item {
            margin-bottom: 16px;
            page-break-inside: avoid;
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }
        
        .job-title {
            font-weight: 600;
            font-size: 12px;
            color: #000;
        }
        
        .company {
            font-weight: 500;
            font-size: 12px;
            color: #555;
        }
        
        .date-range {
            font-size: 11px;
            color: #666;
        }
        
        .description {
            font-size: 11px;
            line-height: 1.5;
            color: #444;
            margin-top: 4px;
        }
        
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background-color: #e8f0fe;
            color: #1a73e8;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }
        
        .school {
            font-weight: 600;
            font-size: 12px;
            color: #000;
        }
        
        .degree {
            font-size: 11px;
            color: #555;
        }
        
        .project-title {
            font-weight: 600;
            font-size: 12px;
            color: #000;
        }
        
        .technologies {
            font-size: 10px;
            color: #666;
            margin-top: 4px;
            font-style: italic;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            
            .resume-container {
                max-width: 100%;
                height: auto;
                box-shadow: none;
                padding: 0.5in;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="section">
            <h1 style="font-size: 24px; margin-bottom: 4px;">${resume.title}</h1>
            <p style="font-size: 12px; color: #666;">Professional Resume</p>
        </div>
        
        ${
          resume.workExperience.length > 0
            ? `
            <div class="section">
                <h2 class="section-title">Work Experience</h2>
                ${resume.workExperience
                  .map(
                    (exp) => `
                    <div class="experience-item">
                        <div class="experience-header">
                            <div>
                                <div class="job-title">${exp.title}</div>
                                <div class="company">${exp.company}</div>
                            </div>
                            <div class="date-range">
                                ${formatDate(exp.startDate)} – ${
                      exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)
                    }
                            </div>
                        </div>
                        <div class="description">${exp.description}</div>
                    </div>
                `
                  )
                  .join('')}
            </div>
            `
            : ''
        }
        
        ${
          resume.education.length > 0
            ? `
            <div class="section">
                <h2 class="section-title">Education</h2>
                ${resume.education
                  .map(
                    (edu) => `
                    <div class="education-item">
                        <div class="experience-header">
                            <div>
                                <div class="school">${edu.school}</div>
                                ${edu.degree ? `<div class="degree">${edu.degree}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}</div>` : ''}
                            </div>
                            ${edu.year ? `<div class="date-range">${edu.year}</div>` : ''}
                        </div>
                    </div>
                `
                  )
                  .join('')}
            </div>
            `
            : ''
        }
        
        ${
          resume.skills.length > 0
            ? `
            <div class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-container">
                    ${resume.skills.map((skill) => `<span class="skill-tag">${skill.name}</span>`).join('')}
                </div>
            </div>
            `
            : ''
        }
        
        ${
          resume.projects.length > 0
            ? `
            <div class="section">
                <h2 class="section-title">Projects</h2>
                ${resume.projects
                  .map(
                    (proj) => `
                    <div class="project-item">
                        <div class="project-title">${proj.title}</div>
                        <div class="description">${proj.description}</div>
                        ${
                          proj.technologies && proj.technologies.length > 0
                            ? `<div class="technologies">Technologies: ${proj.technologies.join(', ')}</div>`
                            : ''
                        }
                    </div>
                `
                  )
                  .join('')}
            </div>
            `
            : ''
        }
    </div>
</body>
</html>
  `;
}

/**
 * Exports the resume as a PDF file
 */
export async function exportToPDF(resume: MasterResume, _filename?: string) {
  const htmlContent = generateResumeHTML(resume);

  // Create a blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);

  // Open print dialog in a new window
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    // Wait for the window to load, then trigger print
    printWindow.addEventListener('load', () => {
      printWindow.print();
      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
        window.URL.revokeObjectURL(url);
      }, 250);
    });
  }
}

/**
 * Exports the resume as HTML file
 */
export function exportToHTML(resume: MasterResume, filename?: string) {
  const htmlContent = generateResumeHTML(resume);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${resume.title.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exports the resume as JSON
 */
export function exportToJSON(resume: MasterResume, filename?: string) {
  const dataStr = JSON.stringify(resume, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${resume.title.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
