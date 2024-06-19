import {body, validationResult,check,param} from 'express-validator'
import { ErrorHandler } from '../utils/utility.js';


const validateHandler=(req,res,next)=>{
    const errors=validationResult(req);
    


    const errorMessages=errors.array().map((error)=>error.msg).join(", ");

    
    console.log(errorMessages);

    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages,400))
};

const registerValidator=()=>[
    body("name","Please Enter Name ").notEmpty(),
    body("username","Please Enter Username ").notEmpty(),
    body("bio","Please Enter Bio ").notEmpty(),
    body("password","Please Enter Password ").notEmpty(),
    check("avatar","Please Upload Avatar").notEmpty(),
];

const loginValidator=()=>[ 
    body("username","Please Enter Username ").notEmpty(),
    body("password","Please Enter Password ").notEmpty(),
];

const newGroupValidator=()=>[ 
    body("name","Please Enter Name ").notEmpty(),
    body("members").notEmpty().withMessage("Please Enter Members").isArray({min:2,max:100}).withMessage("Members must be between 2 and 100"),
];

const addMemberValidator=()=>[ 
    body("chatId","Please Enter Chat Id ").notEmpty(),
    body("members").notEmpty().withMessage("Please Enter Members").isArray({min:1,max:97}).withMessage("Members must be between 1 and 97"),
];

const removeMemberValidator=()=>[ 
    body("chatId","Please Enter Chat Id ").notEmpty(),
    body("userId","Please Enter User Id ").notEmpty(),
];

const leaveGroupValidator=()=>[ 
    param("chatId","Please Enter Chat Id ").notEmpty(),
    
];

const sendAttachmentValidator=()=>[ 
    param("id","Please Enter Chat Id ").notEmpty(),
    
];





export {registerValidator,validateHandler,loginValidator,newGroupValidator,addMemberValidator,removeMemberValidator,leaveGroupValidator};