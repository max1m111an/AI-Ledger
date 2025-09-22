import { Outlet } from "react-router-dom";
import { Header } from "../widgets/Header";

export default function PublicLayout() {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
