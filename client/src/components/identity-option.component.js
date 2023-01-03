import { Avatar, Button, Dropdown } from 'antd';
import Logout from '../components/logout.component.js';
import ChangePasswordModal from './change-password.component';

const getItem = (label, key, icon, children) => {
    return {
        key,
        icon,
        children,
        label,
    };
};

function IdentityOption() {
    const items = [
        getItem(<ChangePasswordModal></ChangePasswordModal>, '1'),
        getItem(<Logout></Logout>, '2'),
    ];

    return (
        <Dropdown
            menu={{
                items,
            }}
            placement='bottomLeft'
            arrow={{
                pointAtCenter: true,
            }}
            trigger={['click']}>
            <Button
                type='ghost'
                shape='circle'
                icon={
                    <Avatar
                        style={{ marginBottom: '5px' }}
                        src='/images/avatar.png'></Avatar>
                }></Button>
        </Dropdown>
    );
}

export default IdentityOption;
