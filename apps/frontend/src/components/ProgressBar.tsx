import React from "react";
import "@assets/scss/index.scss";


interface ProgressBarProps {
    current: number;
    max: number;
    height?: number;
}

const ProgressBar = ({
    current, max,
}: ProgressBarProps) => {
    const normalizedCurrent = Math.max(0, Math.min(current, max));
    const progress = max === 0 ? 0 : ((max - normalizedCurrent) / max) * 100;

    const getProgressColor = () => {
        if (progress < 33) {
            return "red";
        }

        if (progress < 66) {
            return "yellow";
        }

        return "green";
    };

    return (
        <div className="progressBar_div">
            <div
                className={ `progressBar_fill ${getProgressColor()}` }
                style={ { width: `${progress}%` } }
            />
        </div>
    );
};

export default ProgressBar;
