
import IApplicationResources from "./common/IApplicationResources.interface";
import IRouter from "./common/IRouter.intrface";
import * as express from 'express';

export default class Router{
    static setupRoutes(application: express.Application,resources: IApplicationResources,routers: IRouter[]){
     for (const router of routers){
         router.setupRoutes(application,resources);
     }
    }
}