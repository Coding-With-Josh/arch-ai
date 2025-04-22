import React from 'react';
import Home from '../client-page';
import { auth } from '@/app/api/auth/[...nextauth]/auth-options'

const Page = async () => {
    const session = await auth()
    return (
        <Home session={session}/>
    );
};

export default Page;