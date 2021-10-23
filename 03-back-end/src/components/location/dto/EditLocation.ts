import Ajv from "ajv";

interface iEditLocation{
    room: number;
    shelf: number;
    
}
const ajv = new Ajv()

const IEditLocationValidator = ajv.compile({
        type: "object",
        properties: {
            room: {
                type: "number",
                minLength:2,
                maxLength:10,
            },
            shelf: {
                type: "number",
                minLength:2,
                maxLength:10,
         
         
            
        },
        required: [
            "room",
            "shelf"
        ],
        additionalProperties: false,

}}
);


export {iEditLocation};
export{IEditLocationValidator};