"use client";

import React from "react";
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
import { Building2, ShieldCheck } from "lucide-react";

const Employers: React.FC = () => {
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
          <Stack align="center" ta="center" mb={64}>
            <Text
              c="blue.6"
              fw={600}
              style={{ letterSpacing: "0.1em" }}
              fz="sm"
            >
              FOR EMPLOYERS & HR
            </Text>
            <Title
              order={2}
              fz={48}
              fw={700}
              mb="md"
              style={{ letterSpacing: "-0.05em" }}
            >
              Provide modern, AI-powered outplacement that actually lands people
              jobs.
            </Title>
            <Text fz="lg" c="dimmed" mb="xl" maw={700}>
              Traditional outplacement costs companies thousands per departing
              employee. Paragyn offers B2B bulk license packages as a
              cost-effective, high-value severance add-on.
            </Text>
          </Stack>

          <Stack maw={800} mx="auto" gap="xl">
            <Card padding="xl" radius="lg" withBorder>
              <Group gap="md" mb="xl">
                <Box
                  w={48}
                  h={48}
                  bg="blue.1"
                  c="blue.7"
                  style={{ borderRadius: 12 }}
                  ta="center"
                >
                  <Building2 size={24} />
                </Box>
                <Stack>
                  <Title order={3} fz="20" fw={600} mb="xs">
                    B2B Bulk License Packages
                  </Title>
                  <Text fz="sm" c="dimmed">
                    $100–$250 per departing employee for 6 months of Pro access
                  </Text>
                </Stack>
              </Group>

              <Stack gap="md">
                {[
                  {
                    title: "6–12 months of Pro access",
                    desc: "Every departing employee gets full Pro features including unlimited resumes, mock interviews, and an always-on virtual agent.",
                  },
                  {
                    title: "Company seat dashboard",
                    desc: "Allocate, track, and manage Pro seats for all departing employees from one supabaseAdmin panel.",
                  },
                  {
                    title: "White-labeled welcome email",
                    desc: "Branded onboarding email sent to each employee with your company's messaging.",
                  },
                ].map((item, i) => (
                  <Group key={i} align="flex-start" gap="xl" wrap="nowrap">
                    <Box
                      w={40}
                      h={40}
                      bg="blue.0"
                      c="blue.7"
                      style={{ borderRadius: 10, flexShrink: 0 }}
                      ta="center"
                    >
                      <ShieldCheck size={20} />
                    </Box>
                    <Stack gap="xs">
                      <Text fw={600}>{item.title}</Text>
                      <Text fz="sm" c="dimmed">
                        {item.desc}
                      </Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Card>

            <Card padding="xl" radius="lg" bg="blue.0" c="dark.9">
              <Stack gap="md">
                <Title order={3} fz="24" fw={600} mb="sm" ta="center">
                  Get Started with Outplacement
                </Title>
                <Text fz="sm" c="dimmed" ta="center" mb="xl">
                  Contact us to set up bulk licenses for your separation
                  packages.
                </Text>
                <Button
                  component="a"
                  href="/contact/employers"
                  color="white"
                  fullWidth
                  size="lg"
                  radius="md"
                  fw={600}
                >
                  Request Employer Info
                </Button>
              </Stack>
            </Card>
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
};

export default Employers;
