import { useState } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { supabase } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 8;

export default function ChangePasswordModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: { password: "", confirm: "" },
    validate: {
      password: (v) =>
        v.length >= MIN_PASSWORD_LENGTH
          ? null
          : `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      confirm: (v, values) =>
        v === values.password ? null : "Passwords do not match",
    },
  });

  const close = () => {
    form.reset();
    setError(null);
    setDone(false);
    onClose();
  };

  const submit = async (values: typeof form.values) => {
    setSaving(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    setSaving(false);
    if (error) setError(error.message);
    else setDone(true);
  };

  return (
    <Modal opened={opened} onClose={close} title="Change password">
      {done ? (
        <Stack>
          <Alert color="green">Your password has been updated.</Alert>
          <Group justify="flex-end">
            <Button onClick={close}>Close</Button>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={form.onSubmit(submit)}>
          <Stack>
            {error && <Alert color="red">{error}</Alert>}
            <PasswordInput
              label="New password"
              data-autofocus
              autoComplete="new-password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm new password"
              autoComplete="new-password"
              {...form.getInputProps("confirm")}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}
