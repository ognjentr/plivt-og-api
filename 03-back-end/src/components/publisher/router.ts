import ModelService from './service';
import modelController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import * as express from 'express';
import PublisherController from './controller';

export default class ModelRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        
        const publisherController: PublisherController = new PublisherController(resources); 

        application.get("./publisher",     publisherController.getAll.bind(publisherController));
        application.get("/publisher/:id/", publisherController.getById.bind(publisherController));
        application.post("/publisher",     publisherController.add.bind(publisherController));
        application.put("/publisher/:id",  publisherController.edit.bind(publisherController));
        application.delete("/publisher/:id",publisherController.deleteById.bind(publisherController));
}
}