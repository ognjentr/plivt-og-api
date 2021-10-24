import Ajv from "ajv";

interface IEditAuthor{
    name: string;
    
}
const ajv = new Ajv()

const IEditAuthorValidator = ajv.compile({
        type: "object",
        properties: {
            name: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
         
         
            
        },
        required: [
            "name",
        ],
        additionalProperties: false,

});


export {IEditAuthor};
export{IEditAuthorValidator};