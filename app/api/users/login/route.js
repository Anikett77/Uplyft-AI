import {connect} from "@/app/dbConfig/dbConfig";
import User from "@/app/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request){
    try {

        const reqBody = await request.json()
        const {email, password} = reqBody;

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        
        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
                path: "/",        // ✅ yeh add karo
    sameSite: "lax",
        });

        return response;

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}