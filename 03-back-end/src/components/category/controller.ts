import CategoryService from './service';
import {Request, Response, NextFunction} from "express"
import CategoryModel from './model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { iAddCategory, IAddCategoryValidator } from './dto/AddCategory';
import { error } from 'console';
import { iEditCategory, IEditCategoryValidator } from './dto/EditCategory';


class CategoryController{
      private categoryService: CategoryService;

      constructor(categoryService: CategoryService) {
          this.categoryService = categoryService;
      }

      async getAll(req: Request, res: Response, next: NextFunction) {
          const categories = await this.categoryService.getAll();

          res.send(categories);
      } 
      
      async getById(req: Request, res: Response, next: NextFunction) {
         const id: string = req.params.id; 

         const categoryId: number = +id;
         if (categoryId <= 0){
            res.sendStatus(400);
            return;
         }


        const data: CategoryModel|null|IErrorResponse = await this.categoryService.getById(+id);
        

        if (data === null){
            res.sendStatus(404);
            return;
        }

        if (data instanceof CategoryModel){
            res.send(data);
            return;
        }
        res.status(500).send(data);
    }

    async add(req: Request, res: Response, next: NextFunction){
        const data = req.body;

        if(!IAddCategoryValidator(data)) {
            res.status(400).send(IAddCategoryValidator.errors);
            return;
        }

        const result: CategoryModel|IErrorResponse = await this.categoryService.add(data as iAddCategory);

        res.send(result);
    }
    async edit(req: Request, res: Response, NextFunction){
        const id: string = req.params.id; 

         const categoryId: number = +id;
         if (categoryId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
        const data = req.body;
        if(!IEditCategoryValidator(data)) {
            res.status(400).send(IEditCategoryValidator.errors);
            return;
        }
        const result: CategoryModel|IErrorResponse = await this.categoryService.edit(categoryId, data as iEditCategory);
        if (result === null){
            res.sendStatus(404);
            return;
        }
        
        res.send(result);

    }
    async deleteById(req: Request, res: Response, next: NextFunction){
        const id: string = req.params.id; 

         const categoryId: number = +id;
         if (categoryId <= 0){
            res.sendStatus(400).send("Invalid ID number");
            return;
         }
         res.send(await this.categoryService.delete(categoryId));
    }
}

export default CategoryController;

