import Ajv from "ajv";

interface IAddAuthor{
    name: string;
    
}
const ajv = new Ajv()

const IAddAuthorValidator = ajv.compile({
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


export {IAddAuthor};
export{IAddAuthorValidator};