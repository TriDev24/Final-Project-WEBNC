import { styled } from '@xstyled/styled-components';
import { BankAccountItem } from './bank-account-item.component.js';

const Container = styled.div`
    margin: 20px 4px;
    border-radius: 4px;
`;

export const BankAccountList = ({ bankAccounts }) => {
    return (
        <Container>
            {bankAccounts.map((b) => (
                <BankAccountItem bankAccount={b} />
            ))}
        </Container>
    );
};
