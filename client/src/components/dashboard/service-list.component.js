import { styled } from '@xstyled/styled-components';
import { ServiceItem } from './service-item.component.js';

const Container = styled.div`
    display: flex;
`;

export const ServiceList = ({ sources }) => {
    return (
        <Container>
            {sources.map((s) => (
                <ServiceItem icon={s.icon} name={s.name} onClick={s.onClick} />
            ))}
        </Container>
    );
};
