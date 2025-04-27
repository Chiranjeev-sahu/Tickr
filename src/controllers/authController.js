const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {ZodError}=require('zod');

const handleError=(res,error,defaultMessage = 'Internal Server Error')=>{
    if(error instanceof ZodError){
        res.status(400).json({message:'Validation error',errors:error.errors});
    }
    console.error(error);
    return res.status(500).json({message:defaultMessage});
};

const signup=async(req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,10);

        const newUser=new User({
            email:req.body.email,
            username:req.body.username,
            password:hashedPassword,
        });

        const savedUser=await newUser.save();

        const token=jwt.sign({userId:savedUser._id,role:savedUser.role},process.env.JWT_SECRET);
        
        res.status(201).json({
            message:'User created successfuly',
            user:{
                _id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username,
                role: savedUser.role
            },
            token,
        });
    }catch(e){
        handleError(res,e,'Signup failed');        
    }
}

const login=async(req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email});

        if(!user){
            res.status(401).json({message:'Invalid credentials'});
        }
        const isValidPassword= await bcrypt.compare(req.body.password,user.password);
         

        if(!isValidPassword){
            return res.status(401).json({message:'Invalid credentials'});
        }

        const token = jwt.sign(
            { userId: user._id,role:user.role},
            process.env.JWT_SECRET
        );

        
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
                username: user.username
            },
            token,
        });
    } catch (error) {
        handleError(res, error, 'Login failed');
    }
};

module.exports={
    signup,
    login,
};