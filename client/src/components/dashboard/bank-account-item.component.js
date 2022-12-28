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
    const isNotPaymentAccount = bankAccount._id !== paymentAccount._id;

    const onChangeToPaymentAccountClick = () => {
        onSelectPaymentAccountClick(bankAccount);
    };

    return (
        <Container>
            <AccountInformation>
                <StyledParagraph>
                    <strong>Số tài khoản:</strong> {bankAccount.accountNumber}
                </StyledParagraph>
                <StyledParagraph>
                    <strong>Số dư:</strong> {bankAccount.overBalance}
                </StyledParagraph>
            </AccountInformation>
            {isNotPaymentAccount && (
                <Button onClick={onChangeToPaymentAccountClick}>
                    Đặt tài khoản thanh toán
                </Button>
            )}
        </Container>
    );
};
