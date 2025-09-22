import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./RoutesConst";
import PublicLayout from "../layouts/PublicLayout";
import Temp from "../widgets/Temp";




export const routesConfig = [
    {
        element: <PublicLayout />,
        children: [
            { path: ROUTES.ROOT, element: <Temp /> },
        ],
    },
];


export const router = createBrowserRouter(routesConfig);
