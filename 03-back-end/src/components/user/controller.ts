import UserService from './service';
import {Request, Response, NextFunction} from "express"
import UserModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddUser, IAddUserValidator } from './dto/IAddUser';
import { error } from 'console';
import { IEditUser, IEditUserValidator } from './dto/IEditUser';
import BaseController from '../../common/BaseController';


class UserController extends BaseController{
    userService: any;
      

      async getAll(req: Request, res: Response, next: NextFunction) {
          const users = await this.services.userService.getAll();

          res.send();
      } 
      
      async getById(req: Request, res: Response, next: NextFunction) {
         const id: string = req.params.id; 

         const userId: number = +id;
         if (userId <= 0){
            res.sendStatus(400);
            return;
         }


        const data: UserModel|null|IErrorResponse = await this.userService.getById(+id);
        

        if (data === null){
            res.sendStatus(404);
            return;
        }

        if (data instanceof UserModel){
            res.send(data);
            return;
        }
        res.status(500).send(data);
    }

    async add(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        if(!IAddUserValidator(data)) {
            res.status(400).send(IAddUserValidator.errors);
            return;
        }

        const result: UserModel|IErrorResponse = await this.userService.add(data as IAddUser);

        res.send(result);
    }
    async edit(req: Request, res: Response, NextFunction){
        const id: string = req.params.id; 

         const userId: number = +id;
         if (userId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
        const data = req.body;
        if(!IEditUserValidator(data)) {
            res.status(400).send(IEditUserValidator.errors);
            return;
        }
        const result: UserModel|IErrorResponse = await this.userService.edit(userId, data as IEditUser);
        if (result === null){
            res.sendStatus(404);
            return;
        }
        
        res.send(result);

    }
    async deleteById(req: Request, res: Response, next: NextFunction){
        const id: string = req.params.id; 

         const userId: number = +id;
         if (userId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
         res.send(await this.userService.delete(userId));
    }
}

export default UserController;

