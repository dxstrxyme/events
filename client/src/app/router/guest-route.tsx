import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";
import { Navigate, Outlet } from "react-router-dom";

export function GuestRoute() {
    const user = useAuthBootstrap();
    if (user) {
        return <Navigate to="/events" replace />
    }
    return <Outlet />
}