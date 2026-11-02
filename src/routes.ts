import { createBrowserRouter, redirect } from "react-router";
import LandingPage from "./pages/LandingPage";
import GiftParagyn from "./pages/GiftParagyn";
import Employers from "./pages/Employers";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import PasswordRecovery from "./pages/PasswordRecovery";
import Dashboard from "./pages/app/Dashboard";
import AppHeader from "./pages/app/AppHeader";
import GettingStarted from "./pages/app/GettingStarted";
import ResumeBuilder from "./pages/app/ResumeBuilder";
import PageNotFound from "./pages/PageNotFound";

import RequireAuth from "./context/RequireAuth";
import RedirectAuth from "./context/RedirectAuth";

export const router = createBrowserRouter([
    // Outside RedirectAuthenticated: the recovery link signs the user in.
    { path: "/password-recovery", Component: PasswordRecovery },

    {
        Component: RedirectAuth,
        children: [
            { path: "/", Component: LandingPage },
            { path: "gift", Component: GiftParagyn },
            { path: "employers", Component: Employers },
            { path: "login", Component: LoginPage },
            { path: "register", Component: RegistrationPage },
        ],
    },
    {
        Component: RequireAuth,
        children: [
            {
                path: "/app",
                Component: AppHeader,
                children: [
                    { index: true, loader: () => redirect("/app/dashboard") },
                    { path: "dashboard", Component: Dashboard },
                    { path: "getting-started", Component: GettingStarted },
                    { path: "resume-builder", Component: ResumeBuilder },

                ],
            },
        ],
    },
    {
        children: [
            { path: "*", Component: PageNotFound }
        ]
    }
]);


