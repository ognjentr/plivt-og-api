import IModel from "../common/IModel.interface";
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from "../common/IModelAdapterOptions.interface";
import IErrorResponse from '../common/IErrorResponse.interface';
import IApplicationResources from '../common/IApplicationResources.interface';
import IServices from '../common/IServices.interface';

export default abstract class BaseService<ReturnModel extends IModel>{
    private resources: IApplicationResources;
    private dbConnection: mysql2.Connection;
    private allServices: IServices;

    constructor(resources: IApplicationResources){
       this.resources = resources; 
    }

    protected get db(): mysql2.Connection{
        return this.resources.databaseConnection;
    }
    protected get services() : IServices{
        return this.resources.services;
    }

    protected abstract adaptModel(
        data: any,
        options: Partial<IModelAdapterOptions>,
    ): Promise<ReturnModel>;

    protected async getAllFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
        options: Partial<AdapterOptions> = {}
        ): Promise<ReturnModel[]|IErrorResponse> {
        return new Promise<ReturnModel[]|IErrorResponse>(async (resolve) =>{
            const sql: string = `SELECT * FROM  $(tableName);`;
            this.db.execute(sql)
            .then(async result => {
                const rows = result[0];
                const lista: ReturnModel[] = [];

                if (Array.isArray(rows)){
                    for(const row of rows){
                        lista.push(
                            await this.adaptModel(
                                row,{options}
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
protected async getByIdFromTable<AdapterOptions extends IModelAdapterOptions>(
    tableName: string,
     id: number,
     options: Partial<AdapterOptions> = {},
     ): Promise<ReturnModel|null|IErrorResponse>{
    return new Promise<ReturnModel|null|IErrorResponse>(async resolve => {
         
        const sql: string = "SELECT * FROM $(tableName) WHERE $(tableName)_id =?;";
        this.db.execute(sql, [id])
      
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
            rows[0],options
            
            ));
    
    })
    .catch(error =>{
        resolve({
            errorCode: error?.errorno,
            errorMessage: error?.sqlMessage
              });

    });
    
    
    
        
 });

    }
    
    protected async getAllByFieldNameFromTable<AdapterOptions extends IModelAdapterOptions>(
        tableName: string,
         fieldName: string,
          fieldValue: any,
          options: Partial<AdapterOptions> = {},
          ):Promise<ReturnModel[]|IErrorResponse>{
        return new Promise<ReturnModel[]|IErrorResponse>(async (resolve) =>{
            let sql = `SELECT * FROM $(tableName) WHERE $(fieldName) = ?;`;

            if (fieldValue === null) {
                sql = `SELECT * FROM $(tableName) WHERE $(fileName) IS NULL;`
            }
            
            this.db.execute(sql, [fieldValue])
            .then(async result => {
                const rows = result[0];
                const lista: ReturnModel[] = [];

                if (Array.isArray(rows)){
                    for(const row of rows){
                        lista.push(
                            await this.adaptModel(
                                row,{options}
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
}