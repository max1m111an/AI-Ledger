import React from "react";
import "@assets/scss/index.scss";
import { getToday } from "@utils/Date";


export default function Main() {
    return (
        <div className="main_div">
            <div className="action_div big">
                <div className="today title_div">
                    <p className="text title">Сегодня</p>
                    <p className="text addition">{getToday()}</p>
                </div>
                <div className="today statistics_div">

                </div>
                <div className="today reminder_div">

                </div>
                <div className="today write_downs_div">

                </div>
            </div>
            <div className="action_div small">
            </div>
            <div className="action_div big">
            </div>
            <div className="action_div small">
            </div>
        </div>
    );
}
