import AuthorModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";
import { IAddAuthor } from "./dto/IAddAuthor";
import { error } from "console";
import BaseService from '../../services/BaseService';
import { IEditAuthor } from "./dto/IEditAuthor";


class AuthorModelAdapterOptions implements IModelAdapterOptions{


}

class AuthorService extends BaseService<AuthorModel> {
    
    
    protected async adaptModel (
        row: any,
        options: IModelAdapterOptions = {}
        ): Promise<AuthorModel>{
        const item: AuthorModel =new AuthorModel();

        item.authorId = +(row?.author_id);
        item.name = row?.name;
        
        return item;
    }

    public async getAll(
        options: Partial<AuthorModelAdapterOptions> = {

        }
    ): Promise<AuthorModel[]| IErrorResponse>{
        return await this.getAllByFieldNameFromTable<AuthorModelAdapterOptions>(
            'Author',
            'authorId',
            null,
            options
            );
        
    }
    
    public async getById(
        authorId: number,
        options: Partial<AuthorModelAdapterOptions> = { },
        ): Promise<AuthorModel|null|IErrorResponse>{
        return await this.getByIdFromTable<AuthorModelAdapterOptions>(
            "author",
             authorId,
             options
        );
        
        
    }
    public async add(data: IAddAuthor): Promise<AuthorModel|IErrorResponse>{
        return new Promise<AuthorModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             author
              SET
               name = ?`;
               
            this.db.execute(sql, [data.name])
            .then(async result =>{
                const insertinfo: any = result[0];
                    const newAuthorId: number = +(insertinfo?.insertId)
                    resolve(await this.getById(newAuthorId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async edit(authorId: number, data: IEditAuthor): Promise<AuthorModel|IErrorResponse|null>{
        const result = await this.getById(authorId);

        if (result === null){
         return null;   
        }

        if (!(result instanceof AuthorModel)) {
          return result;
        }
        return new Promise<AuthorModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             author
            SET
                name = ?,
            WHERE
                author_id;`;
            this.db.execute(sql, [data.name,authorId])
            .then(async result =>{
                resolve( await this.getById(authorId, ));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async delete (authorId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM author WHERE author_id = ?;";
            this.db.execute(sql,[authorId])
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
                        errorMessage: "This author..."
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
export default AuthorService;
