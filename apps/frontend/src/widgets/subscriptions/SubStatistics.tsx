import React from "react";

export const SubStatistics: React.FC = () => {
    return (
        <div className="action_block_1 w-30">
            <span className="title">Итоги</span>
            <span className="addition_3 mb-20">Ежемесячные и годовые расходы на подписки</span>
            <div className="action_block_2 fd-r b-r mb">
                <div className="sub_every_div">
                    <span className="addition_2">Ежемесячно</span>
                    <span className="spent_money fs-30">-1 796</span>
                </div>
                <div className="sub_every_div">
                    <span className="addition_2">Ежегодно</span>
                    <span className="spent_money fs-30">-22 951</span>
                </div>
            </div>
            <div className="action_block_2 fg-1">
            </div>
        </div>
    );
};
