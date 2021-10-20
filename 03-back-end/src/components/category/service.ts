import CategoryModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";
import { iAddCategory } from "./dto/AddCategory";
import { error } from "console";
import BaseService from '../../services/BaseService';
import { iEditCategory } from "./dto/EditCategory";


class CategoryModelAdapterOptions implements IModelAdapterOptions{


}

class CategoryService extends BaseService<CategoryModel> {
    
    
    protected async adaptModel (
        row: any,
        options: IModelAdapterOptions = {}
        ): Promise<CategoryModel>{
        const item: CategoryModel =new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        
        return item;
    }

    public async getAll(): Promise<CategoryModel[]| IErrorResponse>{
        return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
            'category',
            'categoryId',
            null);
        
    }
    
    public async getById(categoryId: number): Promise<CategoryModel|null|IErrorResponse>{
        return await this.getByIdFromTable("category", categoryId);
        
        
    }
    public async add(data: iAddCategory): Promise<CategoryModel|IErrorResponse>{
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             category
              SET
               name = ?
               WHERE
               category_id;`;
            this.db.execute(sql, [data.name])
            .then(async result =>{
                const insertinfo: any = result[0];
                    const newCategoryId: number = +(insertinfo?.insertId)
                    resolve(await this.getById(newCategoryId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async edit(categoryId: number, data: iEditCategory): Promise<CategoryModel|IErrorResponse|null>{
        const result = await this.getById(categoryId);

        if (result === null){
         return null;   
        }

        if (!(result instanceof CategoryModel)) {
          return result;
        }
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             category
            SET
                name = ?,
            WHERE
                category_id;`;
            this.db.execute(sql, [data.name,categoryId])
            .then(async result =>{
                resolve( await this.getById(categoryId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
}
export default CategoryService;


