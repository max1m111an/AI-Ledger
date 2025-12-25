import React, { useState } from "react";
import "@assets/scss/index.scss";
import { paychecksApi } from "@/api/PaychecksApi.ts";
import { SuccessOperationModal } from "@/widgets/modal/SuccessOperationModal.tsx";
import { AddOperationModal } from "@/widgets/modal/AddOperationModal.tsx";

interface PaycheckFormData {
    name: string;
    price: number;
    category: string;
    type: "income" | "expense";
    date: string;
    time: string;
}

const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    return {
        date,
        time,
    };
};

export const Header: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ isSuccessModalOpen, setIsSuccessModalOpen ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const currentDateTime = getCurrentDateTime();
    const [ formData, setFormData ] = useState<PaycheckFormData>({
        name: "",
        price: 0,
        category: "",
        type: "expense",
        date: currentDateTime.date,
        time: currentDateTime.time,
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        const currentDateTime = getCurrentDateTime();
        setFormData({
            name: "",
            price: 0,
            category: "",
            type: "expense",
            date: currentDateTime.date,
            time: currentDateTime.time,
        });
    };

    const handleTypeChange = (type: "income" | "expense") => {
        setFormData((prev) => ({
            ...prev,
            type,
            category: "",
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {
            name, value,
        } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
    };

    const convertToTimestamp = (dateStr: string, timeStr: string): number => {
        const [ year, month, day ] = dateStr.split("-").map(Number);
        const [ hours, minutes ] = timeStr.split(":").map(Number);
        const date = new Date(year, month - 1, day, hours, minutes);

        return Math.floor(date.getTime() / 1000);
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const timestamp = convertToTimestamp(formData.date, formData.time);
            const paycheckData = {
                name: formData.name,
                price: Math.abs(formData.price),
                pay_date: timestamp,
                category: formData.category,
            };

            const response = await paychecksApi.addPaycheck(paycheckData);

            if (response.status === 200) {
                handleCloseModal();
                setIsSuccessModalOpen(true);
            }
        } catch (error) {
            console.error("Ошибка при добавлении операции:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <header className="header">
            <div className="d-f jc-r ai-c">
                <button
                    onClick={ handleOpenModal }
                    className="Button control confirm"
                >
                    + Добавить операцию
                </button>

                <AddOperationModal
                    isOpen={ isModalOpen }
                    onClose={ handleCloseModal }
                    formData={ formData }
                    onTypeChange={ handleTypeChange }
                    onInputChange={ handleInputChange }
                    onSubmit={ handleSubmit }
                    isLoading={ isLoading }
                />

                <SuccessOperationModal
                    isOpen={ isSuccessModalOpen }
                    onClose={ () => setIsSuccessModalOpen(false) }
                    formData={ formData }
                />
            </div>
        </header>
    );
};
