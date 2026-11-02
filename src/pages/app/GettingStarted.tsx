import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Container,
  Stack,
  Text,
  Title,
  Button,
  Card,
  Group,
  Alert,
  Flex,
} from "@mantine/core";
import { Upload, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function GettingStarted() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;

    setError(null);
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("File must be smaller than 5 MB.");
      return;
    }
    setFile(selected);
  };

  async function handleContinue() {
    if (!file) return;
    if (!userId) return; //TODO add error.
    setLoading(true);
    setError(null);
    try {
      const path = `${userId}/${crypto.randomUUID()}-${file.name}`;

      // Upload the file straight to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, file);
      if (uploadError) throw uploadError;

      // Create the uploaded_resume record
      // console.log("user_id:" + user.userId + " file_path:" + path);
      // const { data: resume, error: insertError } = await supabase
      //   .from("uploaded_resumes")
      //   .insert({ user_id: user.userId, file_path: path, status: "pending" })
      //   .select()
      //   .single();

      // console.log(insertError);
      // if (insertError) {
      //   setLoading(false);
      //   throw new Error(
      //     "Error processing resume: " + JSON.stringify(insertError),
      //   );
      // }

      interface RawResponse {
        situation?: string;
        challenge?: string;
        task?: string;
        action?: string;
        result?: string;
        answer_text?: string;
        follow_up?: string;
      }

      // const result: any = await apiFetch<RawResponse>("/parse-resume", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     resumeId: resume.id,
      //   }),
      // });

      //   //TODO: Check result
      //   console.log(JSON.stringify(result));
      //   navigate("/app/resume-builder");
      // } catch (error) {
      //   setError(
      //     error instanceof Error ? error.message : "Failed to parse the resume.",
      //   );
    } finally {
      setLoading(false);
    }
  }

  // const handleContinue = async () => {
  //   if (!file) return;
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const parsed = await parseResume(file);
  //     // TODO: persist parsed resume (e.g. to Supabase) before navigating.
  //     void parsed;
  //     navigate("/app/resume-builder");
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "Failed to parse the resume.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSkip = () => {
    navigate("/app/resume-builder");
  };

  return (
    <Box
      mih="100vh"
      bg="white"
      style={{ fontFamily: "var(--mantine-font-family)" }}
    >
      <Box
        component="nav"
        bg="white"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
        pos="sticky"
        top={0}
      >
        <Container size="lg" py="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Flex
                w={40}
                h={40}
                bg="linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6), var(--mantine-color-violet-6))"
                style={{ borderRadius: 16 }}
                align="center"
                justify="center"
                c="white"
                fw={700}
                fz="xl"
              >
                P
              </Flex>
              <Text
                fz="xl"
                fw={600}
                style={{ letterSpacing: "-0.025em" }}
                c="slate.9"
              >
                Paragyn
              </Text>
            </Group>
            <Group gap="sm">
              <Button
                component="a"
                href="/"
                variant="subtle"
                color="gray.7"
                fw={500}
              >
                Back to Home
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      <Box py={60}>
        <Container size="lg">
          <Stack maw={480} mx="auto" gap="xl">
            <Title
              order={2}
              fz={40}
              fw={700}
              mb="xs"
              style={{ letterSpacing: "-0.025em" }}
              ta="center"
            >
              Get started
            </Title>
            <Text fz="lg" c="dimmed" ta="center" mb="xl">
              Upload your current resume so we can build your profile. You can
              also skip this step and start from scratch.
            </Text>

            {error && <Alert color="red">{error}</Alert>}

            <Card padding="xl" radius="lg" withBorder>
              <Stack gap="md">
                <Text
                  fz="xs"
                  fw={600}
                  c="dimmed"
                  style={{ letterSpacing: "0.1em" }}
                  mb="xs"
                >
                  Resume
                </Text>
                <label
                  style={{
                    display: "block",
                    cursor: "pointer",
                    border: `2px dashed var(--mantine-color-gray-3)`,
                    borderRadius: 12,
                    padding: "28px 20px",
                    textAlign: "center",
                    color: "var(--mantine-color-dimmed)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--mantine-color-blue-6)";
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--mantine-color-blue-0)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--mantine-color-gray-3)";
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "xs",
                      color: "var(--mantine-color-dimmed)",
                    }}
                  >
                    <Upload size={20} />
                    <Text fz="sm" fw={500}>
                      Click to upload your resume
                    </Text>
                  </span>
                  <Text fz="xs" c="dimmed" mt="xs">
                    PDF or Word document, up to 5 MB
                  </Text>
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
                {file && (
                  <Group
                    justify="space-between"
                    align="center"
                    gap="xs"
                    style={{ fontSize: 13 }}
                  >
                    <Text
                      c="dimmed"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Text>
                    <Button
                      variant="default"
                      size="xs"
                      color="red"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </Button>
                  </Group>
                )}
              </Stack>
            </Card>

            <Group justify="flex-end" gap="sm" mt="md">
              <Button
                variant="default"
                color="gray"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip
              </Button>
              <Button
                type="button"
                color="dark"
                fullWidth={false}
                size="lg"
                radius="md"
                fw={600}
                disabled={!file || loading}
                loading={loading}
                onClick={handleContinue}
                rightSection={<ArrowRight size={20} />}
              >
                Continue
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
