import React, { useMemo } from 'react';
import { AdminLayout } from '../../components/common/admin-layout.component.js';
import { ManagementList } from '../../components/management-list.component.js';

export const AdminDashboardPage = () => {
    const settingItems = useMemo(
        [
            {
                title: 'Tạo tài khoản khách hàng',
                description:
                    'Thêm những thông tin cơ bản của khách hàng, và hệ thống tự phát sinh 01 tài khoản thanh toán cho tài khoản khách hàng',
                actionTitle: 'Tạo tài khoản',
                onItemClick: () => {},
            },
            {
                title: 'Tạo tài khoản khách hàng',
                description:
                    'Thêm những thông tin cơ bản của khách hàng, và hệ thống tự phát sinh 01 tài khoản thanh toán cho tài khoản khách hàng',
                actionTitle: 'Tạo tài khoản',
                onItemClick: () => {},
            },
            {
                title: 'Tạo tài khoản khách hàng',
                description:
                    'Thêm những thông tin cơ bản của khách hàng, và hệ thống tự phát sinh 01 tài khoản thanh toán cho tài khoản khách hàng',
                actionTitle: 'Tạo tài khoản',
                onItemClick: () => {},
            },
        ],
        []
    );

    return (
        <AdminLayout>
            <ManagementList sources={settingItems} />
        </AdminLayout>
    );
};
