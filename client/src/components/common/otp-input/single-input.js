/* eslint-disable react/jsx-props-no-spreading */
import { styled } from '@xstyled/styled-components';
import React, { useRef, useLayoutEffect } from 'react';
import usePrevious from '../../../hooks/use-previous.js';

const Input = styled.input`
    width: 3rem !important;
    height: 3rem;
    margin: 0 1rem;
    font-size: 2rem;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
`;

export const SingleOTPInputComponent = (props) => {
    const { focus, autoFocus, ...rest } = props;
    const inputRef = useRef(null);
    const prevFocus = usePrevious(!!focus);
    useLayoutEffect(() => {
        if (inputRef.current) {
            if (focus && autoFocus) {
                inputRef.current.focus();
            }
            if (focus && autoFocus && focus !== prevFocus) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }
    }, [autoFocus, focus, prevFocus]);

    return <Input ref={inputRef} {...rest} />;
};

const SingleOTPInput = SingleOTPInputComponent;

export default SingleOTPInput;
