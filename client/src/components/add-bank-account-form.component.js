import { Form, Skeleton, Select } from 'antd';
import { styled } from '@xstyled/styled-components';

const { Option } = Select;

const UserItem = styled.div`
    margin: 1px 0;
`;

const StyledSelect = styled(Select)``;

export const AddBankAccountForm = ({ form, customers }) => {
    const renderUserOptions = () => {
        return (
            <>
                {customers === null ? (
                    <Skeleton />
                ) : (
                    customers.map((c) => (
                        <Option key={c._id}>
                            <UserItem>
                                <div>
                                    <strong>Họ tên: </strong>
                                    {c.firstName + ' ' + c.lastName}
                                </div>
                                <div>
                                    <strong>Tên thường gọi: </strong>
                                    {c.aliasName}
                                </div>
                                <div>
                                    <strong>Email: </strong>
                                    <i>{c.email}</i>
                                </div>
                            </UserItem>
                        </Option>
                    ))
                )}
            </>
        );
    };

    return (
        <Form layout='vertical' form={form}>
            <Form.Item
                label='Người dùng'
                name='identityId'
                rules={[
                    {
                        required: true,
                        message:
                            'Vui lòng chọn người dùng cần tạo tài khoản!!!',
                    },
                ]}>
                <StyledSelect placeholder='Chọn 1 người dùng'>
                    {renderUserOptions()}
                </StyledSelect>
            </Form.Item>
        </Form>
    );
};
