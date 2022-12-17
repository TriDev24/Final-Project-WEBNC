import { styled } from '@xstyled/styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
    padding: 0 10px;
    border-radius: 4px;
    &:hover {
        background: lightgray;
        cursor: pointer;
        transition: background 0.25s;
    }
`;

const UserInformation = styled.div`
    padding: 0 10px;
`;

const StyledParagraph = styled.p`
    margin: 0;
`;

const UserName = styled.strong`
    font-size: 16px;
`;

export const ReceiverItem = ({ receiver }) => {
    return (
        <Container>
            <Avatar size='large' icon={<UserOutlined />} />
            <UserInformation>
                <UserName>{receiver.aliasName}</UserName>
                <StyledParagraph>{receiver.bankName}</StyledParagraph>
            </UserInformation>
        </Container>
    );
};
