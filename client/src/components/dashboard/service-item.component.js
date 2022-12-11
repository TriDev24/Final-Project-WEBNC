import { styled } from '@xstyled/styled-components';
import { Space } from 'antd';

const Container = styled.div`
    text-align: center;
    height: 100px;
    width: 60px;
    margin-right: 30px;
    cursor: pointer;
`;

const Icon = styled.div`
    font-size: 40px;
`;

export const ServiceItem = ({ icon, name, onClick }) => {
    return (
        <Container onClick={onClick}>
            <Space direction='vertical'>
                <Icon>{icon}</Icon>
                <p>{name}</p>
            </Space>
        </Container>
    );
};
