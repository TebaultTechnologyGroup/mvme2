"use client";

import { useNavigate } from "react-router";
import {
  Container,
  Stack,
  Text,
  Title,
  Button,
  Card,
  Box,
  Group,
  Flex,
} from "@mantine/core";
import { ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useState, type SyntheticEvent } from "react";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theError, setTheError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setTheError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      setLoading(false);
      if (error) {
        setTheError(error.message);
        return;
      }
      navigate("/login");
    } catch (error) {
      console.log("error:" + error);
    }
  };

  // function handleInvalid(event: SyntheticEvent<HTMLFormElement, Event>): void {
  //   console.log(event);
  // }

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
              <Button
                component="a"
                href="/login"
                variant="subtle"
                color="gray.7"
                fw={500}
              >
                Already have an account? Log in
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
              Create your account
            </Title>
            <Text fz="lg" c="dimmed" ta="center" mb="xl">
              Join Paragyn and train your personal AI delegate to master
              interviews, tailor applications, and represent you to real
              recruiters 24/7.
            </Text>

            <Card padding="xl" radius="lg" withBorder>
              <form onSubmit={handleRegister}>
                <Stack gap="xl">
                  <Box>
                    <Text
                      fz="xs"
                      fw={600}
                      c="dimmed"
                      style={{ letterSpacing: "0.1em" }}
                      mb="xs"
                    >
                      Full Name
                    </Text>
                    <input
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--mantine-color-gray-3)",
                        background: "transparent",
                        fontSize: 16,
                        color: "var(--mantine-color-dark-9)",
                      }}
                    />
                  </Box>
                  <Box>
                    <Text
                      fz="xs"
                      fw={600}
                      c="dimmed"
                      style={{ letterSpacing: "0.1em" }}
                      mb="xs"
                    >
                      Email Address
                    </Text>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--mantine-color-gray-3)",
                        background: "transparent",
                        fontSize: 16,
                        color: "var(--mantine-color-dark-9)",
                      }}
                    />
                  </Box>
                  <Box>
                    <Text
                      fz="xs"
                      fw={600}
                      c="dimmed"
                      style={{ letterSpacing: "0.1em" }}
                      mb="xs"
                    >
                      Password
                    </Text>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--mantine-color-gray-3)",
                        background: "transparent",
                        fontSize: 16,
                        color: "var(--mantine-color-dark-9)",
                      }}
                    />
                  </Box>

                  {theError && (
                    <Text fz="sm" c="red.6">
                      {theError}
                    </Text>
                  )}

                  <Button
                    type="submit"
                    color="dark"
                    fullWidth
                    size="lg"
                    radius="md"
                    fw={600}
                    loading={loading}
                    rightSection={<ArrowRight size={20} />}
                  >
                    Create Account & Start Free
                  </Button>
                  <Text
                    fz="sm"
                    c="dimmed"
                    ta="center"
                    style={{ marginTop: -12 }}
                  >
                    By creating an account you agree to our Terms of Service and
                    Privacy Policy.
                  </Text>
                </Stack>
              </form>
            </Card>

            <Stack align="center" gap="sm" c="dimmed" fz="sm">
              <Text>Already have an account?</Text>
              <Button
                component="a"
                href="/login"
                variant="subtle"
                color="blue.6"
                fw={600}
                p={0}
                h="auto"
              >
                Log in
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" bg="dark.9" c="dimmed" py={40}>
        <Container size="lg">
          <Text ta="center" fz="xs">
            © {new Date().getFullYear()} Paragyn. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
