import Ajv from "ajv";

interface iEditCategory{
    name: string;
    
}
const ajv = new Ajv()

const IEditCategoryValidator = ajv.compile({
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


export {iEditCategory};
export{IEditCategoryValidator};