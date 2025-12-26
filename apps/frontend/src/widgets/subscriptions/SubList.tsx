import React, {
    useEffect, useState,
} from "react";
import type { Sub } from "@interfaces/models/SubModel.ts";
import { subsApi } from "@/api/SubsApi.ts";

interface SubListProps {
    selectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const SubList: React.FC<SubListProps> = ({
    selectedIds, setSelectedIds,
}) => {
    const [ subs, setSubs ] = useState<Sub[]>([]);

    useEffect(() => {
        fetchSubs();
    }, []);

    const fetchSubs = async() => {
        try {
            const res = await subsApi.getSubs();
            setSubs(res.subs);
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (timestampOrDateString: number | string): string => {
        try {
            let date: Date;

            // Проверяем, является ли значение строкой даты (формат YYYY-MM-DD)
            if (typeof timestampOrDateString === "string" && timestampOrDateString.includes("-")) {
                // Преобразуем строку даты в объект Date
                date = new Date(timestampOrDateString + "T00:00:00");
            } else {
                // Обрабатываем как timestamp (в секундах)
                const timestamp = Number(timestampOrDateString);
                date = new Date(timestamp * 1000);
            }

            // Проверяем, что дата валидна
            if (isNaN(date.getTime())) {
                return "Некорректная дата";
            }

            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        } catch (error) {
            console.error("Ошибка форматирования даты:", error);

            return "Ошибка даты";
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
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([ ...selectedIds, id ]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === subs.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(subs.map((sub) => sub.id).filter((id): id is number => id !== undefined));
        }
    };

    return (
        <div className="table_action_div">
            <table className="sub_table">
                <thead>
                    <tr>
                        <th className="cell_title">
                            <input
                                type="checkbox"
                                checked={ subs.length > 0 && selectedIds.length === subs.length }
                                onChange={ handleSelectAll }
                                disabled={ subs.length === 0 }
                            />
                        </th>
                        <th className="cell_title">Название</th>
                        <th className="cell_title">Цикл</th>
                        <th className="cell_title">След. дата</th>
                        <th className="cell_title">Стоимость</th>
                        <th className="cell_title">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {subs.map((sub: Sub) => (
                        <tr key={ sub.id }>
                            <td className="cell_value">
                                <input
                                    type="checkbox"
                                    checked={ sub.id !== undefined && selectedIds.includes(sub.id) }
                                    onChange={ () => sub.id !== undefined && handleSelectSub(sub.id) }
                                    disabled={ sub.id === undefined }
                                />
                            </td>
                            <td className="cell_value">{sub.name}</td>
                            <td className="cell_value">{getPeriodLabel(sub.period)}</td>
                            <td className="cell_value">{formatDate(sub.payday)}</td>
                            <td className="cell_value">{sub.price.toLocaleString()} ₽</td>
                            <td className="cell_value">
                                <button
                                    onClick={ async() => {
                                        const confirmed = window.confirm("Вы уверены, что хотите удалить эту подписку?");

                                        if (!confirmed) {
                                            return;
                                        }

                                        try {
                                            await subsApi.deleteSubs({ id: [ sub.id || 0 ] });
                                            await fetchSubs();
                                        } catch (error) {
                                            console.error("Ошибка при удалении подписки:", error);
                                        }
                                    } }
                                    className="Button small delete"
                                >
                                    Отменить
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
