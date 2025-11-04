import React from "react";
import "@assets/scss/index.scss";

export const SubscriptionsWidget: React.FC = () => {
    return (
        <div className="subscriptions_widget">
            <span className="sub title">Подписки</span>
            <span className="sub addition_2">Активные подписки и ближайшие списания</span>
            <div className="sub_block">
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
                                <td className="cell_value">1</td>
                                <td className="cell_value">1</td>
                                <td className="cell_value">1</td>
                                <td className="cell_value">1</td>
                            </tr>
                            <tr>
                                <td className="cell_value">1</td>
                                <td className="cell_value">1</td>
                                <td className="cell_value">1</td>
                                <td className="cell_value">1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="sub_action_div"></div>
            </div>
        </div>
    );
};
