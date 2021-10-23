import IModel from "../../common/IModel.interface";

class UserModel implements IModel {
    userId: number;
    username: string;
    password: string;
   
}

export default UserModel;