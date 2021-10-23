import Ajv from "ajv";


    interface iAddBook{
        title: string;
        titleOriginal: string;
        pages: number;
        language: string;
        isActive: boolean;
        categoryId: number;
        publisherId: number
        frontSideImage: string
        backSideImage:string
        isbn: string;
        locationId: number;
        
        
    }
    const ajv = new Ajv()
    
    const IAddBookValidator = ajv.compile({
            type: "object",
            properties: {
                title: {
                    type: "string",
                    minLength:2,
                    maxLength:60,
                },
                titleOriginal: {
                    type: "string",
                    minLength:2,
                    maxLength:60,
                },
                pages: {
                    type: "number",
                    minLength:2,
                    maxLength:50,
                },
                language: {
                    type: "string",
                    minLength:2,
                    maxLength:50,
                },
                isActive: {
                    type: "boolean",
                    
                },
                categoryId: {
                    type: "integer",
                    minimum: 1,
                    
                },
                publisherId: {
                    type: "integer",
                    minLength:2,
            
                },
                frontSideImage: {
                    type: "string",
                    minLength:2,
                    maxLength:64,
                },
                backSideiImage: {
                    type: "string",
                    minLength:2,
                    maxLength:64,
                },
                isbn: {
                    type: "string",
                    minLength:2,
                    maxLength:64,
                },
                locationId: {
                    type: "integer",
                    minimum: 1,
                    
                },

             
             
                
            },
            required: [
                "name",
            ],
            additionalProperties: false,
    
    });
    
    
    export {iAddBook};
    export{IAddBookValidator};

