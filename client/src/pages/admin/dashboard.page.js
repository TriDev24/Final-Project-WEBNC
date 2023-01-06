import { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Checkbox, message, Modal, Skeleton, Table } from 'antd';
import styled from '@xstyled/styled-components';
import Title from 'antd/es/typography/Title.js';
import { CreateEmployeeForm } from '../../components/create-employee-form.component.js';
import ContentLayout from '../../components/common/content-layout.component.js';

const FlexLayout = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const AdminDashboardPage = () => {
    const [listEmployee, setListEmployee] = useState(null);

    const [isAddEmloyeeModalVisible, setAddEmloyeeModalVisibility] =
        useState(false);

    const handleAddEmloyeeClick = () => {
        setAddEmloyeeModalVisibility(!isAddEmloyeeModalVisible);
    };

    const historyColumns = useMemo(
        () => [
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Tên',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Họ',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phoneNumber',
                key: 'phoneNumber',
            },
        ],
        []
    );

    useEffect(() => {
        getListEmployee();
    }, []);

    const getListEmployee = useCallback(() => {
        const url = `${process.env.REACT_APP_USER_API_URL_PATH}?role=employee`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accessToken'),
            },
        })
            .then((response) => response.json())
            .then((data) => setListEmployee(data));
    }, []);

    const renderListEmployee = () => {
        if (!listEmployee) {
            return <Skeleton />;
        } else {
            // Danh sách nhân viên
            // const receiveBillings = paymentAccountHistory.filter(
            //     (p) => p.type === 'receive'
            // );
            const mappedListEmployee = listEmployee.map((r, index) => {
                return {
                    key: index,
                    email: r.email,
                    firstName: r.firstName,
                    lastName: r.lastName,
                    phoneNumber: r.phoneNumber,
                };
            });

            return (
                <>
                    <p>
                        <strong>
                            <i>Danh sách nhân viên</i>
                        </strong>
                    </p>
                    <Table
                        columns={historyColumns}
                        dataSource={mappedListEmployee}
                    />
                </>
            );
        }
    };

    const ListEmployee = styled.div``;

    return (
        <ContentLayout>
            <ListEmployee>
                <FlexLayout>
                    <Title level={2}>Danh sách nhân viên</Title>
                    <Button type='primary' onClick={handleAddEmloyeeClick}>
                        Thêm nhân viên
                    </Button>
                </FlexLayout>
                {renderListEmployee()}
            </ListEmployee>

            <Modal
                title='Thêm nhân viên'
                centered
                open={isAddEmloyeeModalVisible}
                onOk={handleAddEmloyeeClick}
                onCancel={handleAddEmloyeeClick}>
                <CreateEmployeeForm />
            </Modal>
        </ContentLayout>
    );
};
