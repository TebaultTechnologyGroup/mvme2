import { useEffect, useState } from "react";
import { Button, Group, Menu, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { ChevronDown, Key, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import ChangePasswordModal from "./components/ChangePasswordModal";

export default function AppHeader() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [pwOpened, pw] = useDisclosure(false);

  const userId = session?.user.id;

  // if the userId exists, then setName
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("users")
      .select("full_name, email")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setName(data.full_name || data.email);
      });
    return () => {
      true;
    };
  }, [userId]);

  // Logout the user
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <Group h="100%" px="md" justify="space-between" wrap="nowrap">
        <Title order={3} size="h4" style={{ whiteSpace: "nowrap" }}>
          Paragyn AI
        </Title>
        <Menu position="bottom-end" width={200}>
          <Menu.Target>
            <Button
              variant="subtle"
              color="gray"
              leftSection={<User size={18} />}
              rightSection={<ChevronDown size={14} />}
            >
              {name ?? "Account"}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<Key size={14} />} onClick={pw.open}>
              Change password
            </Menu.Item>
            <Menu.Item
              leftSection={<LogOut size={14} />}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <ChangePasswordModal opened={pwOpened} onClose={pw.close} />
      <Outlet />
    </>
  );
}
