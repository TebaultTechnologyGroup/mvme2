import {
  Box,
  Container,
  Stack,
  Text,
  Title,
  Button,
  Flex,
} from "@mantine/core";
import { Link } from "react-router";

export default function PageNotFound() {
  return (
    <Box
      mih="100vh"
      bg="white"
      style={{ fontFamily: "var(--mantine-font-family)" }}
    >
      <Box py={120}>
        <Container size="lg">
          <Stack align="center" ta="center">
            <Flex
              w={120}
              h={120}
              bg="gray.1"
              style={{ borderRadius: "50%" }}
              align="center"
              justify="center"
            >
              <Title
                order={1}
                fz={64}
                c="gray.3"
                style={{ letterSpacing: "-0.05em" }}
              >
                404
              </Title>
            </Flex>

            <Title order={2} fz={36} fw={700} mt="xl">
              Page not found
            </Title>
            <Text fz="lg" c="dimmed" maw={500}>
              Sorry, we couldn't find the page you're looking for.
            </Text>

            <Button
              component={Link}
              to="/"
              color="dark"
              radius="md"
              fw={600}
              mt="xl"
            >
              Go home
            </Button>
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
