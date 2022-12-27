import { styled } from '@xstyled/styled-components';
import { Button, message } from 'antd';

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

export const BankAccountItem = ({
    paymentAccount,
    onSelectPaymentAccountClick,
    bankAccount,
}) => {
    const isPaymentAccount = bankAccount._id === paymentAccount._id;

    const onChangeToPaymentAccountClick = () => {
        onSelectPaymentAccountClick(bankAccount);
    };

    const renderSignIfIsPaymentAccountOrButtonIfContrast = () =>
        isPaymentAccount == true ? (
            <i>Mặc định</i>
        ) : (
            <Button onClick={onChangeToPaymentAccountClick}>
                Đặt làm mặc định
            </Button>
        );

    return (
        <Container>
            <AccountInformation>
                <StyledParagraph>
                    <strong>Account Number:</strong> {bankAccount.accountNumber}
                </StyledParagraph>
                <StyledParagraph>
                    <strong>Over Balance:</strong> {bankAccount.overBalance}
                </StyledParagraph>
            </AccountInformation>
            {renderSignIfIsPaymentAccountOrButtonIfContrast()}
        </Container>
    );
};
