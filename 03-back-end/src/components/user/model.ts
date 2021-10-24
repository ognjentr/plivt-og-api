import IModel from "../../common/IModel.interface";

class UserModel implements IModel {
    passwordHash(password: string, passwordHash: any) {
        throw new Error('Method not implemented.');
    }
    userId: number;
    username: string;
    password: string;
   
}

export default UserModel;