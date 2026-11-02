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
  Grid,
} from "@mantine/core";
import { Gift, ArrowRight, Mail, Check } from "lucide-react";

const GiftParagyn: React.FC = () => {
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
              GIFT PARAGYN
            </Text>
            <Title
              order={2}
              fz={48}
              fw={700}
              mb="md"
              style={{ letterSpacing: "-0.05em" }}
            >
              Help someone you care about land their next role faster.
            </Title>
            <Text fz="lg" c="dimmed" mb="xl" maw={600}>
              Job seekers often feel uncomfortable asking for financial help,
              but loved ones actively search for practical ways to support them
              beyond just saying "let me know if you need anything."
            </Text>
          </Stack>

          <Grid maw={800} mx="auto">
            <Grid.Col span={{ base: 12, md: 6 }}>
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
                    <Gift size={24} />
                  </Box>
                  <Stack>
                    <Title order={3} fz="20" fw={600} mb="xs">
                      Gift a Care Package
                    </Title>
                    <Text fz="sm" c="dimmed" mb="xs">
                      Pre-paid Pro access delivered by email
                    </Text>
                    <Text fz="sm" c="blue.6" fw={500}>
                      $49 for 3 months · $89 for 6 months
                    </Text>
                  </Stack>
                </Group>

                <Stack gap="md" mb="xl">
                  {[
                    "Unlimited job-tailored resumes",
                    "Unlimited mock interviews",
                    "Always-on virtual agent",
                    "Recruiter discovery priority",
                  ].map((feature, i) => (
                    <Group gap="sm" key={i}>
                      <Check size={18} color="var(--mantine-color-teal-6)" />
                      <Text fz="sm">{feature}</Text>
                    </Group>
                  ))}
                </Stack>

                <Button
                  component="a"
                  href="/checkout/gift"
                  color="dark"
                  fullWidth
                  size="lg"
                  radius="md"
                  rightSection={<ArrowRight size={20} />}
                  fw={600}
                >
                  Send a Gift Package
                </Button>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card
                padding="xl"
                radius="lg"
                bg="blue.0"
                c="dark.9"
                style={{ borderRadius: 24 }}
              >
                <Group gap="md" mb="xl">
                  <Box
                    w={48}
                    h={48}
                    bg="rgba(255,255,255,0.2)"
                    c="white"
                    style={{ borderRadius: 12 }}
                    ta="center"
                  >
                    <Mail size={24} />
                  </Box>
                  <Stack>
                    <Title order={3} fz="20" fw={600} mb="xs">
                      How It Works
                    </Title>
                    <Text fz="sm" c="dimmed">
                      Purchase a voucher and we email the recipient a redemption
                      code with your personal message.
                    </Text>
                  </Stack>
                </Group>

                <Stack gap="md">
                  <Title order={3} fz="lg" fw={600} mb="md">
                    What they receive
                  </Title>
                  <Stack gap="sm">
                    <Group gap="sm">
                      <Text fw={500}>
                        A personal encouragement message from you
                      </Text>
                    </Group>
                    <Group gap="sm">
                      <Text fw={500}>A 3- or 6-month Pro access code</Text>
                    </Group>
                    <Group gap="sm">
                      <Text fw={500}>
                        Instructions to activate their virtual agent
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
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

export default GiftParagyn;
