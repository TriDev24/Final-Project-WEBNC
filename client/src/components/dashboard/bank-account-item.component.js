import { styled } from '@xstyled/styled-components';
import { Button } from 'antd';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    width: 100%;
    border: 1px solid black;
    padding: 0 10px;
    border-radius: 4px;
`;

const AccountInformation = styled.div``;

const StyledParagraph = styled.p`
    margin: 0;
`;

export const BankAccountItem = ({ bankAccount }) => {
    const isNotPaymentAccount = bankAccount.isPayment === false;

    const onChangeToPaymentAccountClick = async () => {
        const url = `${process.env.REACT_APP_BANK_ACCOUNT_API_URL_PATH}/${bankAccount._id}`;
        const data = {
            isPayment: true,
        };

        await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: data,
        });
    };

    return (
        <Container>
            <AccountInformation>
                <StyledParagraph>
                    Account Number: {bankAccount.accountNumber}
                </StyledParagraph>
                <StyledParagraph>
                    Over Balance: {bankAccount.overBalance}
                </StyledParagraph>
            </AccountInformation>
            {isNotPaymentAccount && (
                <Button onChange={onChangeToPaymentAccountClick}>
                    Set Is Payment
                </Button>
            )}
        </Container>
    );
};
