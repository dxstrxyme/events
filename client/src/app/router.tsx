import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./router/root-layout";
import { RootRedirect } from "./router/root-redirect";
import { GuestRoute } from "./router/guest-route";
import { ProtectedRoute } from "./router/protected-route";
import { AuthRegisterPage } from "@/pages/auth/register/page";
import { AuthLoginPage } from "@/pages/auth/login/page";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <RootRedirect /> },
            {
                element: <GuestRoute />,
                children: [
                    { path: 'login', element: <AuthLoginPage /> },
                    { path: 'register', element: <AuthRegisterPage /> }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'events', element: <h1>events</h1> },
                    { path: 'events/my', element: <h1>events/my</h1> },
                    { path: 'events/new', element: <h1>events/new</h1> },
                    { path: 'events/:id', element: <h1>events/:id</h1> },
                    { path: 'events/:id/edit', element: <h1>events/:id/edit</h1> }
                ]
            },
            {
                path: "*", element: <Navigate to="/" replace />
            }
        ]
    }
])