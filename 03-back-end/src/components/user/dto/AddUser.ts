import Ajv from "ajv";

interface iAddUser{
    username: string;
    password: string;
    
}
const ajv = new Ajv()

const IAddUserValidator = ajv.compile({
        type: "object",
        properties: {
            username: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
            password: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
        },
        required: [
            "username",
            "password",
        ],
        additionalProperties: false,

});


export {iAddUser};
export{IAddUserValidator};