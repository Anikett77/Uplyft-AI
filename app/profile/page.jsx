"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        const redirectToProfile = async () => {
            try {
                const res = await axios.get('/api/users/me');
                const userId = res.data.data._id;
                router.push(`/profile/${userId}`);
            } catch (error) {
                console.log(error.message);
                router.push('/login'); // if token is invalid/expired, send to login
            }
        };

        redirectToProfile();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <p>Redirecting to your profile...</p>
        </div>
    );
}