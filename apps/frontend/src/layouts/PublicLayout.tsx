import { Outlet } from "react-router-dom";
import { Sidebar } from "../widgets/Sidebar.tsx";
import { Header } from "@/widgets/Header.tsx";

export default function PublicLayout() {
    return (
        <div className="app-container">
            <Sidebar />
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
