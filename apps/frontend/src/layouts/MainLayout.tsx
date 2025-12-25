import { Outlet } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar";
import { Header } from "@/widgets/Header.tsx";
import sprite from "@assets/image/Icons.svg?raw";


export default function MainLayout() {
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
