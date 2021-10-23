import * as express from "express";
import UserService from './service';
import UserController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.intrface";

export default class UserRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        
        const userController: UserController = new UserController(resources); 

        application.get("./user",     userController.getAll.bind(userController));
        application.get("/user/:id/", userController.getById.bind(userController));
        application.post("/user",     userController.add.bind(userController));
        application.put("/user/:id",  userController.edit.bind(userController));
        application.delete("/user/:id",userController.deleteById.bind(userController));
}
}