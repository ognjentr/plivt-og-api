import IModel from '../../../dist/common/IModel.interface';
import CategoryModel from '../../../dist/components/category/model';
class BookModel implements IModel{
    bookNumber : number;
    printYear: Date;
    title: string;
    titleOriginal: string;
    pages: number;
    language: string;
    isActive: boolean;
    categoryId: number;
    publisherId: number
    frontSideImage: string
    backSideImage:string
    isbn: string;
    locationId: number;
    category?: CategoryModel;
}
export default BookModel;