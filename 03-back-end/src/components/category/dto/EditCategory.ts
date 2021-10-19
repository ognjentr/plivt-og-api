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
            minlength:2,
            maxlength:50,
            },
         
         
            
        },
        required: [
            "name",
        ],
        additionalProperties: false,

});


export {iEditCategory};
export{IEditCategoryValidator};