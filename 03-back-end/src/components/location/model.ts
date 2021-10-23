import IModel from "../../common/IModel.interface";

class LocationModel implements IModel {
    locationId: number;
    room: number;
    shelf: number;
   
}

export default LocationModel;