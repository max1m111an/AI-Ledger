import React from "react";
import { Modal } from "@components/Modal.tsx";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    subName: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal isOpen={ isOpen } onClose={ onClose }>
            <div className="success-modal-content">
                <h2 className="title">Успешно!</h2>
                <p className="addition_2 fs-14 fw-500 mt-15 mb-5">
                    Подписка успешно добавлена
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
