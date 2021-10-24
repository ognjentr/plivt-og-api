import LocationService from './service';
import {Request, Response, NextFunction} from "express"
import LocationModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddLocation, IAddLocationValidator } from './dto/IAddLocation';
import { error } from 'console';
import { IEditLocation, IEditLocationValidator } from './dto/IEditLocation';
import BaseController from '../../common/BaseController';


class LocationController extends BaseController{
    locationService: any;
      

      async getAll(req: Request, res: Response, next: NextFunction) {
          const locations = await this.services.locationService.getAll();

          res.send(locations);
      } 
      
      async getById(req: Request, res: Response, next: NextFunction) {
         const id: string = req.params.id; 

         const locationId: number = +id;
         if (locationId <= 0){
            res.sendStatus(400);
            return;
         }


        const data: LocationModel|null|IErrorResponse = await this.locationService.getById(+id);
        

        if (data === null){
            res.sendStatus(404);
            return;
        }

        if (data instanceof LocationModel){
            res.send(data);
            return;
        }
        res.status(500).send(data);
    }

    async add(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        if(!IAddLocationValidator(data)) {
            res.status(400).send(IAddLocationValidator.errors);
            return;
        }

        const result: LocationModel|IErrorResponse = await this.locationService.add(data as IAddLocation);

        res.send(result);
    }
    async edit(req: Request, res: Response, NextFunction){
        const id: string = req.params.id; 

         const locationId: number = +id;
         if (locationId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
        const data = req.body;
        if(!IEditLocationValidator(data)) {
            res.status(400).send(IEditLocationValidator.errors);
            return;
        }
        const result: LocationModel|IErrorResponse = await this.locationService.edit(locationId, data as IEditLocation);
        if (result === null){
            res.sendStatus(404);
            return;
        }
        
        res.send(result);

    }
    async deleteById(req: Request, res: Response, next: NextFunction){
        const id: string = req.params.id; 

         const locationId: number = +id;
         if (locationId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
         res.send(await this.locationService.delete(locationId));
    }
}

export default LocationController;

