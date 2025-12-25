import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./RoutesConst";

import Main from "@/pages/Main";
import Operations from "@/pages/Operations";
import UploadingReceipts from "@/pages/UploadingReceipts";
import Subscriptions from "@/pages/Subscriptions";
import Analitics from "@/pages/Analitics";
import LoginPage from "@/pages/LoginPage";
import Profile from "@/pages/Profile";
import RegistrationPage from "@/pages/RegistrationPage";

import EmptyLayout from "@/layouts/EmptyLayout";
import MainLayout from "@/layouts/MainLayout";

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
        element: <MainLayout />,
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
