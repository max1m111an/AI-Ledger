import { Outlet } from "react-router-dom";
import "@assets/scss/index.scss";


export default function EmptyLayout() {
    return (
        <div className="app-container">
            <main className="main-container">
                <Outlet />
            </main>
        </div>
    );
}
