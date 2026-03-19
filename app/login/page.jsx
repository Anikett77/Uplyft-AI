"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function LoginPage(){
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(true);

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful!");
            router.push("/profile"); // ya jahan bhi redirect karna ho
        } catch (error) {
            console.log("Login failed", error.response.data.error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='relative w-full h-screen overflow-hidden'>

            {/* Spline Background */}
            <div className='absolute inset-0'>
                <Spline
                scene="https://prod.spline.design/tM5aVTqwc4uR8a2Q/scene.splinecode" 
                />
            </div>

            {/* Form */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/10 w-96 rounded-lg bg-black/30 p-8 backdrop-blur-sm'>

                <h2 className='text-white text-2xl font-bold mb-6 text-center'>Welcome Back</h2>

                <div className='text-white flex flex-col'>
                    Email Address
                    <input
                        className='mt-3 h-12 rounded-lg pl-3 border border-white/30 bg-white/5 text-white'
                        id='email'
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        placeholder='Enter Your Email Address'
                    />
                </div>

                <div className='text-white flex flex-col mt-4'>
                    Password
                    <input
                        className='mt-3 h-12 rounded-lg pl-3 border border-white/30 bg-white/5 text-white'
                        id='password'
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                        placeholder='Enter Your Password'
                    />
                </div>

                <div className='flex items-center mt-4'>
                    <input className='mr-2' type="checkbox"/>
                    <label className='text-white/60 text-sm' htmlFor="remember">Keep me logged in</label>
                </div>

                <button
                    disabled={buttonDisabled || loading}
                    onClick={onLogin}
                    className='mt-4 w-full py-3 bg-gradient-to-l from-purple-700 to-blue-600 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? "Loading..." : buttonDisabled ? "Fill all the fields" : "Sign In"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-xs text-white/50 px-2">or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                {/* Google */}
                <button
                    type="button"
                    className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    Continue with Google
                </button>

                <p className="text-center text-sm text-white/60 mt-4">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}