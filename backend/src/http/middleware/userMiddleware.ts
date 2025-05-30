// import { NextFunction, Request, Response } from "express"
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// const jwt_secret = process.env.JWT_SECRET;

// export const userMiddleware = async (req : Request,res : Response,next : NextFunction) =>{
//     const header = req.headers.authorization;
//      try {
//         if( !(header?.startsWith("Bearer")) && header !== ""){
//             res.status(401).json({
//                 msg : "header is empty or invalid"
//             })
//             return
//         }
//             const token = header.split(" ")[1];
//             const decode = jwt.decode(token);
//             if (typeof decode === "object" && decode !== null && "userId" in decode) {
//                 req.params.userId = (decode as jwt.JwtPayload).userId;
//                 next();
//             } else {
//                 res.status(400).json({
//                     msg: "Invalid token payload"
//                 });
//                 return;
//             }
//      }catch{
//         res.status(403).json({
//             msg : "user authorization error"
//         })
//      }
// }