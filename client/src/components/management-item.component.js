import { styled } from '@xstyled/styled-components';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height 160px;
    min-width: 100%;
    margin: 15px 0;
    padding: 20px;
    border: 1px solid lightgray;
    border-radius: 5px;
    &:hover {
        opacity: 0.8;
    }
`;

const StyledParagraph = styled.p`
    margin: 0;
    flex: 1;
`;

const RightPosition = styled.div`
    margin-left: auto;
`;

const StyledButton = styled(Button)`
    min-width: 200px;
`;

export const ManagementItem = ({
    title,
    description,
    actionTitle,
    onItemClick,
}) => {
    return (
        <Container>
            <Title level={3}>{title}</Title>
            <StyledParagraph>{description}</StyledParagraph>

            <RightPosition>
                <StyledButton onClick={onItemClick} type='primary'>
                    {actionTitle}
                </StyledButton>
            </RightPosition>
        </Container>
    );
};
