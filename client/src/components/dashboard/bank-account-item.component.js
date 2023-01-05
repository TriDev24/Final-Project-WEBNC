import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { styled } from '@xstyled/styled-components';
import { Button, message, Space, Tooltip } from 'antd';
import { useState } from 'react';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    width: 100%;
    border: 1px solid black;
    padding: 0 10px;
    border-radius: 4px;
    margin-bottom: 8px;
`;

const AccountInformation = styled.div``;

const StyledParagraph = styled.p`
    margin: 0;
`;

const ActionFields = styled(Space)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const BankAccountItem = ({
    paymentAccount,
    onSelectPaymentAccountClick,
    bankAccount,
}) => {
    const [isLocked, setLockStatus] = useState(bankAccount.isLocked);
    const isPaymentAccount = bankAccount._id === paymentAccount._id;

    const onChangeToPaymentAccountClick = () => {
        onSelectPaymentAccountClick(bankAccount);
    };

    const toggleLockBankAccount = () => {
        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/${bankAccount._id}`;
        const payload = {
            isLocked: !bankAccount.isLocked,
        };
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        })
            .then(() => {
                message.success('Cập nhật tài khoản thành công');
                setLockStatus(!bankAccount.isLocked);
            })
            .catch((error) => {
                message.error('Khoá tài khoản thất bại');
            });
    };

    const renderSignIfIsPaymentAccountOrButtonIfContrast = () =>
        isPaymentAccount == true ? (
            <i>Mặc định</i>
        ) : (
            <ActionFields direction='horizontal'>
                {isLocked === false && (
                    <Button onClick={onChangeToPaymentAccountClick}>
                        Đặt làm mặc định
                    </Button>
                )}

                <Button
                    icon={
                        isLocked === false ? (
                            <Tooltip title='Khoá tài khoản'>
                                <LockOutlined />
                            </Tooltip>
                        ) : (
                            <Tooltip title='Mở khoá'>
                                <UnlockOutlined />
                            </Tooltip>
                        )
                    }
                    onClick={toggleLockBankAccount}
                />
            </ActionFields>
        );

    const renderAccountNumberText = () => {
        return (
            <>
                {isLocked ? (
                    <del>
                        <strong>Số tài khoản: </strong>
                        {bankAccount.accountNumber}
                    </del>
                ) : (
                    <>
                        <strong>Số tài khoản: </strong>
                        {bankAccount.accountNumber}
                    </>
                )}
            </>
        );
    };

    const renderOverBalanceText = () => {
        return (
            <>
                {isLocked ? (
                    <del>
                        <strong>Số dư: </strong> {bankAccount.overBalance}
                        <i> (VNĐ)</i>
                    </del>
                ) : (
                    <>
                        <strong>Số dư: </strong> {bankAccount.overBalance}
                        <i> (VNĐ)</i>
                    </>
                )}
            </>
        );
    };

    return (
        <Container>
            <AccountInformation>
                <StyledParagraph>{renderAccountNumberText()}</StyledParagraph>
                <StyledParagraph>{renderOverBalanceText()}</StyledParagraph>
            </AccountInformation>
            {renderSignIfIsPaymentAccountOrButtonIfContrast()}
        </Container>
    );
};
