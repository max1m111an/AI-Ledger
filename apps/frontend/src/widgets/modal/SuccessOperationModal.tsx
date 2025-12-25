import React from "react";
import { Modal } from "@components/Modal.tsx";

interface PaycheckFormData {
    name: string;
    price: number;
    category: string;
    type: "income" | "expense";
    date: string;
    time: string;
}

interface SuccessOperationModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: PaycheckFormData;
}

export const SuccessOperationModal: React.FC<SuccessOperationModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal isOpen={ isOpen } onClose={ onClose }>
            <div className="success-modal-content">
                <p className="title rm">Успешно!</p>
                <p className="addition_2 fs-14 fw-500 mt-15 mb-20">
                    Операция успешно добавлена
                </p>
                <button
                    onClick={ onClose }
                    className="Button control confirm"
                >
                    OK
                </button>
            </div>
        </Modal>
    );
};
