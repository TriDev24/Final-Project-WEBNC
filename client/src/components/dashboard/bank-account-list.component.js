import { styled } from '@xstyled/styled-components';
import { BankAccountItem } from './bank-account-item.component.js';

const Container = styled.div`
    margin: 20px 4px;
    border-radius: 4px;
`;

export const BankAccountList = ({
    paymentAccount,
    onSelectPaymentAccountClick,
    bankAccounts,
    onGetBankAccounts,
}) => {
    return (
        <Container>
            {bankAccounts.map((b, index) => (
                <BankAccountItem
                    key={index}
                    paymentAccount={paymentAccount}
                    onSelectPaymentAccountClick={onSelectPaymentAccountClick}
                    bankAccount={b}
                    onGetBankAccounts={onGetBankAccounts}
                />
            ))}
        </Container>
    );
};
