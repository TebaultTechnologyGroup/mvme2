import { createBrowserRouter } from "react-router";
import LandingPage from "@/pages/LandingPage"
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: LandingPage,
        children: [
            { index: true, Component: LandingPage },
            { path: "dashboard", Component: LandingPage },
            { path: '*', Component: NotFound },
        ],
    }]);