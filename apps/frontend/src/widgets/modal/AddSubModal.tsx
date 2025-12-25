import React from "react";
import { Modal } from "@components/Modal.tsx";

interface SubFormData {
    name: string;
    price: number;
    period: number;
    payday: string;
}

interface AddSubModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
    formData: SubFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const periods = [
    {
        value: 1,
        label: "1 месяц",
    },
    {
        value: 2,
        label: "2 месяца",
    },
    {
        value: 3,
        label: "3 месяца",
    },
    {
        value: 6,
        label: "6 месяцев",
    },
    {
        value: 12,
        label: "12 месяцев",
    },
];

export const AddSubModal: React.FC<AddSubModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    formData,
    onInputChange,
}) => {
    return (
        <Modal isOpen={ isOpen } onClose={ onClose }>
            <h2 className="title">Добавить подписку</h2>

            <form onSubmit={ onSubmit } className="form">
                <div>
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Название подписки *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={ formData.name }
                        onChange={ onInputChange }
                        required
                        className="input"
                        placeholder="Например: Netflix, Spotify, Яндекс Плюс"
                    />
                </div>

                <div className="form-group">
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Стоимость *
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={ formData.price || "" }
                        onChange={ onInputChange }
                        required
                        min="0"
                        step="0.01"
                        className="input"
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group">
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Период оплаты *
                    </label>
                    <select
                        name="period"
                        value={ formData.period }
                        onChange={ onInputChange }
                        required
                        className="select"
                    >
                        {periods.map((period) => (
                            <option key={ period.value } value={ period.value }>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Дата следующего списания *
                    </label>
                    <input
                        type="date"
                        name="payday"
                        value={ formData.payday }
                        onChange={ onInputChange }
                        required
                        className="input"
                    />
                </div>

                <div className="d-f fd-r g-10 mt-10">
                    <button
                        type="submit"
                        disabled={ isLoading }
                        className="Button control confirm"
                    >
                        {isLoading ? "Добавление..." : "Добавить подписку"}
                    </button>
                    <button
                        type="button"
                        onClick={ onClose }
                        disabled={ isLoading }
                        className="Button control delete"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </Modal>
    );
};
