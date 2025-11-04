import React, {useState} from "react";
import "@assets/scss/index.scss";
import { SubStatistics } from "@/widgets/subscriptions/SubStatistics.tsx";
import { Modal } from "@components/Modal.tsx";
import { subsApi } from "@/api/SubsApi.ts";
import {SubList} from "@/widgets/subscriptions/SubList.tsx";

interface SubFormData {
    name: string;
    price: number;
    period: number;
    payday: string;
}

const periods = [
    { value: 1, label: "1 месяц" },
    { value: 2, label: "2 месяца" },
    { value: 3, label: "3 месяца" },
    { value: 6, label: "6 месяцев" },
    { value: 12, label: "12 месяцев" }
];

export const SubscriptionsWidget: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [formData, setFormData] = useState<SubFormData>({
        name: "",
        price: 0,
        period: 1,
        payday: new Date().toISOString().split('T')[0]
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: "",
            price: 0,
            period: 1,
            payday: new Date().toISOString().split('T')[0]
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 :
                name === "period" ? parseInt(value) || 1 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const subData = {
                name: formData.name,
                price: formData.price,
                period: formData.period,
                payday: formData.payday
            };

            const response = await subsApi.addSub(subData);

            if (response.status === 200) {
                handleCloseModal();
                setIsSuccessModalOpen(true);

                setTimeout(() => {
                    setIsSuccessModalOpen(false);
                }, 3000);

                window.location.reload();
            }
        } catch (error) {
            console.error("Ошибка при добавлении подписки:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page fd-c">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                width: "100%"
            }}>
                <div>
                    <span className="title">Подписки</span>
                    <span className="addition_3 mb-20" style={{ display: "block", marginTop: "10px" }}>
                        Активные подписки и ближайшие списания
                    </span>
                </div>
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
                    + Добавить подписку
                </button>
            </div>

            <div className="sub_div">
                <SubList />
                <SubStatistics />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            >
                <div style={{ padding: "20px", minWidth: "400px" }}>
                    <h2 style={{ marginBottom: "20px" }}>Добавить подписку</h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                Название подписки *
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
                                placeholder="Например: Netflix, Spotify, Яндекс Плюс"
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                Стоимость *
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
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                Период оплаты *
                            </label>
                            <select
                                name="period"
                                value={formData.period}
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
                                {periods.map(period => (
                                    <option key={period.value} value={period.value}>
                                        {period.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                Дата следующего списания *
                            </label>
                            <input
                                type="date"
                                name="payday"
                                value={formData.payday}
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

                        <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    flex: 1,
                                    fontWeight: "bold",
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? "Добавление..." : "Добавить подписку"}
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
                        Подписка "{formData.name}" успешно добавлена
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
    );
};
