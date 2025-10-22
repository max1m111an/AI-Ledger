import { Outlet } from "react-router-dom";
import "@assets/scss/index.scss";
import sprite from "@assets/image/Icons.svg?raw";


export default function EmptyLayout() {
    return (
        <div className="app-container">
            <div style={ { display: "none" } } dangerouslySetInnerHTML={ { __html: sprite } } />
            <main className="main-container">
                <Outlet />
            </main>
        </div>
    );
}
