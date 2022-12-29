import { styled } from '@xstyled/styled-components';
import { ManagementItem } from './management-item.component';

const Container = styled.div``;

export const ManagementList = ({ sources }) => {
    return (
        <Container>
            {sources.map((s) => (
                <ManagementItem
                    title={s.title}
                    description={s.description}
                    actionTitle={s.actionTitle}
                    onItemClick={s.onItemClick}
                />
            ))}
        </Container>
    );
};
