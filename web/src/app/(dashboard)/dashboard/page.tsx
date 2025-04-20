import { auth } from '@/app/api/auth/[...nextauth]/auth-options';

import React from 'react';
import LogoutButton from '../_components/logout-btn';

const DashboardPage = async() => {
    const session = await auth()
    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Welcome {session?.user.name}</p>
            {/* Add your dashboard widgets or components here */}
            <LogoutButton/>
        </div>
    );
};

export default DashboardPage;