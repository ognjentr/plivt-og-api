import UserModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";
import { IAddUser } from "./dto/IAddUser";
import { error } from "console";
import BaseService from '../../services/BaseService';
import { IEditUser } from "./dto/IEditUser";

class UserModelAdapterOptions implements IModelAdapterOptions{
}

class UserService extends BaseService<UserModel> {    
    protected async adaptModel (
        row: any,
        options: IModelAdapterOptions = {}
        ): Promise<UserModel>{
        const item: UserModel =new UserModel();

        item.userId = +(row?.user_id);
        item.username = row?.username;
        
        return item;
    }

    public async getAll(
        options: Partial<UserModelAdapterOptions> = {
        }
    ): Promise<UserModel[]| IErrorResponse>{
        return await this.getAllByFieldNameFromTable<UserModelAdapterOptions>(
            'user',
            'userId',
            null,
            options
            );        
    }
    
    public async getById(
        userId: number,
        options: Partial<UserModelAdapterOptions> = { },
        ): Promise<UserModel|null|IErrorResponse>{
        return await this.getByIdFromTable<UserModelAdapterOptions>(
            "user",
             userId,
             options
        );      
    }

    public async add(data: IAddUser): Promise<UserModel|IErrorResponse>{
        return new Promise<UserModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             user
              SET
               username = ?`;

            this.db.execute(sql, [data.username])
            .then(async result =>{
                const insertinfo: any = result[0];
                    const newUserId: number = +(insertinfo?.insertId)
                    resolve(await this.getById(newUserId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }

    public async edit(userId: number, data: IEditUser): Promise<UserModel|IErrorResponse|null>{
        const result = await this.getById(userId);

        if (result === null){
            return null;   
        }

        if (!(result instanceof UserModel)) {
            return result;
        }

        return new Promise<UserModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
                user
            SET
                username = ?,
            WHERE
                user_id;`;
            this.db.execute(sql, [data.username,userId])
            .then(async result =>{
                resolve( await this.getById(userId, ));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }

    public async delete (userId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM user WHERE user_id = ?;";
            this.db.execute(sql,[userId])
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
                        errorMessage: "This user..."
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

    public async getByUsername(username: string): Promise<UserModel|null> {
        const users = await this.getAllByFieldNameFromTable("user", "username", username, {});

        if (!Array.isArray(users) || users.length === 0) {
            return null;
        }

        return users[0];
    }
}

export default UserService;


