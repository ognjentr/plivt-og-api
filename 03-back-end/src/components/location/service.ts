import LocationModel from './model';
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { Resolver } from "dns";
import { iAddLocation } from "./dto/AddLocation";
import { error } from "console";
import BaseService from '../../services/BaseService';
import { iEditLocation } from "./dto/EditLocation";


class LocationModelAdapterOptions implements IModelAdapterOptions{


}

class LocationService extends BaseService<LocationModel> {
    
    
    protected async adaptModel (
        row: any,
        options: IModelAdapterOptions = {}
        ): Promise<LocationModel>{
        const item: LocationModel =new LocationModel();

        item.locationId = +(row?.location_id);
        item.room = +(row?.room);
        item.shelf = +(row?.shelf);
        
        return item;
    }

    public async getAll(
        options: Partial<LocationModelAdapterOptions> = {

        }
    ): Promise<LocationModel[]| IErrorResponse>{
        return await this.getAllByFieldNameFromTable<LocationModelAdapterOptions>(
            'location',
            'locationId',
            null,
            options
            );
        
    }
    
    public async getById(
        locationId: number,
        options: Partial<LocationModelAdapterOptions> = { },
        ): Promise<LocationModel|null|IErrorResponse>{
        return await this.getByIdFromTable<LocationModelAdapterOptions>(
            "location",
             locationId,
             options
        );
        
        
    }
    public async add(data: iAddLocation): Promise<LocationModel|IErrorResponse>{
        return new Promise<LocationModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             location
              SET
               room = ?`;

            this.db.execute(sql, [data.room])
            .then(async result =>{
                const insertinfo: any = result[0];
                    const newLocationId: number = +(insertinfo?.insertId)
                    resolve(await this.getById(newLocationId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async edit(locationId: number, data: iEditLocation): Promise<LocationModel|IErrorResponse|null>{
        const result = await this.getById(locationId);

        if (result === null){
         return null;   
        }

        if (!(result instanceof LocationModel)) {
          return result;
        }
        return new Promise<LocationModel|IErrorResponse>(async resolve => {
            const sql = `
            INSERT
             location
            SET
                room = ?,
            WHERE
                location_id;`;
            this.db.execute(sql, [data.room,locationId])
            .then(async result =>{
                resolve( await this.getById(locationId, ));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errorno,
                    errorMessage: error?.sqlMessage
                      });
            });
        });
    }
    public async delete (locationId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM category WHERE category_id = ?;";
            this.db.execute(sql,[locationId])
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
                        errorMessage: "This location..."
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
export default LocationService;


