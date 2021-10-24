import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';
import PublisherModel from '../publisher/model';
import LocationModel from '../location/model';

class Author implements IModel {
    authorId: number;
    name: string;
}

class BookModel implements IModel{
    bookNumber: number;
    printYear: Date;
    title: string;
    titleOriginal: string;
    pages: number;
    language: string;
    isActive: boolean;
    categoryId: number;
    publisherId: number
    frontSideImage: string
    backSideImage: string
    isbn: string;
    locationId: number;
    category?: CategoryModel;
    publisher?: PublisherModel;
    location?: LocationModel;
    authors: Author[] = [];
}

export default BookModel;
export { Author as BookAuthor };