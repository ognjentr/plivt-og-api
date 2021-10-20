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
                minLength:2,
                maxLength:50,
            },
         
         
            
        },
        required: [
            "name",
        ],
        additionalProperties: false,

});


export {iAddCategory};
export{IAddCategoryValidator};