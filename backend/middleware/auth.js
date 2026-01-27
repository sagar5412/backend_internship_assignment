import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"
import { asyncHandler } from "./asyncHandler.js"

export const protect = asyncHandler(async(req,res,next)=>{
    let token;
    if(!req.headers.authorization && !req.headers.authorization.startsWith("Bearer")){
        return res.status(401).json({
            success:false,
            message:"No Token Provided"
        })
    }

    token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Not Authorized, No Token Provided"
        })
    }
    const secret = process.env.JWT_SECRET || "secret"
    const decoded = jwt.verify(token,secret);

    const user = await prisma.user.findUnique({
        where:{
            id:decoded.id
        },
        select:{
            id:true,
            name:true,
            email:true,
            role:true,
            createdAt:true
        }
    })

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Not Authorized"
        })
    }
    req.user= user.id;
    next();
})