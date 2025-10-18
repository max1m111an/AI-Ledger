import { Outlet } from "react-router-dom";
import { Sidebar } from "../widgets/Sidebar.tsx";
import { Header } from "@/widgets/Header.tsx";
import sprite from "@/assets/scss/components/Icons.svg?raw";

export default function PublicLayout() {
    return (
        <div className="app-container">
            <div style={ { display: "none" } } dangerouslySetInnerHTML={ { __html: sprite } } />
            <Sidebar />
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
