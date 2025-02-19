// components/Slider.tsx

import React from 'react';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min, max }) => {
    const sliderStyle: React.CSSProperties = {
        position: 'fixed',
        top: '10px',
        left: '10px',
        width: '120px',
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(event.target.value));
    };

    return (
        <>
            <style>
                {`
                    input[type="range"] {
                        -webkit-appearance: none;
                        background: transparent;
                    }
                    input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        background: #578FCA;
                        cursor: pointer;
                        margin-top: -6px;
                    }
                    input[type="range"]::-webkit-slider-runnable-track {
                        width: 100%;
                        height: 4px;
                        background: #A5BFCC;
                        border-radius: 2px;
                    }
                `}
            </style>
            <input
                type="range"
                min={min}
                max={max}
                style={sliderStyle}
                value={value}
                onChange={handleChange}
            />
        </>
    );
};

export default Slider;
