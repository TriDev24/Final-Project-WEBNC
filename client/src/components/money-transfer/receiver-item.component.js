import { styled } from '@xstyled/styled-components';
import { Avatar, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Paragraph from 'antd/es/typography/Paragraph';
import { useState } from 'react';

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
    padding: 0 10px;
`;

const UserInformation = styled.div`
    padding: 0 10px;
`;

const StyledParagraph = styled.p`
    margin: 0;
`;

const UserName = styled(Paragraph)`
    font-size: 16px;
`;

export const ReceiverItem = ({ receiver, onSelectItemClick }) => {
    const [aliasName, setAliasName] = useState(receiver.aliasName);
    const handleClick = () => {
        onSelectItemClick(receiver);
    };

    const onNameChange = (value) => {
        console.log('changed value: ', value);
        const url = `${process.env.REACT_APP_RECEIVER_API_URL_PATH}/${receiver._id}`;
        const payload = {
            aliasName: value,
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(payload),
        }).then(() => setAliasName(value));
    };

    return (
        <Container onClick={handleClick}>
            <Avatar size='large' icon={<UserOutlined />} />
            <UserInformation>
                <UserName
                    editable={{
                        text: aliasName,
                        onChange: onNameChange,
                    }}>
                    <strong>{aliasName}</strong>
                </UserName>
                <StyledParagraph>{receiver.bankType.name}</StyledParagraph>
            </UserInformation>
        </Container>
    );
};
