import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { MantineProvider } from "@mantine/core";
import { router } from "./routes.ts";
//import { AppProvider } from "./guards/AppContext.tsx";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { AuthProvider } from "./context/AuthProvider.tsx";
//import './index.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
);
