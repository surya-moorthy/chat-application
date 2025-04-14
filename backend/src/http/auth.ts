import { Router } from "express";
import bcrypt from "bcrypt";
export const authRoutes = Router();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const jwtsecret : string = process.env.JWT_SECRET || "keysecret";

const RegisterSchema = z.object({
    username : z.string(),
    email : z.string(),
    password : z.string()
})

const LoginSchema = z.object({
    email : z.string(),
    password : z.string()
})
const ResetSchema = z.object({
    email : z.string(),
    newpassword : z.string()
})

authRoutes.post('/register',async (req,res)=>{
   const {success} = RegisterSchema.safeParse(req.body);
   if (!success) {
       res.status(400).json({
         msg : "Invalid Inputs"
       })
   }
   const {username,password,email} = req.body;
   try {
      
      const salt = await  bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(password,salt);
      const userResponse = await prisma.user.create({
         data : {
            username : username,
            password_hash : hashedpass,
            email : email
         }
      }
      )

      res.status(200).json({
         msg : "User created Successfully",
         response : userResponse
      })
   }catch(e){
      res.status(403).json({
         msg : "Error has happened",
         err : e
      })
   }
})

authRoutes.post("/login",async (req,res)=>{
  const {success} = LoginSchema.safeParse(req.body);
  if (!success) {
   res.status(401).json({
      msg : "Invalid Inputs"
   })
   return 
}

   type loginRequest = z.infer<typeof LoginSchema>;

   const {email,password} = req.body as loginRequest;
   try {
      const user  = await prisma.user.findFirst({
        where : {
           email: email 
        }    
      })
      if (!user) {
         res.status(401).json({
            msg : "your are not registered"
         })
         return
      }
  
      const passverify = bcrypt.compare(password,user?.password_hash as string);
      if (!passverify) {
         res.status(401).json({
            msg : "Password Invalid"
         })
      }
      const jwtToken =  jwt.sign({userId: user?.id,email},jwtsecret, {expiresIn : '10min'});
      res.status(200).json({
         msg : "User logged in Successfully",
         token : jwtToken
      })
   }
   catch(e){
        res.status(403).json({
         msg : "An Error occured",
         err : e
        })
   }
})

authRoutes.post("/logout",async (req,res)=>{
      res.status(200).json({
         msg : "User Logged out successfully"
      })
    
})


authRoutes.post("/password/reset",async (req,res)=>{
   const {success} = ResetSchema.safeParse(req.body);

   if(!success) {
      res.status(401).json({  msg : "Invalid Inputs"  })
      return
   }
   type resetRequest = z.infer<typeof ResetSchema>;
   const {email,newpassword} = req.body as resetRequest;
   try {
      const salt = await  bcrypt.genSalt(10);
      const hashedpass = await bcrypt.hash(newpassword,salt);
      await prisma.user.update({
         where : {
            email : email
         },
         data : {
            password_hash : hashedpass
         }
      })
      res.status(200).json({ msg : "Password reset Successfully"})
   } catch(e) {
       res.status(403).json({ 
         msg : "error occured",
         err : e
        })
   }  
})


