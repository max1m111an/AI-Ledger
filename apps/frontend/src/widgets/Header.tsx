import React, {useState} from "react";
import "@assets/scss/index.scss";
import {Modal} from "@components/Modal.tsx";
import {paychecksApi} from "@/api/PaychecksApi.ts";

interface PaycheckFormData {
    name: string;
    price: number;
    category: string;
    type: "income" | "expense";
    date: string;
    time: string;
}

const categories = {
    expense: [
        { value: "Cafe", label: "Кафе" },
        { value: "Transport", label: "Транспорт" },
        { value: "Utilities", label: "Коммунальные услуги" },
        { value: "Healthcare", label: "Здравоохранение" },
        { value: "Marketplace", label: "Маркетплейс" },
        { value: "Entertainment", label: "Развлечения" },
        { value: "Shop", label: "Магазин" },
        { value: "Other", label: "Другое" }
    ],
    income: [
        { value: "Transfer", label: "Зарплата" }
    ]
};

const getCategoryLabel = (value: string): string => {
    const allCategories = [...categories.expense, ...categories.income];
    const category = allCategories.find(cat => cat.value === value);
    return category ? category.label : value;
};

const convertToTimestamp = (dateStr: string, timeStr: string): number => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);
    return Math.floor(date.getTime() / 1000);
};

const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
};

export const Header: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const currentDateTime = getCurrentDateTime();
    const [formData, setFormData] = useState<PaycheckFormData>({
        name: "",
        price: 0,
        category: "",
        type: "expense",
        date: currentDateTime.date,
        time: currentDateTime.time
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
            time: currentDateTime.time
        });
    };

    const handleTypeChange = (type: "income" | "expense") => {
        setFormData(prev => ({
            ...prev,
            type,
            category: ""
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const timestamp = convertToTimestamp(formData.date, formData.time);

            const paycheckData = {
                name: formData.name,
                price: Math.abs(formData.price),
                pay_date: timestamp,
                category: formData.category
            };

            const response = await paychecksApi.addPaycheck(paycheckData);

            if (response.status === 200) {
                handleCloseModal();
                setIsSuccessModalOpen(true);

                setTimeout(() => {
                    setIsSuccessModalOpen(false);
                }, 3000);
            }
        } catch (error) {
            console.error("Ошибка при добавлении операции:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const availableCategories = formData.type === "income" ? categories.income : categories.expense;

    return (
        <header className="header">
            <div>
                <button
                    onClick={handleOpenModal}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    + Добавить операцию
                </button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                >
                    <div style={{ padding: "20px", minWidth: "400px" }}>
                        <h2 style={{ marginBottom: "20px" }}>Добавить операцию</h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange("expense")}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: formData.type === "expense" ? "#dc3545" : "#6c757d",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            flex: 1
                                        }}
                                    >
                                        Расход
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange("income")}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: formData.type === "income" ? "#28a745" : "#6c757d",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            flex: 1
                                        }}
                                    >
                                        Доход
                                    </button>
                                </div>
                                <div style={{
                                    color: formData.type === "expense" ? "#dc3545" : "#28a745",
                                    fontWeight: "bold"
                                }}>
                                    {formData.type === "expense" ? "Добавление расхода" : "Добавление дохода"}
                                </div>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                    Название операции *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxSizing: "border-box"
                                    }}
                                    placeholder="Например: Кофе, Зарплата, Покупки"
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                    Сумма *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price || ""}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxSizing: "border-box"
                                    }}
                                    placeholder="0.00"
                                />
                                <div style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
                                    {formData.type === "expense"
                                        ? "Расход будет сохранен с указанной суммой"
                                        : "Доход будет сохранен с указанной суммой"}
                                </div>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                    Категория *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxSizing: "border-box",
                                        backgroundColor: "white"
                                    }}
                                >
                                    <option value="">Выберите категорию</option>
                                    {availableCategories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "15px",
                                marginBottom: "20px"
                            }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                        Дата *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                        Время *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: formData.type === "expense" ? "#dc3545" : "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        flex: 1,
                                        fontWeight: "bold",
                                        opacity: isLoading ? 0.7 : 1
                                    }}
                                >
                                    {isLoading ? "Добавление..." : (formData.type === "expense" ? "Добавить расход" : "Добавить доход")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={isLoading}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#6c757d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        flex: 1,
                                        opacity: isLoading ? 0.7 : 1
                                    }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                >
                    <div style={{
                        padding: "30px",
                        minWidth: "300px",
                        textAlign: "center"
                    }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "#28a745",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: "30px",
                            color: "white"
                        }}>
                            ✓
                        </div>
                        <h2 style={{
                            marginBottom: "10px",
                            color: "#28a745"
                        }}>
                            Успешно!
                        </h2>
                        <p style={{
                            marginBottom: "20px",
                            color: "#666",
                            fontSize: "16px"
                        }}>
                            Операция "{formData.name}" ({getCategoryLabel(formData.category)}) успешно добавлена
                        </p>
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            OK
                        </button>
                        <div style={{
                            marginTop: "15px",
                            fontSize: "12px",
                            color: "#999"
                        }}>
                            Окно закроется автоматически через 3 секунды
                        </div>
                    </div>
                </Modal>
            </div>
        </header>
    );
};
