import PublisherService from './service';
import {Request, Response, NextFunction} from "express"
import PublisherModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddPublisher, IAddPublisherValidator } from './dto/IAddPublisher';
import { error } from 'console';
import { IEditPublisher, IEditPublisherValidator } from './dto/IEditPublisher';
import BaseController from '../../common/BaseController';


class PublisherController extends BaseController{
    publisherService: any;
      

      async getAll(req: Request, res: Response, next: NextFunction) {
          const publishers = await this.services.publisherService.getAll();

          res.send(publishers);
      } 
      
      async getById(req: Request, res: Response, next: NextFunction) {
         const id: string = req.params.id; 

         const publisherId: number = +id;
         if (publisherId <= 0){
            res.sendStatus(400);
            return;
         }


        const data: PublisherModel|null|IErrorResponse = await this.publisherService.getById(+id);
        

        if (data === null){
            res.sendStatus(404);
            return;
        }

        if (data instanceof PublisherModel){
            res.send(data);
            return;
        }
        res.status(500).send(data);
    }

    async add(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        if(!IAddPublisherValidator(data)) {
            res.status(400).send(IAddPublisherValidator.errors);
            return;
        }

        const result: PublisherModel|IErrorResponse = await this.publisherService.add(data as IAddPublisher);

        res.send(result);
    }
    async edit(req: Request, res: Response, NextFunction){
        const id: string = req.params.id; 

         const publisherId: number = +id;
         if (publisherId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
        const data = req.body;
        if(!IEditPublisherValidator(data)) {
            res.status(400).send(IEditPublisherValidator.errors);
            return;
        }
        const result: PublisherModel|IErrorResponse = await this.publisherService.edit(publisherId, data as IEditPublisher);
        if (result === null){
            res.sendStatus(404);
            return;
        }
        
        res.send(result);

    }
    async deleteById(req: Request, res: Response, next: NextFunction){
        const id: string = req.params.id; 

         const publisherId: number = +id;
         if (publisherId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
         res.send(await this.publisherService.delete(publisherId));
    }
}

export default PublisherController;

