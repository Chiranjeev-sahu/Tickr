const { z } =require('zod');

const signupSchema=z.object({
    email: z.string().email(),
    username: z.string().min(3).max(30),
    password: z.string(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const validateSignup=(req,res,next)=>{
    const result=signupSchema.safeParse(req.body);
    if(result.success){
        next();
    }
    else{
        res.status(400).json({message:'validation err',errors:result.error.errors});
    }
};

const validateLogin = (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
    if (result.success) {
        next();
    } else {
        return res.status(400).json({ message: 'Validation Error', errors: result.error.errors }); 
    }
};

module.exports={
    validateSignup,
    validateLogin
};