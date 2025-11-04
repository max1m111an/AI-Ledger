import React, { type ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export const Modal = (
    {
        isOpen,
        onClose,
        children,
        className = "",
    }: ModalProps) => {
    if (!isOpen)
        return null;

    return (
        <div className={ `modal-overlay ${className}` } onClick={ onClose }>
            <div className="modal-content" onClick={ (e) => e.stopPropagation() }>
                <button className="modal-close" onClick={ onClose }>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};
