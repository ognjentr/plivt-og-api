import PublisherModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";
import { iAddPublisher } from "./dto/AddPublisher";
import { error } from "console";
import BaseService from '../../services/BaseService';
import { iEditPublisher } from "./dto/EditPublisher";


class PublisherModelAdapterOptions implements IModelAdapterOptions{


}

class PublisherService extends BaseService<PublisherModel> {
    
    
    protected async adaptModel (
        row: any,
        options: IModelAdapterOptions = {}
        ): Promise<PublisherModel>{
        const item: PublisherModel =new PublisherModel();

        item.publisherId = +(row?._id);
        item.name = row?.name;
        
        return item;
    }

    public async getAll(
        options: Partial<PublisherModelAdapterOptions> = {

        }
    ): Promise<PublisherModel[]| IErrorResponse>{
        return await this.getAllByFieldNameFromTable<PublisherModelAdapterOptions>(
            'publisher',
            'publisherId',
            null,
            options
            );
        
    }
    
    public async getById(
        publisherId: number,
        options: Partial<PublisherModelAdapterOptions> = { },
        ): Promise<PublisherModel|null|IErrorResponse>{
        return await this.getByIdFromTable<PublisherModelAdapterOptions>(
            "category",
             publisherId,
             options
        );
        
        
    }
    public async add(data: iAddPublisher): Promise<PublisherModel|IErrorResponse>{
        return new Promise<PublisherModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             category
              SET
               name = ?`;
            this.db.execute(sql, [data.name])
            .then(async result =>{
                const insertinfo: any = result[0];
                    const newPublisherId: number = +(insertinfo?.insertId)
                    resolve(await this.getById(newPublisherId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async edit(publisherId: number, data: iEditPublisher): Promise<PublisherModel|IErrorResponse|null>{
        const result = await this.getById(publisherId);

        if (result === null){
         return null;   
        }

        if (!(result instanceof PublisherModel)) {
          return result;
        }
        return new Promise<PublisherModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             category
            SET
                name = ?;`;
            this.db.execute(sql, [data.name,publisherId])
            .then(async result =>{
                resolve( await this.getById(publisherId, ));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async delete (publisherId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM category WHERE category_id = ?;";
            this.db.execute(sql,[publisherId])
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
                        errorMessage: "This publisher..."
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
export default PublisherService;


