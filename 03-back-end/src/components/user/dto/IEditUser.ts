import Ajv from "ajv";

interface IEditUser{
    username: string;
    password: string
    
}
const ajv = new Ajv()

const IEditUserValidator = ajv.compile({
        type: "object",
        properties: {
            username: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
         
         
            
        },
        required: [
            "username",
        ],
        additionalProperties: false,

});


export {IEditUser};
export{IEditUserValidator};