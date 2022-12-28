import React, { useState } from 'react';
import SingleInput from './single-input.js';

export function OTPInputComponent(props) {
    const {
        length,
        isNumberInput,
        autoFocus,
        disabled,
        onChangeOTP,
        inputClassName,
        inputStyle,
        ...rest
    } = props;

    const [activeInput, setActiveInput] = useState(0);
    const [otpValues, setOTPValues] = useState(Array(length).fill(''));

    // Helper to return OTP from inputs
    const handleOtpChange = (otp) => {
        console.log('in otp change: ', otp);
        const otpValue = otp.join('');
        onChangeOTP(otpValue);
    };

    // Helper to return value with the right type: 'text' or 'number'
    const getRightValue = (str) => {
        let changedValue = str;

        if (!isNumberInput || !changedValue) {
            return changedValue;
        }

        return Number(changedValue) >= 0 ? changedValue : '';
    };

    // Change OTP value at focussing input
    const changeCodeAtFocus = (str) => {
        const updatedOTPValues = [...otpValues];
        updatedOTPValues[activeInput] = str[0] || '';
        setOTPValues(updatedOTPValues);
        handleOtpChange(updatedOTPValues);
    };

    // Focus `inputIndex` input
    const focusInput = (inputIndex) => {
        const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
        setActiveInput(selectedIndex);
    };

    const focusPrevInput = () => {
        focusInput(activeInput - 1);
    };

    const focusNextInput = () => {
        focusInput(activeInput + 1);
    };

    // Handle onFocus input
    const handleOnFocus = (index) => () => {
        focusInput(index);
    };

    // Handle onChange value for each input
    const handleOnChange = (e) => {
        const val = getRightValue(e.currentTarget.value);
        if (!val) {
            e.preventDefault();
            return;
        }
        changeCodeAtFocus(val);
        focusNextInput();
    };

    // Handle onBlur input
    const onBlur = () => {
        setActiveInput(-1);
    };

    // Handle onKeyDown input
    const handleOnKeyDown = (e) => {
        const pressedKey = e.key;

        switch (pressedKey) {
            case 'Backspace':
            case 'Delete': {
                e.preventDefault();
                if (otpValues[activeInput]) {
                    changeCodeAtFocus('');
                } else {
                    focusPrevInput();
                }
                break;
            }
            case 'ArrowLeft': {
                e.preventDefault();
                focusPrevInput();
                break;
            }
            case 'ArrowRight': {
                e.preventDefault();
                focusNextInput();
                break;
            }
            default: {
                if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
                    e.preventDefault();
                }

                break;
            }
        }
    };

    const handleOnPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text/plain')
            .trim()
            .slice(0, length - activeInput)
            .split('');
        if (pastedData) {
            let nextFocusIndex = 0;
            const updatedOTPValues = [...otpValues];
            updatedOTPValues.forEach((val, index) => {
                if (index >= activeInput) {
                    const changedValue = getRightValue(
                        pastedData.shift() || val
                    );
                    if (changedValue) {
                        updatedOTPValues[index] = changedValue;
                        nextFocusIndex = index;
                    }
                }
            });
            setOTPValues(updatedOTPValues);
            setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
        }
    };

    return (
        <div {...rest}>
            {Array(length)
                .fill('')
                .map((_, index) => (
                    <SingleInput
                        key={`single-input-${index}`}
                        type={isNumberInput ? 'number' : 'text'}
                        focus={activeInput === index}
                        value={otpValues && otpValues[index]}
                        autoFocus={autoFocus}
                        onFocus={handleOnFocus(index)}
                        onChange={handleOnChange}
                        onKeyDown={handleOnKeyDown}
                        onBlur={onBlur}
                        onPaste={handleOnPaste}
                        style={inputStyle}
                        className={inputClassName}
                        disabled={disabled}
                    />
                ))}
        </div>
    );
}

const OTPInput = OTPInputComponent;
export default OTPInput;
