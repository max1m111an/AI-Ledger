import React from "react";
import "@assets/scss/index.scss";
import { UploadFile } from "@/widgets/UploadFile.tsx";


export default function UploadingReceipts() {
    return (
        <div className="page fd-c">
            <UploadFile />
        </div>
    );
}
