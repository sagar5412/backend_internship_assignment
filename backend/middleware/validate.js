export const validate = (schema) => {
    return (req,res,next)=>{
        const {error,value}= schema.validate(req.body,{
            abortEarly:false,
            stripUnknown:true
        })

        if(error){
            const errors = error.details.map(err=>({
                field:err.path[0],
                message:err.message
            }))

            return res.status(400).json({
                success:false,
                message:"Validation failed",
                errors
            })
        }

        req.body=value;
        next();
    }
}

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false
    });
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: error.details[0].message 
      });
    }
    req.params = value;
    next();
  };
};
