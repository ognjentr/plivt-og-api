import CategoryModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";
import { IAddCategory } from "./dto/IAddCategory";
import { error } from "console";
import BaseService from '../../services/BaseService';
import { IEditCategory } from "./dto/IEditCategory";


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

    public async getAll(
        options: Partial<CategoryModelAdapterOptions> = {

        }
    ): Promise<CategoryModel[]| IErrorResponse>{
        return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
            'category',
            'categoryId',
            null,
            options
            );
        
    }
    
    public async getById(
        categoryId: number,
        options: Partial<CategoryModelAdapterOptions> = { },
        ): Promise<CategoryModel|null|IErrorResponse>{
        return await this.getByIdFromTable<CategoryModelAdapterOptions>(
            "category",
             categoryId,
             options
        );
        
        
    }
    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse>{
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
    public async edit(categoryId: number, data: IEditCategory): Promise<CategoryModel|IErrorResponse|null>{
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
                resolve( await this.getById(categoryId, ));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async delete (categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM category WHERE category_id = ?;";
            this.db.execute(sql,[categoryId])
            .then(async result =>{
                const deleteInfo : any = result[0];
              const deleteRawCount: number = +(deleteInfo?.affectedRows);

                    if(deleteRawCount === 1)  {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One Record deleted"
                        });
                    }else{
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record could not be deleted "
                        });
                    }

            })
            .catch(error => {
                if(error?.errorno === 1673){
                    resolve({
                        errorCode: -2,
                        errorMessage: "This category..."
                    });
                    return;
                }
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                });
            })
        });
    }
}
export default CategoryService;


