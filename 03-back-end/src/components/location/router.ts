import LocationService from './service';
import LocationController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import * as express from 'express';


export default class LocationRouter implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources){
        
        const locationController: LocationController = new LocationController(resources); 

        application.get("./location",     locationController.getAll.bind(locationController));
        application.get("/location/:id/", locationController.getById.bind(locationController));
        application.post("/location",     locationController.add.bind(locationController));
        application.put("/location/:id",  locationController.edit.bind(locationController));
        application.delete("/location/:id",locationController.deleteById.bind(locationController));
}
}