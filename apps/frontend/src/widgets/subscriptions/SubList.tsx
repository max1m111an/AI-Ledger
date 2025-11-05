import React from "react";

export const SubList: React.FC = () => {
    return (
        <div className="table_action_div">
            <table className="sub_table">
                <thead>
                    <tr>
                        <th className="cell_title">Название</th>
                        <th className="cell_title">Цикл</th>
                        <th className="cell_title">След. дата</th>
                        <th className="cell_title">Стоимость</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="cell_value">
                            <span className="test">
                                <svg className="icon">
                                    <use href="#Reminder" />
                                </svg>
                                Spotify
                            </span>
                        </td>
                        <td className="cell_value">Месяц</td>
                        <td className="cell_value">20.10</td>
                        <td className="cell_value">-299</td>
                    </tr>
                    <tr>
                        <td className="cell_value">Яндекс плюс</td>
                        <td className="cell_value">Месяц</td>
                        <td className="cell_value">20.10</td>
                        <td className="cell_value">- 299</td>
                    </tr>
                    <tr>
                        <td className="cell_value">Youtube Premium</td>
                        <td className="cell_value">Месяц</td>
                        <td className="cell_value">22.10</td>
                        <td className="cell_value">- 199</td>
                    </tr>
                    <tr>
                        <td className="cell_value">Adobe</td>
                        <td className="cell_value">Год</td>
                        <td className="cell_value">25.10</td>
                        <td className="cell_value">-1399</td>
                    </tr>
                    <tr>
                        <td className="cell_value">Netflix</td>
                        <td className="cell_value">Месяц</td>
                        <td className="cell_value">17.11</td>
                        <td className="cell_value">-999</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
