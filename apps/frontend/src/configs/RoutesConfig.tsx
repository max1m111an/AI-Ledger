import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./RoutesConst";
import Main from "@/pages/Main.tsx";
import Operations from "@/pages/Operations.tsx";
import UploadingReceipts from "@/pages/UploadingReceipts.tsx";
import Subscriptions from "@/pages/Subscriptions.tsx";
import Analitics from "@/pages/Analitics.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import Profile from "@/pages/Profile.tsx";

import RequireAuth from "@/providers/RequireAuth.tsx";
import EmptyLayout from "@/layouts/EmptyLayout.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import RegistrationPage from "@/pages/RegistrationPage.tsx";


export const routesConfig = [
    {
        element: <EmptyLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
            },
            {
                path: ROUTES.REGISTRATION,
                element: <RegistrationPage />,
            },
        ],
    },
    {
        element: <RequireAuth fallbackURL={ ROUTES.LOGIN }><MainLayout /></RequireAuth>,
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
                path: ROUTES.PROFILE,
                element: <Profile />,
            },
        ],
    },
];


export const router = createBrowserRouter(routesConfig);
