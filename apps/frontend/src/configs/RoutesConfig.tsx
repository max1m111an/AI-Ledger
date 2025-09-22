import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./RoutesConst";
import PublicLayout from "../layouts/PublicLayout";
import Main from "@/pages/Main.tsx";
import Operations from "@/pages/Operations.tsx";
import UploadingReceipts from "@/pages/UploadingReceipts.tsx";
import Subscriptions from "@/pages/Subscriptions.tsx";
import Analitics from "@/pages/Analitics.tsx";
import Login from "@/pages/Login.tsx";
import Registration from "@/pages/Registration.tsx";


export const routesConfig = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: ROUTES.MAIN,
                element: <Main />,
            },
            {
                path: ROUTES.OPERATION,
                element: <Operations />,
            },
            {
                path: ROUTES.UPLOADING_RECEIPTS,
                element: <UploadingReceipts />,
            },
            {
                path: ROUTES.SUBSCRIPTIONS,
                element: <Subscriptions />,
            },
            {
                path: ROUTES.ANALYTICS,
                element: <Analitics />,
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
            {
                path: ROUTES.REGISTRATION,
                element: <Registration />,
            },
        ],
    },
];


export const router = createBrowserRouter(routesConfig);
