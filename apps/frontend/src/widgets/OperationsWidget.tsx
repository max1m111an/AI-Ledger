import React from "react";

export default function OperationsWidget() {
    return (
        <div className="page fd-c">
            <div className="oper_head_div">
                <div className="oper_title_div">
                    <span className="title">Операции</span>
                    <span className="addition_3">Сортирочка, фильтры, и поиск по всем транзакциям</span>
                </div>
                <div className="oper_button_div">
                    <input
                        className="input"
                        placeholder="Поиск по описанию / магазину"
                    />
                    <button className="Button oper">Фильтры</button>
                    <button className="Button oper">По категории</button>
                </div>
            </div>
            <div className="action_block_1 fd-r g-10 mb-15">
                <div className="line_div">
                    <button className="line active">День</button>
                    <button className="line">Неделя</button>
                    <button className="line">Месяц</button>
                    <button className="line">Год</button>
                    <button className="line">Период</button>
                </div>
                <div className="line_div">
                    <button className="line active">Все</button>
                    <button className="line">Расход</button>
                    <button className="line">Доход</button>
                </div>
                <button className="Button oper">Кафе</button>
                <input
                    className="input"
                    placeholder="Теги (через запятую)"
                />
            </div>
            <div className="table_action_div w-100">
                <table className="sub_table">
                    <thead>
                        <tr>
                            <th className="cell_title">Описание</th>
                            <th className="cell_title">Категории</th>
                            <th className="cell_title">Дата</th>
                            <th className="cell_title">Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="cell_value">
                                <span className="test">
                                    <svg className="icon">
                                        <use href="#Reminder" />
                                    </svg>
                                    Пятерочка
                                </span>
                            </td>
                            <td className="cell_value">Еда</td>
                            <td className="cell_value">08.09</td>
                            <td className="cell_value">-653</td>
                        </tr>
                        <tr>
                            <td className="cell_value">Пятерочка, 19:43</td>
                            <td className="cell_value">Быт</td>
                            <td className="cell_value">08.09, 19:43</td>
                            <td className="cell_value">- 587</td>
                        </tr>
                        <tr>
                            <td className="cell_value">Кофейня "Beans"</td>
                            <td className="cell_value">Кафе</td>
                            <td className="cell_value">20.10, 09:24</td>
                            <td className="cell_value">- 320</td>
                        </tr>
                        <tr>
                            <td className="cell_value">Место</td>
                            <td className="cell_value">Транспорт</td>
                            <td className="cell_value">20.10, 08.10</td>
                            <td className="cell_value">- 320</td>
                        </tr>
                        <tr>
                            <td className="cell_value">Зарплата</td>
                            <td className="cell_value">Доход</td>
                            <td className="cell_value">07.09</td>
                            <td className="cell_value">+ 120 000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
