"use strict";
// import express  from "express";
// import { userMiddleware } from "../middleware/userMiddleware";
// import { prisma } from "@repo/db/client";
// export const friendRoutes = express.Router();
// friendRoutes.post("/request",userMiddleware,async (req,res)=>{
//     const {receiverId} = req.body;
//     const senderId = req.params.userId;
//     try {
//        const friendRequest = await prisma.friend.create({
//           data : {.
//              senderId : senderId,
//              receiverId : receiverId
//           }
//        })
//       res.status(200).json({
//         msg : "Friend Request Sent",
//         request : friendRequest
//       })
//     }catch{
//         res.status(403).json({
//             msg : "Error while Sending friend request"
//         })
//     }
// })
// friendRoutes.post("/accept",userMiddleware,async (req,res)=>{
//     const {requestedId} = req.body ;
//     const receivedId = req.params.userId; 
//     try {
//         const acceptRequest = await prisma.friend.update({
//           where : {
//             senderId_receiverId: {
//               senderId: requestedId,
//               receiverId: receivedId
//             }
//           } ,
//           data : {
//             status : "ACCEPTED"
//           }
//         })
//         res.status(200).json({
//             msg : "Friend Request Accepted"
//           })
//     }catch{
//         res.status(403).json({
//             msg : "Error while Accepting friend request"
//         })
//     }
// })
// friendRoutes.put("/block",userMiddleware,async (req,res)=>{
//     const {requestedId} = req.body ;
//     const receivedId = req.params.userId; 
//     try {
//         const acceptRequest = await prisma.friend.update({
//           where : {
//             senderId_receiverId: {
//               senderId: requestedId,
//               receiverId: receivedId
//             }
//           } ,
//           data : {
//             status : "BLOCKED"
//           }
//         })
//         res.status(200).json({
//             msg : "Requested Friend has been Blocked"
//           })
//     }catch{
//         res.status(403).json({
//             msg : "Error while Blocking friend "
//         })
//     }
// })
// friendRoutes.put("/declined",userMiddleware,async (req,res)=>{
//     const {requestedId} = req.body ;
//     const receivedId = req.params.userId; 
//     try {
//         const acceptRequest = await prisma.friend.update({
//           where : {
//             senderId_receiverId: {
//               senderId: requestedId,
//               receiverId: receivedId
//             }
//           } ,
//           data : {
//             status : "DECLINED"
//           }
//         })
//         res.status(200).json({
//             msg : "Friend Request has been declined"
//           })
//     }catch{
//         res.status(403).json({
//             msg : "Error while decline friend request "
//         })
//     }
// })
