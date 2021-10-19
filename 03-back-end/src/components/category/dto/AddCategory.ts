import Ajv from "ajv";

interface iAddCategory{
    name: string;
    
}
const ajv = new Ajv()

const IAddCategoryValidator = ajv.compile({
        type: "object",
        properties: {
            name: {
            type: "string",
            minlength:2,
            maxlength:50,
            },
         
         
            
        },
        required: [
            "name",
        ],
        additionalProperties: false,

});


export {iAddCategory};
export{IAddCategoryValidator};