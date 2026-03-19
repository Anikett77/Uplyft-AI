"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SignupPage(){
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })
    const [loading, setLoading] = React.useState(false);
        const [buttonDisabled, setButtonDisabled] = React.useState(true);


    useEffect(() => {
        if(
            user.email.length > 0 && 
            user.password.length > 0 && 
            user.username.length > 0
        ){
            setButtonDisabled(false);
        }else {
            setButtonDisabled(true);
        }
    }, [user]);
    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
            
        } catch (error) {
            console.log("Signup failed", error.response.data.error);
            
            toast.error(error.message);
        }finally {
            setLoading(false);
        }  
    }



  return (
    <div className='absolute w-full h-full'>
      <Spline
        scene="https://prod.spline.design/tM5aVTqwc4uR8a2Q/scene.splinecode" 
      />
      <div className='absolute top-80 left-140 border border-white/10 w-100 h-110 rounded-lg bg-black/30 p-8 backdrop-blur-xs'>
      {loading ? "Signup" : ""}
        <div className='text-white flex flex-col'>Username
        
        <input className=' mt-3 h-12 rounded-lg pl-3 border border-white' id='username' type="text" value={user.username} onChange={(e) => setUser({...user, username: e.target.value })} placeholder='Enter Your Username' />
        </div>
        <div className='text-white flex flex-col mt-3'>Email Address
        
        <input className=' mt-3 h-12 rounded-lg pl-3 border border-white' id='email' type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value })} placeholder='Enter Your Email Address' />
        </div>
        <div className='text-white flex flex-col mt-3'>Password
        
        <input className=' mt-3 h-12 rounded-lg pl-3 border border-white' id='password' type="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value })} placeholder='Enter Your Password' />
        </div>
        <input className='mt-3 mr-1' type="checkbox"/>
        <label className='text-white' htmlFor="remember">keep me logged in</label>
        <button 
  disabled={buttonDisabled}
  onClick={onSignup}
  className='mt-3 w-full py-3 from-purple-700 to-blue-600 bg-linear-to-l rounded-lg text-white disabled:opacity-50'
>
  {buttonDisabled ? "Fill all the fields" : "Signup"}
</button>
                {/* Divider */}
        <div className="flex items-center gap-3 my-3">
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

      {/* Signup */}
      <p className="text-center text-sm text-white/60 mt-3">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
          Login
        </Link>
      </p>
      </div>
    </div>
  )
}