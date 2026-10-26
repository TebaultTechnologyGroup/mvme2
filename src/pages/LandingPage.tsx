import "@mantine/core/styles.css";
import { Button, Container, Title } from "@mantine/core";

export default function LandingPage() {
  return (
    <Container py="xl">
      <Title order={1}>mvme2</Title>
      <p>
        The previous version was fubar. SO I restarted a new project. Copy
        carefully!
      </p>
      <Button mt="md">Hello Mantine</Button>
    </Container>
  );
}
