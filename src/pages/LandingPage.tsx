"use client";

import React, { useState } from "react";
import {
  Container,
  Group,
  Stack,
  Text,
  Title,
  Button,
  Card,
  Box,
  Flex,
  Burger,
  rem,
  Grid,
} from "@mantine/core";
import { ArrowRight, Check, Star, Gift, Building2, User } from "lucide-react";

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <Box
      id="top"
      mih="100vh"
      bg="white"
      style={{ fontFamily: "var(--mantine-font-family)" }}
    >
      {/* Top Banner Bar */}
      <Box
        bg="var(--mantine-color-blue-6)"
        c="white"
        px="md"
        py="xs"
        style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}
      >
        <Container size="lg">
          <Group justify="center" gap="md" align="center">
            <Text fz="sm" fw={500}>
              Want to help a friend or employee in their job search?
            </Text>
            <Button
              component="a"
              href="/gift"
              variant="light"
              color="white"
              size="xs"
              radius="md"
              fw={600}
              rightSection={<ArrowRight size={14} />}
            >
              Gift a Membership
            </Button>
            <Text fz="sm" fw={500} opacity={0.9}>
              or
            </Text>
            <Button
              component="a"
              href="/employers"
              variant="outline"
              color="white"
              size="xs"
              radius="md"
              fw={600}
              style={{ borderColor: "rgba(255,255,255,0.5)" }}
            >
              Learn about Employer Packages
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Navbar */}
      <Box
        component="nav"
        bg="white"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
        pos="sticky"
        top={0}
      >
        <Container size="lg" py="md">
          <Group justify="space-between" align="center">
            <Button
              onClick={() => scrollToSection("top")}
              variant="transparent"
            >
              <Group gap="sm">
                <Flex
                  w={40}
                  h={40}
                  bg="linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6), var(--mantine-color-violet-6))"
                  style={{ borderRadius: rem(16) }}
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
            </Button>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              <Button
                variant="subtle"
                color="gray.7"
                fw={500}
                onClick={() => scrollToSection("features")}
              >
                Features
              </Button>
              <Button
                variant="subtle"
                color="gray.7"
                fw={500}
                onClick={() => scrollToSection("pricing")}
              >
                Pricing
              </Button>
              <Button
                component="a"
                href="/gift"
                variant="subtle"
                color="gray.7"
                fw={500}
              >
                Gift Paragyn
              </Button>
              <Button
                component="a"
                href="/employers"
                variant="subtle"
                color="gray.7"
                fw={500}
              >
                For Employers
              </Button>
            </Group>

            <Group gap="sm" visibleFrom="md">
              <Button
                component="a"
                href="/login"
                variant="subtle"
                color="gray.7"
                fw={500}
              >
                Log in
              </Button>
              <Button
                component="a"
                href="/register"
                color="dark"
                radius="md"
                fw={600}
              >
                Register
              </Button>
            </Group>

            {/* Mobile Menu Button */}
            <Burger
              opened={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              hiddenFrom="md"
              aria-label="Toggle navigation"
            />
          </Group>
        </Container>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Stack
            hiddenFrom="md"
            bg="white"
            px="md"
            py="lg"
            style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
            gap="md"
          >
            <Button
              variant="subtle"
              justify="start"
              onClick={() => scrollToSection("features")}
            >
              Features
            </Button>
            <Button
              variant="subtle"
              justify="start"
              onClick={() => scrollToSection("pricing")}
            >
              Pricing
            </Button>
            <Button
              variant="subtle"
              justify="start"
              onClick={() => scrollToSection("gift")}
            >
              Gift Paragyn
            </Button>
            <Button
              variant="subtle"
              justify="start"
              onClick={() => scrollToSection("employers")}
            >
              For Employers
            </Button>
            <Stack
              pt="md"
              style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
              gap="sm"
            >
              <Button
                component="a"
                href="/login"
                variant="subtle"
                color="gray.7"
              >
                Log in
              </Button>
              <Button component="a" href="/register" color="dark" radius="md">
                Register
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>

      {/* Hero Section */}
      <Box
        py={80}
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-blue-0), var(--mantine-color-grape-1))",
        }}
      >
        <Container size="lg">
          <Grid align="center">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Stack gap="xl">
                <Title
                  order={1}
                  fz={{ base: rem(48), lg: rem(64) }}
                  fw={700}
                  style={{ letterSpacing: "-0.05em", lineHeight: 1 }}
                >
                  The job market is broken. Paragyn gives you the edge.
                </Title>

                <Text fz="xl" maw={500}>
                  Stop sending resumes into ATS black holes. Train your personal
                  AI delegate to master interviews, tailor applications, and
                  represent you to real recruiters 24/7.
                </Text>
                <Group gap="md">
                  <Button
                    component="a"
                    href="/onboarding"
                    color="dark"
                    size="lg"
                    radius="md"
                    rightSection={<ArrowRight size={20} />}
                  >
                    Start Free Today
                  </Button>

                  <Button
                    component="a"
                    href="/gift"
                    variant="outline"
                    color="gray"
                    size="lg"
                    radius="md"
                    leftSection={
                      <Gift size={18} style={{ fill: "currentColor" }} />
                    }
                  >
                    Gift a Subscription or Outplacement Options
                  </Button>
                </Group>
                <Group gap="xl" fz="sm" c="dimmed">
                  <Group gap="xs">
                    <Check size={18} color="var(--mantine-color-teal-6)" /> No
                    credit card needed
                  </Group>
                  <Group gap="xs">
                    <Check size={18} color="var(--mantine-color-teal-6)" />{" "}
                    Setup in under 30 minutes
                  </Group>
                </Group>
              </Stack>
            </Grid.Col>

            {/* Hero Visual */}
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Box
                pos="relative"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  shadow="xl"
                  padding={0}
                  radius="lg"
                  withBorder
                  style={{
                    width: "100%",
                    maxWidth: rem(500),
                    overflow: "hidden",
                  }}
                >
                  <Box
                    h={260}
                    style={{
                      background:
                        "linear-gradient(135deg, var(--mantine-color-dark-9), var(--mantine-color-indigo-9))",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Flex
                      w={160}
                      h={160}
                      bg="rgba(255, 255, 255, 0.1)"
                      style={{
                        backdropFilter: "blur(12px)",
                        borderRadius: "50%",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                      align="center"
                      justify="center"
                    >
                      <Text fz={80}>👤</Text>
                    </Flex>

                    <Box
                      pos="absolute"
                      bottom={20}
                      left={20}
                      right={20}
                      bg="rgba(0, 0, 0, 0.7)"
                      c="white"
                      fz="xs"
                      px="md"
                      py="xs"
                      style={{ borderRadius: rem(16) }}
                    >
                      <Group gap="sm">
                        <Box
                          w={10}
                          h={10}
                          bg="teal.4"
                          style={{ borderRadius: "50%" }}
                        />
                        <Text fz="xs">
                          Always online • Ready for interviews
                        </Text>
                      </Group>
                    </Box>
                  </Box>

                  <Stack p="xl" gap="md">
                    <Box bg="gray.1" p="md" style={{ borderRadius: rem(16) }}>
                      <Text fz="xs" fw={500} c="dimmed" mb={4}>
                        Recruiter
                      </Text>
                      <Text fz="sm" c="dark.8">
                        "Tell me about a challenging project you led and how you
                        overcame obstacles."
                      </Text>
                    </Box>

                    <Box
                      bg="blue.0"
                      p="md"
                      style={{ borderRadius: rem(16), marginLeft: rem(32) }}
                    >
                      <Text fz="xs" fw={500} c="blue.7" mb={4}>
                        Your Virtual Agent
                      </Text>
                      <Text fz="sm" c="dark.7">
                        "In my role at Acme Corp, I led a cross-functional team
                        to migrate our legacy system..."
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Audience Sections */}
      <Box id="audiences" py={100} bg="gray.0">
        <Container size="lg">
          <Stack align="center" mb={64}>
            <Text
              c="blue.6"
              fw={600}
              style={{ letterSpacing: "0.1em" }}
              fz="sm"
            >
              CHOOSE YOUR PATH
            </Text>
            <Title
              order={2}
              fz={44}
              fw={700}
              ta="center"
              style={{ letterSpacing: "-0.025em" }}
            >
              Built for three ways to get hired
            </Title>
            <Text fz="lg" c="dimmed" ta="center" maw={700} mb="xl">
              Whether you're looking for work, supporting someone who is, or
              managing a separation, Paragyn has a plan tailored for you.
            </Text>
          </Stack>

          <Grid>
            {/* Group 1: Job Seekers */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key="job-seekers">
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                }}
              >
                <Box
                  w={48}
                  h={48}
                  bg="blue.1"
                  c="blue.7"
                  style={{ borderRadius: 12 }}
                  mb="md"
                  ta="center"
                >
                  <User size={24} />
                </Box>
                <Title order={3} fz="20" fw={700} mb="sm">
                  Job Seekers
                </Title>
                <Text fz="sm" c="dimmed" mb="xl" style={{ lineHeight: 1.6 }}>
                  Get back in the driver's seat — 100% free to start.
                </Text>
                <Text
                  fz="xs"
                  fw={600}
                  c="blue.6"
                  mb="md"
                  style={{ letterSpacing: "0.1em" }}
                >
                  FREE TIER
                </Text>
                <Stack gap="sm" mb="xl">
                  {[
                    "Basic resume writer",
                    "Limited job tracking",
                    "1 practice interview per month",
                    "Basic hosted AI agent page",
                  ].map((f, i) => (
                    <Group gap="xs" key={i}>
                      <Check size={14} color="var(--mantine-color-teal-6)" />
                      <Text fz="sm" c="dimmed">
                        {f}
                      </Text>
                    </Group>
                  ))}
                </Stack>
                <Text
                  fz="xs"
                  fw={600}
                  c="indigo.6"
                  mb="md"
                  style={{ letterSpacing: "0.1em" }}
                >
                  PRO ($15–$29/mo)
                </Text>
                <Stack gap="sm">
                  {[
                    "Unlimited tailored resumes",
                    "Advanced interactive interview coaching",
                    "Unlimited agent hosting / screener chats",
                    "Recruiter search priority",
                  ].map((f, i) => (
                    <Group gap="xs" key={i}>
                      <Check size={14} color="var(--mantine-color-indigo-6)" />
                      <Text fz="sm" c="dimmed">
                        {f}
                      </Text>
                    </Group>
                  ))}
                </Stack>
                <Button
                  component="a"
                  href="/onboarding"
                  fullWidth
                  color="dark"
                  radius="md"
                  fw={600}
                  mt="md"
                >
                  Start for Free
                </Button>
              </Card>
            </Grid.Col>

            {/* Group 2: Friends & Family */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key="friends-family">
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                }}
              >
                <Box
                  w={48}
                  h={48}
                  bg="grape.1"
                  c="grape.7"
                  style={{ borderRadius: 12 }}
                  mb="md"
                  ta="center"
                >
                  <Gift size={24} />
                </Box>
                <Title order={3} fz="20" fw={700} mb="sm">
                  Friends &amp; Family
                </Title>
                <Text fz="sm" c="dimmed" mb="xl" style={{ lineHeight: 1.6 }}>
                  Help someone you care about land their next role faster.
                </Text>
                <Text
                  fz="xs"
                  fw={600}
                  c="grape.6"
                  mb="md"
                  style={{ letterSpacing: "0.1em" }}
                >
                  GIFT A CARE PACKAGE
                </Text>
                <Stack gap="sm" mb="xl">
                  {[
                    "Pre-paid 3- or 6-month Pro voucher",
                    "Delivered by email with your custom message",
                    "No credit card needed by the recipient",
                    "Instant redemption code",
                  ].map((f, i) => (
                    <Group gap="xs" key={i}>
                      <Check size={14} color="var(--mantine-color-grape-6)" />
                      <Text fz="sm" c="dimmed">
                        {f}
                      </Text>
                    </Group>
                  ))}
                </Stack>
                <Text
                  fz="sm"
                  c="dimmed"
                  style={{ lineHeight: 1.5, fontStyle: "italic" }}
                >
                  "Job seekers often feel uncomfortable asking for financial
                  help — but loved ones want to do more than say 'let me know if
                  you need anything.'"
                </Text>
                <Button
                  component="a"
                  href="/gift"
                  fullWidth
                  color="dark"
                  radius="md"
                  fw={600}
                  mt="xl"
                  leftSection={
                    <Gift size={18} style={{ fill: "currentColor" }} />
                  }
                >
                  Send a Gift Package
                </Button>
              </Card>
            </Grid.Col>

            {/* Group 3: Employers & HR */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key="employers">
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                }}
              >
                <Box
                  w={48}
                  h={48}
                  bg="teal.1"
                  c="teal.7"
                  style={{ borderRadius: 12 }}
                  mb="md"
                  ta="center"
                >
                  <Building2 size={24} />
                </Box>
                <Title order={3} fz="20" fw={700} mb="sm">
                  Employers &amp; HR
                </Title>
                <Text fz="sm" c="dimmed" mb="xl" style={{ lineHeight: 1.6 }}>
                  Provide modern, AI-powered outplacement that actually lands
                  people jobs.
                </Text>
                <Text
                  fz="xs"
                  fw={600}
                  c="teal.6"
                  mb="md"
                  style={{ letterSpacing: "0.1em" }}
                >
                  OUTPLACEMENT &amp; SEVERANCE
                </Text>
                <Stack gap="sm" mb="xl">
                  {[
                    "B2B bulk licenses ($100–$250 per departing employee)",
                    "6–12 months of Pro access per seat",
                    "Company dashboard to manage seat allocation",
                    "White-labeled welcome email",
                  ].map((f, i) => (
                    <Group gap="xs" key={i}>
                      <Check size={14} color="var(--mantine-color-teal-6)" />
                      <Text fz="sm" c="dimmed">
                        {f}
                      </Text>
                    </Group>
                  ))}
                </Stack>
                <Text
                  fz="sm"
                  c="dimmed"
                  style={{ lineHeight: 1.5, fontStyle: "italic" }}
                >
                  "Traditional outplacement costs companies thousands per
                  departing employee. Paragyn is a cost-effective, high-value
                  severance add-on."
                </Text>
                <Button
                  component="a"
                  href="/employers"
                  fullWidth
                  color="dark"
                  radius="md"
                  fw={600}
                  mt="xl"
                  leftSection={
                    <Building2 size={18} style={{ fill: "currentColor" }} />
                  }
                >
                  Paragyn for Employers
                </Button>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" py={100} bg="white">
        <Container size="lg">
          <Stack align="center" mb={64}>
            <Text
              c="blue.6"
              fw={600}
              style={{ letterSpacing: "0.1em" }}
              fz="sm"
            >
              EVERYTHING YOU NEED
            </Text>
            <Title
              order={2}
              fz={44}
              fw={700}
              ta="center"
              style={{ letterSpacing: "-0.025em" }}
            >
              One platform.
              <br />
              Four powerful AI tools.
            </Title>
          </Stack>

          <Grid>
            {[
              {
                title: "Virtual Agent",
                desc: "Recruiters screen your AI twin via shareable links.",
                icon: "👤",
              },
              {
                title: "Resume Builder",
                desc: "Upload a job description and get a tailored resume. Fine-tune with AI and export to PDF.",
                icon: "📄",
              },
              {
                title: "Interview Coach",
                desc: "Practice common questions. Get instant feedback and improve your answers.",
                icon: "🎤",
              },
              {
                title: "Recruiter Discovery",
                desc: "Opt-in to let recruiters find you based on job descriptions.",
                icon: "🔍",
              },
            ].map((feature, i) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i}>
                <Card
                  padding="xl"
                  radius="lg"
                  withBorder
                  style={{
                    height: "100%",
                    borderColor: "var(--mantine-color-gray-2)",
                  }}
                >
                  <Text fz={40} mb="md">
                    {feature.icon}
                  </Text>
                  <Title order={3} fz="xl" fw={600} mb="sm">
                    {feature.title}
                  </Title>
                  <Text fz="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box id="how" py={100} bg="gray.0">
        <Container size="lg">
          <Stack align="center" mb={64}>
            <Title order={2} fz={44} fw={700} ta="center">
              How Paragyn Works
            </Title>
            <Text fz="lg" c="dimmed" ta="center">
              From onboarding to landing interviews in minutes
            </Text>
          </Stack>

          <Stack maw={800} mx="auto" gap={60}>
            {[
              {
                step: "01",
                title: "Onboard & Build Your Profile",
                desc: "Tell us about your experience, achievements, interests, and answer common interview questions. Upload your photo.",
              },
              {
                step: "02",
                title: "Meet Your Virtual Agent",
                desc: "Test your AI twin in the dashboard. Correct any answers to continuously improve accuracy via RAG.",
              },
              {
                step: "03",
                title: "Share or Get Discovered",
                desc: "Generate shareable links for recruiters or opt-in to recruiter search.",
              },
              {
                step: "04",
                title: "Build Resumes & Prepare",
                desc: "Create tailored resumes and practice interviews with AI feedback.",
              },
            ].map((item) => (
              <Group key={item.step} align="flex-start" wrap="nowrap" gap="xl">
                <Flex
                  w={60}
                  h={60}
                  bg="blue.1"
                  c="blue.7"
                  fw={700}
                  fz="xl"
                  style={{ borderRadius: rem(16), flexShrink: 0 }}
                  align="center"
                  justify="center"
                >
                  {item.step}
                </Flex>
                <Stack gap="xs">
                  <Title order={3} fz={24} fw={600}>
                    {item.title}
                  </Title>
                  <Text fz="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {item.desc}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Stories / Testimonials */}
      <Box id="stories" py={100} bg="white">
        <Container size="lg">
          <Stack align="center" mb={64}>
            <Title order={2} fz={44} fw={700} ta="center">
              Real feedback from users
            </Title>
          </Stack>

          <Grid>
            {[
              {
                quote:
                  "This is genius. I interviewed Mark at 11pm on a Sunday and got thoughtful answers instantly.",
                name: "Sarah Chen",
                role: "Tech Recruiter",
              },
              {
                quote:
                  "I finally have a way to practice interviews without bothering my friends. The feedback is spot-on.",
                name: "Alex Rivera",
                role: "Software Engineer",
              },
              {
                quote:
                  "The concept is so powerful. I want this for myself and every candidate I work with.",
                name: "Michael Torres",
                role: "Hiring Manager",
              },
            ].map((testimonial, i) => (
              <Grid.Col span={{ base: 12, md: 4 }} key={i}>
                <Card
                  padding="xl"
                  radius="lg"
                  bg="gray.0"
                  withBorder
                  style={{
                    height: "100%",
                    borderColor: "var(--mantine-color-gray-2)",
                  }}
                >
                  <Group gap={4} mb="lg">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        color="var(--mantine-color-yellow-5)"
                        fill="var(--mantine-color-yellow-5)"
                        size={18}
                      />
                    ))}
                  </Group>
                  <Text fz="md" c="dark.7" style={{ lineHeight: 1.6 }} mb="xl">
                    “{testimonial.quote}”
                  </Text>
                  <Stack gap={2}>
                    <Text fw={600}>{testimonial.name}</Text>
                    <Text fz="sm" c="dimmed">
                      {testimonial.role}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" py={100} bg="dark.9" c="white">
        <Container size="lg">
          <Stack align="center" mb={64}>
            <Text
              c="blue.4"
              fz="sm"
              fw={600}
              style={{ letterSpacing: "0.1em" }}
            >
              SIMPLE PRICING FOR EVERY AUDIENCE
            </Text>
            <Title order={2} fz={44} fw={700} ta="center">
              Choose your path forward
            </Title>
          </Stack>

          <Grid>
            {/* Free Agent */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key="free">
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                  background: "white",
                  color: "var(--mantine-color-dark-9)",
                }}
              >
                <Text
                  fz="xs"
                  fw={600}
                  c="blue.6"
                  style={{ letterSpacing: "0.1em" }}
                  mb="xs"
                >
                  Free Agent
                </Text>
                <Text fz="xs" fw={500} c="dimmed" mb="xs">
                  Job Seekers
                </Text>
                <Title order={3} fz={48} fw={700} mb={4}>
                  $0
                </Title>
                <Text fz="sm" c="dimmed" mb="xl">
                  forever
                </Text>

                <Stack gap="md" mb="xl">
                  {[
                    "Standard Resume Writer",
                    "Job Tracker",
                    "1 Mock Interview",
                    "Basic Virtual Agent Profile",
                  ].map((feature, i) => (
                    <Group gap="sm" key={i}>
                      <Check size={18} color="var(--mantine-color-teal-6)" />
                      <Text fz="sm" c="dark.7">
                        {feature}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Button
                  component="a"
                  href="/onboarding"
                  fullWidth
                  color="dark"
                  radius="md"
                  fw={600}
                >
                  Start Free
                </Button>
              </Card>
            </Grid.Col>

            {/* Pro Agent */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key="pro">
              <Card
                padding="xl"
                radius="lg"
                pos="relative"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                  background:
                    "linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6))",
                  color: "white",
                }}
              >
                <Box
                  pos="absolute"
                  top={20}
                  right={20}
                  bg="rgba(255, 255, 255, 0.2)"
                  fz="xs"
                  px="md"
                  py={4}
                  style={{ borderRadius: rem(9999) }}
                >
                  Most Popular
                </Box>

                <Text
                  fz="xs"
                  fw={600}
                  c="blue.1"
                  style={{ letterSpacing: "0.1em" }}
                  mb="xs"
                >
                  Pro Agent
                </Text>
                <Text fz="xs" fw={500} c="blue.1" mb="xs">
                  Job Seekers
                </Text>
                <Title order={3} fz={48} fw={700} mb={4}>
                  $19
                </Title>
                <Text fz="sm" c="blue.1" mb="xl">
                  / mo
                </Text>

                <Stack gap="md" mb="xl" c="blue.0">
                  {[
                    "Unlimited Job-Tailored Resumes",
                    "Unlimited Mock Interviews",
                    "Always-On Virtual Agent",
                    "Recruiter Discovery",
                  ].map((feature, i) => (
                    <Group gap="sm" key={i}>
                      <Check size={18} />
                      <Text fz="sm">{feature}</Text>
                    </Group>
                  ))}
                </Stack>

                <Button
                  component="a"
                  href="/onboarding"
                  fullWidth
                  variant="outline"
                  color="white"
                  radius="md"
                  fw={600}
                  style={{ borderColor: "rgba(255,255,255,0.5)" }}
                >
                  Upgrade to Pro
                </Button>
              </Card>
            </Grid.Col>

            {/* Gift Pass */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key="gift">
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                  background: "white",
                  color: "var(--mantine-color-dark-9)",
                }}
              >
                <Box
                  w={40}
                  h={40}
                  bg="grape.1"
                  c="grape.7"
                  style={{ borderRadius: 10 }}
                  mb="md"
                  ta="center"
                >
                  <Gift size={20} />
                </Box>
                <Text
                  fz="xs"
                  fw={600}
                  c="grape.6"
                  style={{ letterSpacing: "0.1em" }}
                  mb="xs"
                >
                  Gift Pass
                </Text>
                <Text fz="xs" fw={500} c="dimmed" mb="xs">
                  Friends &amp; Family
                </Text>
                <Title order={3} fz={48} fw={700} mb={4}>
                  $49
                </Title>
                <Text fz="sm" c="dimmed" mb="xl">
                  3 Months
                </Text>

                <Stack gap="md" mb="xl">
                  {[
                    "Pre-paid 3-month Pro access",
                    "Code sent by email to recipient",
                    "Custom encouragement message",
                  ].map((feature, i) => (
                    <Group gap="sm" key={i}>
                      <Check size={18} color="var(--mantine-color-grape-6)" />
                      <Text fz="sm" c="dark.7">
                        {feature}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Button
                  component="a"
                  href="/gift"
                  fullWidth
                  color="dark"
                  radius="md"
                  fw={600}
                >
                  Send a Gift Pass
                </Button>
              </Card>
            </Grid.Col>

            {/* Outplacement */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key="outplacement">
              <Card
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  height: "100%",
                  borderColor: "var(--mantine-color-gray-2)",
                  background: "white",
                  color: "var(--mantine-color-dark-9)",
                }}
              >
                <Box
                  w={40}
                  h={40}
                  bg="teal.1"
                  c="teal.7"
                  style={{ borderRadius: 10 }}
                  mb="md"
                  ta="center"
                >
                  <Building2 size={20} />
                </Box>
                <Text
                  fz="xs"
                  fw={600}
                  c="teal.6"
                  style={{ letterSpacing: "0.1em" }}
                  mb="xs"
                >
                  Outplacement
                </Text>
                <Text fz="xs" fw={500} c="dimmed" mb="xs">
                  Employers / HR
                </Text>
                <Title order={3} fz={48} fw={700} mb={4}>
                  Custom
                </Title>
                <Text fz="sm" c="dimmed" mb="xl">
                  $150 per seat
                </Text>

                <Stack gap="md" mb="xl">
                  {[
                    "6–12 months Pro access",
                    "Company seat dashboard",
                    "White-labeled welcome email",
                  ].map((feature, i) => (
                    <Group gap="sm" key={i}>
                      <Check size={18} color="var(--mantine-color-teal-6)" />
                      <Text fz="sm" c="dark.7">
                        {feature}
                      </Text>
                    </Group>
                  ))}
                </Stack>

                <Button
                  component="a"
                  href="/employers"
                  fullWidth
                  color="dark"
                  radius="md"
                  fw={600}
                >
                  Contact Sales
                </Button>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box py={100} bg="white">
        <Container size="sm">
          <Stack align="center" ta="center">
            <Title order={2} fz={44} fw={700} mb="md">
              Ready to stand out in a crowded job market?
            </Title>
            <Text fz="lg" c="dimmed" mb="xl">
              Join the growing community using AI to work smarter — not harder —
              on their job search.
            </Text>

            <Button
              component="a"
              href="/onboarding"
              color="dark"
              size="xl"
              radius="md"
              rightSection={<ArrowRight size={24} />}
            >
              Create Your Paragyn Now
            </Button>

            <Text fz="sm" c="dimmed" mt="md">
              Takes less than 10 minutes • No credit card required
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" bg="dark.9" c="dimmed" py={80}>
        <Container size="lg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Group gap="sm" mb="lg">
                <Flex
                  w={32}
                  h={32}
                  bg="linear-gradient(135deg, var(--mantine-color-blue-5), var(--mantine-color-violet-5))"
                  style={{ borderRadius: rem(12) }}
                  align="center"
                  justify="center"
                  c="white"
                  fw={700}
                >
                  VM
                </Flex>
                <Text fw={600} fz="md" c="white">
                  Paragyn
                </Text>
              </Group>
              <Text fz="sm">
                AI-powered career tools that help you get hired faster.
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 6, md: 3 }}>
              <Text fw={500} c="white" mb="md">
                Product
              </Text>
              <Stack gap="xs" fz="sm">
                <Text>Paragyn</Text>
                <Text>Resume Builder</Text>
                <Text>Interview Coach</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, md: 3 }}>
              <Text fw={500} c="white" mb="md">
                Company
              </Text>
              <Stack gap="xs" fz="sm">
                <Text>About</Text>
                <Text>Blog</Text>
                <Text>Contact</Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 6, md: 3 }}>
              <Text fw={500} c="white" mb="md">
                Legal
              </Text>
              <Stack gap="xs" fz="sm">
                <Text>Privacy Policy</Text>
                <Text>Terms of Service</Text>
              </Stack>
            </Grid.Col>
          </Grid>

          <Text ta="center" fz="xs" mt={64} c="dimmed">
            © {new Date().getFullYear()} Paragyn. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
