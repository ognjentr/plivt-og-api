import * as express from "express";
import AuthorService from './service';
import AuthorController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";

export default class AuthorRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        
        const authorController: AuthorController = new AuthorController(resources); 

        application.get("./author",     authorController.getAll.bind(authorController));
        application.get("/author/:id/", authorController.getById.bind(authorController));
        application.post("/author",     authorController.add.bind(authorController));
        application.put("/author/:id",  authorController.edit.bind(authorController));
        application.delete("/author/:id",authorController.deleteById.bind(authorController));
}
}