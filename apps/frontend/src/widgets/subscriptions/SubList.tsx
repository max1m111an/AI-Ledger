import React, {
    useEffect, useState,
} from "react";
import type { Sub } from "@interfaces/models/SubModel.ts";
import { subsApi } from "@/api/SubsApi.ts";

export const SubList: React.FC = () => {
    const [subs, setSubs] = useState<Sub[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchSubs();
    }, []);

    const fetchSubs = async() => {
        try {
            const res = await subsApi.getSubs();
            setSubs(res.subs);
            setSelectedIds([]);
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (timestamp: number): string => {
        try {
            const date = new Date(timestamp * 1000); // timestamp в секундах
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        } catch (error) {
            return timestamp.toString();
        }
    };

    const getPeriodLabel = (period: number): string => {
        switch (period) {
            case 1: return "1 месяц";
            case 2: return "2 месяца";
            case 3: return "3 месяца";
            case 6: return "6 месяцев";
            case 12: return "12 месяцев";
            default: return `${period} месяцев`;
        }
    };

    const handleSelectSub = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === subs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(subs.map(sub => sub.id).filter((id): id is number => id !== undefined));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;

        const confirmed = window.confirm(`Вы уверены, что хотите удалить ${selectedIds.length} подписок?`);
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await subsApi.deleteSubs({ id: selectedIds });
            await fetchSubs();
        } catch (error) {
            console.error("Ошибка при удалении подписок:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="table_action_div">
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "14px", color: "#666" }}>
                    {subs.length} подписок
                </div>
                {selectedIds.length > 0 && (
                    <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        {isDeleting ? "Удаление..." : `Удалить выбранные (${selectedIds.length})`}
                    </button>
                )}
            </div>
            <table className="sub_table">
                <thead>
                <tr>
                    <th className="cell_title" style={{ width: "40px" }}>
                        <input
                            type="checkbox"
                            checked={subs.length > 0 && selectedIds.length === subs.length}
                            onChange={handleSelectAll}
                            disabled={subs.length === 0}
                        />
                    </th>
                    <th className="cell_title">Название</th>
                    <th className="cell_title">Цикл</th>
                    <th className="cell_title">След. дата</th>
                    <th className="cell_title">Стоимость</th>
                    <th className="cell_title" style={{ width: "100px" }}>Действия</th>
                </tr>
                </thead>
                <tbody>
                {subs.map((sub: Sub) => (
                    <tr key={ sub.id }>
                        <td className="cell_value">
                            <input
                                type="checkbox"
                                checked={sub.id !== undefined && selectedIds.includes(sub.id)}
                                onChange={() => sub.id !== undefined && handleSelectSub(sub.id)}
                                disabled={sub.id === undefined}
                            />
                        </td>
                        <td className="cell_value">{sub.name}</td>
                        <td className="cell_value">{getPeriodLabel(sub.period)}</td>
                        <td className="cell_value">{formatDate(sub.payday)}</td>
                        <td className="cell_value">{sub.price.toLocaleString()} ₽</td>
                        <td className="cell_value">
                            <button
                                onClick={async () => {
                                    const confirmed = window.confirm("Вы уверены, что хотите удалить эту подписку?");
                                    if (!confirmed) return;

                                    try {
                                        await subsApi.deleteSubs({ id: [sub.id || 0] });
                                        await fetchSubs();
                                    } catch (error) {
                                        console.error("Ошибка при удалении подписки:", error);
                                    }
                                }}
                                style={{
                                    padding: "5px 10px",
                                    fontSize: "12px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {subs.length === 0 && (
                <div className="empty-state">
                    <span>Нет активных подписок</span>
                </div>
            )}
        </div>
    );
};
