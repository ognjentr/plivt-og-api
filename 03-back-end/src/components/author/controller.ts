import AuthorService from './service';
import {Request, Response, NextFunction} from "express"
import AuthorModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { iAddAuthor, IAddCategoryValidator } from './dto/AddAuthor';
import { error } from 'console';
import { iEditCategory, IEditCategoryValidator } from './dto/EditAuthor';
import BaseController from '../../common/BaseCoontroler';


class AuthorController extends BaseController{
    authorService: any;
      

      async getAll(req: Request, res: Response, next: NextFunction) {
          const authors = await this.services.authorService.getAll();

          res.send(authors);
      } 
      
      async getById(req: Request, res: Response, next: NextFunction) {
         const id: string = req.params.id; 

         const authorId: number = +id;
         if (authorId <= 0){
            res.sendStatus(400);
            return;
         }


        const data: AuthorModel|null|IErrorResponse = await this.authorService.getById(+id);
        

        if (data === null){
            res.sendStatus(404);
            return;
        }

        if (data instanceof AuthorModel){
            res.send(data);
            return;
        }
        res.status(500).send(data);
    }

    async add(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        if(!IAddAuthorValidator(data)) {
            res.status(400).send(IAddAuthorValidator.errors);
            return;
        }

        const result: AuthorModel|IErrorResponse = await this.authorService.add(data as iAddAuthor);

        res.send(result);
    }
    async edit(req: Request, res: Response, NextFunction){
        const id: string = req.params.id; 

         const authorId: number = +id;
         if (authorId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
        const data = req.body;
        if(!IEditAuthorValidator(data)) {
            res.status(400).send(IEditAuthorValidator.errors);
            return;
        }
        const result: AuthorModel|IErrorResponse = await this.authorService.edit(authorId, data as iEditAuthor);
        if (result === null){
            res.sendStatus(404);
            return;
        }
        
        res.send(result);

    }
    async deleteById(req: Request, res: Response, next: NextFunction){
        const id: string = req.params.id; 

         const authorId: number = +id;
         if (authorId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
         res.send(await this.authorService.delete(authorId));
    }
}

export default AuthorController;

