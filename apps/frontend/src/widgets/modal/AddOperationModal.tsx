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

interface AddOperationModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: PaycheckFormData;
    onTypeChange: (type: "income" | "expense") => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

const categories = {
    expense: [
        {
            value: "Cafe",
            label: "Кафе",
        },
        {
            value: "Transport",
            label: "Транспорт",
        },
        {
            value: "Utilities",
            label: "Коммунальные услуги",
        },
        {
            value: "Healthcare",
            label: "Здравоохранение",
        },
        {
            value: "Marketplace",
            label: "Маркетплейс",
        },
        {
            value: "Entertainment",
            label: "Развлечения",
        },
        {
            value: "Shop",
            label: "Магазин",
        },
        {
            value: "Other",
            label: "Другое",
        },
    ],
    income: [
        {
            value: "Transfer",
            label: "Зарплата",
        },
    ],
};

export const AddOperationModal: React.FC<AddOperationModalProps> = ({
    isOpen,
    onClose,
    formData,
    onTypeChange,
    onInputChange,
    onSubmit,
    isLoading,
}) => {
    const availableCategories = formData.type === "income" ? categories.income : categories.expense;

    return (
        <Modal isOpen={ isOpen } onClose={ onClose }>
            <h2 className="title">Добавить операцию</h2>

            <form onSubmit={ onSubmit } className="form">
                <div className="d-f fd-r g-10 mb-10">
                    <button
                        type="button"
                        onClick={ () => onTypeChange("expense") }
                        className={ `Button control ${formData.type === "expense" ? "delete" : "secondary"}` }
                    >
                        Расход
                    </button>
                    <button
                        type="button"
                        onClick={ () => onTypeChange("income") }
                        className={ `Button control ${formData.type === "income" ? "confirm" : "secondary"}` }
                    >
                        Доход
                    </button>
                </div>

                <div className={ `fs-14 fw-500 mb-15 ${formData.type === "expense" ? "sm" : "rm"}` }>
                    {formData.type === "expense" ? "Добавление расхода" : "Добавление дохода"}
                </div>

                <div className="form-group">
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Название операции *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={ formData.name }
                        onChange={ onInputChange }
                        required
                        className="input"
                        placeholder="Например: Кофе, Зарплата, Покупки"
                    />
                </div>

                <div className="form-group">
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Сумма *
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
                    <div className="addition_2 fs-12 mt-5">
                        {formData.type === "expense"
                            ? "Расход будет сохранен с указанной суммой"
                            : "Доход будет сохранен с указанной суммой"}
                    </div>
                </div>

                <div className="form-group">
                    <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                        Категория *
                    </label>
                    <select
                        name="category"
                        value={ formData.category }
                        onChange={ onInputChange }
                        required
                        className="select"
                    >
                        <option value="">Выберите категорию</option>
                        {availableCategories.map((category) => (
                            <option key={ category.value } value={ category.value }>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-f fd-r g-15 mb-20">
                    <div className="form-group fg-1">
                        <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                            Дата *
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={ formData.date }
                            onChange={ onInputChange }
                            required
                            className="input"
                        />
                    </div>
                    <div className="form-group fg-1">
                        <label className="addition_2 fs-12 fw-500 mt-15 mb-5">
                            Время *
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={ formData.time }
                            onChange={ onInputChange }
                            required
                            className="input"
                        />
                    </div>
                </div>

                <div className="d-f fd-r g-10 mt-10">
                    <button
                        type="submit"
                        disabled={ isLoading }
                        className={ `Button control ${formData.type === "expense" ? "delete" : "confirm"}` }
                    >
                        {isLoading ? "Добавление..." : (formData.type === "expense" ? "Добавить расход" : "Добавить доход")}
                    </button>
                    <button
                        type="button"
                        onClick={ onClose }
                        disabled={ isLoading }
                        className="Button control secondary"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </Modal>
    );
};
