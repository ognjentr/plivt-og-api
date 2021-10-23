import IModel from "../../common/IModel.interface";

class PublisherModel implements IModel {
    publisherId: number;
    name: string;
    year: string;
    city: string;
    country: string;
   
}

export default PublisherModel;