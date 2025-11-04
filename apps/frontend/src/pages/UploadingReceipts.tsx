import React from "react";
import "@assets/scss/index.scss";
import { UploadFile } from "@/widgets/UploadFile.tsx";
import { useNavigate } from "react-router-dom";

export default function UploadingReceipts() {
    const navigate = useNavigate();

    const handleSuccess = (paycheckData: any) => {
        console.log("Paycheck успешно загружен:", paycheckData);
    };

    const handleClose = () => {
        navigate(1);
    };

    return (
        <div className="page fd-c">
            <UploadFile
                onSuccess={handleSuccess}
                onClose={handleClose}
            />
        </div>
    );
}
