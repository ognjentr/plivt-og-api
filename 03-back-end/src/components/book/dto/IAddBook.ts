import Ajv from "ajv";
import { BookAuthor } from "../model";


interface IAddBook{
    bookNumber: number;
    title: string;
    titleOriginal: string;
    printYear: number;
    pages: number;
    language: string;
    isActive: boolean;
    categoryId: number;
    publisherId: number
    frontSideImage: string
    backSideImage:string
    isbn: string;
    locationId: number;
    authors: BookAuthor[];
}

const ajv = new Ajv()

const IAddBookValidator = ajv.compile({
    type: "object",
    properties: {
        bookNumber: {
            type: "integer",
            minimum: 1,
        },
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
        printYear: {
            type: "integer",
            minimum: 1,
        },
        pages: {
            type: "integer",
            minimum: 1,
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
            minimum: 1,    
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
        authors: {
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    articleId: {
                        type: "number",
                        minimum: 1,
                    },
                    name: {
                        type: "string",
                        minLength: 2,
                        maxLength: 64,
                    }
                },
                required: [
                    "articleId",
                    "name",
                ],
                additionalProperties: false,
            },
        },    
    },
    required: [
        "bookNumber",
        "title",
        "printYear",
        "pages",
        "language",
        "isActive",
        "categoryId",
        "publisherId",
        "locationId",

    ],
    additionalProperties: false,

});


export {IAddBook};
export {IAddBookValidator};

