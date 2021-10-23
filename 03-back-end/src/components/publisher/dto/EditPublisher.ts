import Ajv from "ajv";

interface iEditPublisher{
    name: string;
    city: string;
    country: string;
    yearEstablishment: string;
    
}
const ajv = new Ajv()

const IEditPublisherValidator = ajv.compile({
        type: "object",
        properties: {
            name: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
            city: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
            country: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
            yearEstablishment: {
                type: "string",
                minLength:2,
                maxLength:50,
            },
         
         
            
        },
        required: [
            "name",
            "city",
            "country",
            "yearEstablisment",
        ],
        additionalProperties: false,

});


export {iEditPublisher};
export{IEditPublisherValidator};