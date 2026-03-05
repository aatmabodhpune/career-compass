import React from 'react';
import { useParams } from 'react-router-dom';

export const JoinPage: React.FC = () => {
    const { inviteToken } = useParams<{ inviteToken: string }>();

    return (
        <div className="flex h-screen items-center justify-center flex-col">
            <h1 className="text-3xl font-bold">Join Page</h1>
            <p className="mt-4">Invite Token: {inviteToken}</p>
        </div>
    );
};
