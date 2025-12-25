import React, { useState } from "react";
import "@assets/scss/index.scss";
import { SubStatistics } from "@/widgets/subscriptions/SubStatistics.tsx";
import { SubList } from "@/widgets/subscriptions/SubList.tsx";
import { subsApi } from "@/api/SubsApi.ts";
import { AddSubModal } from "@/widgets/modal/AddSubModal.tsx";
import { SuccessModal } from "@/widgets/modal/SuccessModal.tsx";

interface SubFormData {
    name: string;
    price: number;
    period: number;
    payday: string;
}

export const SubscriptionsWidget: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isSuccessModalOpen, setIsSuccessModalOpen ] = useState(false);
    const [ formData, setFormData ] = useState<SubFormData>({
        name: "",
        price: 0,
        period: 1,
        payday: new Date().toISOString().split("T")[0],
    });
    const [ selectedIds, setSelectedIds ] = useState<number[]>([]);
    const [ isDeleting, setIsDeleting ] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            name: "",
            price: 0,
            period: 1,
            payday: new Date().toISOString().split("T")[0],
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {
            name, value,
        } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 :
                name === "period" ? parseInt(value) || 1 : value,
        }));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const subData = {
                name: formData.name,
                price: formData.price,
                period: formData.period,
                payday: formData.payday,
            };

            const response = await subsApi.addSub(subData);

            if (response.status === 200) {
                handleCloseModal();
                setIsSuccessModalOpen(true);

                setTimeout(() => {
                    setIsSuccessModalOpen(false);
                }, 30000);

            }
        } catch (error) {
            console.error("Ошибка при добавлении подписки:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSelected = async() => {
        if (selectedIds.length === 0) {
            return;
        }

        const confirmed = window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} подписок?`);

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        try {
            await subsApi.deleteSubs({ id: selectedIds });
            setSelectedIds([]);
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при удалении подписок:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="page fd-c">
            <div className="d-f fd-r jc-sb mb-10">
                <div>
                    <span className="title">Подписки</span>
                    <span className="addition_3">
                        Активные подписки и ближайшие списания
                    </span>
                </div>
                <div className="fd-r g-10">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={ handleDeleteSelected }
                            disabled={ isDeleting }
                            className="Button delete"
                            style={ { marginRight: "10px" } }
                        >
                            {isDeleting ? "Удаление..." : `Удалить выбранные (${selectedIds.length})`}
                        </button>
                    )}
                    <button
                        onClick={ handleOpenModal }
                        className="Button control"
                    >
                        + Добавить подписку
                    </button>
                </div>
            </div>

            <div className="sub_div">
                <SubList
                    selectedIds={ selectedIds }
                    setSelectedIds={ setSelectedIds }
                />
                <SubStatistics />
            </div>

            <AddSubModal
                isOpen={ isModalOpen }
                onClose={ handleCloseModal }
                onSubmit={ handleSubmit }
                isLoading={ isLoading }
                formData={ formData }
                onInputChange={ handleInputChange }
            />

            <SuccessModal
                isOpen={ isSuccessModalOpen }
                onClose={ () => setIsSuccessModalOpen(false) }
                subName={ formData.name }
            />
        </div>
    );
};
