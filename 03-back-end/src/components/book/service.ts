import IModelAdapterOptionsInterface from '../../../dist/common/IModelAdapterOptions.interface';
import BaseService from '../../../dist/services/BaseService';
import BookModel from './model';
import IModel from '../../../dist/common/IModel.interface';
import IErrorResponse from '../../common/IErrorResponse.interface';

class BookModelAdapterOptions implements IModelAdapterOptionsInterface{
    loadcategory: boolean = false;
}
class BookService extends BaseService<BookModel> {
    protected async adaptModel(
        data: any,
        options: Partial<IModelAdapterOptionsInterface>
    ): Promise<BookModel> {
        const item: BookModel = new BookModel();
        
        item.bookNumber    =+(data?.book_number);
        item.titleOriginal = data?.title_original;
        item.printYear     = data?.print_year;
        item. pages        = data?.pages;
        item. language     = data?.language;
        item. isActive     = +(data?.is_active) ===1;
        item.categoryId    = +(data?.category_id);
        item.publisherId   = +(data?.publisher_id);
        item.frontSideImage = data?.front_side_image;
        item.backSideImage   = data?.backSideImage;
        item.isbn            = data?.isbn;
        item.locationId       = (data?.location_id);
        
        item.category = null;
        return item;
    }
    

    public async getById(
        bookId: number,
        options: Partial<BookModelAdapterOptions> = {},
    ): Promise<BookModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "book",
            bookId,
            options,
        );
    }
}

export default BookService;