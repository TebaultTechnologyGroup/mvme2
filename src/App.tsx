import "@mantine/core/styles.css";
import { MantineProvider, Button, Container, Title } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <Container py="xl">
        <Title order={1}>mvme2</Title>
        <Button mt="md">Hello Mantine</Button>
      </Container>
    </MantineProvider>
  );
}
