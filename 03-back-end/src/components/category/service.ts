import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";


class CategoryService{
    
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection){
        this.db = db;
    }

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
        return new Promise<CategoryModel[]|IErrorResponse>(async (resolve) =>{
            const sql: string = "SELECT * FROM category;";
            this.db.execute(sql)
            .then(async result => {
                const rows = result[0];
                const lista: CategoryModel[] = [];

                if (Array.isArray(rows)){
                    for(const row of rows){
                        lista.push(
                            await this.adaptModel(
                                row,{}
                            )
                        )
                    }
                }    
        
                return lista;

            })
            .catch(error =>{
                resolve({
              errorCode: error?.errorno,
              errorMessage: error?.sqlMessage
                });

            }) ;
    
        });
        
    }
    
    public async getById(categoryId: number): Promise<CategoryModel|null|IErrorResponse>{
        return new Promise<CategoryModel|null|IErrorResponse>(async resolve => {
         
            const sql: string = "SELECT * FROM category WHERE category_id =?;";
            this.db.execute(sql, [categoryId])
          
            .then(async result => {
            const [rows, colums] = result;
           
            if (!Array.isArray(rows)){
                resolve (null);
                return;
            }
            if (rows.length === 0){
                resolve (null);
            } 
            resolve( await this.adaptModel(
                rows[0],{}
                
                ));
        
        })
        .catch(error =>{
            resolve({
                errorCode: error?.errorno,
                errorMessage: error?.sqlMessage
                  });

        });
        
        
        
            
     })
        
        
    }
}
export default CategoryService;


