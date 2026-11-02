import { apiFetch } from "@/lib/apiClient";
import { Button } from "@mantine/core";
import { useState } from "react";

interface RawResult {
  ok: Boolean;
}

export default function TestPage() {
  const [output, setOutput] = useState<RawResult | null>(null);
  async function handleTest() {
    try {
      const result = await apiFetch<RawResult>("/api/hello", {
        method: "GET",
      });
      console.log(result);
      setOutput(result);
    } catch (error) {
      console.log("error");
    }
  }

  return (
    <div>
      <h1>TEST PAGE</h1>
      <Button onClick={handleTest}>Run Test</Button>
      <br />
      <div>{output?.ok ? "true" : "false"}</div>
    </div>
  );
}
