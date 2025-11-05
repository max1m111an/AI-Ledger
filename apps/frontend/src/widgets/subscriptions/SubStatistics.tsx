import React from "react";

export const SubStatistics: React.FC = () => {
    return (
        <div className="action_block_1 w30">
            <span className="title fs-20">Итоги</span>
            <span className="addition_3 mb-7">Ежемесячные и годовые расходы на подписки</span>
            <div className="action_block_2 fd-r b-r mb">
                <div className="sub_every_div">
                    <span className="text addition_1">Ежемесячно</span>
                    <span className="text addition_1 spent_money">-1 796</span>
                </div>
                <div className="sub_every_div">
                    <span className="text addition_1">Ежегодно</span>
                    <span className="text addition_1 spent_money">-22 951</span>
                </div>
            </div>
            <div className="action_block_2 fg-1">
            </div>
        </div>
    );
};
