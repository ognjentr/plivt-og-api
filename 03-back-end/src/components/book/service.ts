import BaseService from '../../services/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import BookModel, { BookAuthor } from './model';
import { IAddBook,  } from './dto/IAddBook';
import iBookModel from '../book/model';
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IEditBook } from './dto/IEditBook';
import * as fs from "fs";
import Config from '../../config/dev';
import * as path from 'path';
import CategoryModel from '../category/model';
import PublisherModel from '../publisher/model';
import LocationModel from '../location/model';

export class BookModelAdapterOptions implements IModelAdapterOptionsInterface {
    loadCategory: boolean = true;
    loadPublisher: boolean = true;
    loadLocation: boolean = true;
    loadAuthors: boolean = false;
}

class BookService extends BaseService<BookModel> {
    protected async adaptModel(
        data: any,
        options: Partial<BookModelAdapterOptions>
    ): Promise<BookModel> {
        const item: BookModel = new BookModel();
        
        item.bookNumber    =+(data?.book_number);
        item.titleOriginal = data?.title_original;
        item.printYear     = data?.print_year;
        item.pages        = data?.pages;
        item.language     = data?.language;
        item.isActive     = +(data?.is_active) ===1;
        item.categoryId    = +(data?.category_id);
        item.publisherId   = +(data?.publisher_id);
        item.frontSideImage = data?.front_side_image;
        item.backSideImage   = data?.backSideImage;
        item.isbn            = data?.isbn;
        item.locationId       = (data?.location_id);        
        
        if (options.loadCategory) {
            item.category = await this.services.categoryService.getById(item.categoryId) as CategoryModel;
        }

        if (options.loadPublisher) {
            item.publisher = await this.services.publisherService.getById(item.publisherId) as PublisherModel;
        }

        if (options.loadLocation) {
            item.location = await this.services.locationService.getById(item.locationId) as LocationModel;
        }  

        if (options.loadAuthors) {
            item.authors = await this.getAllAuthorsByBookNumber(item.bookNumber);
        }     
        
        return item;
    }

    public async getById(
        bookNumber: number,
        options: Partial<BookModelAdapterOptions> = {},
    ): Promise<BookModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "book",
            bookNumber,
            options,
        );
    }
    
    private async getAllAuthorsByBookNumber(bookNumber: number): Promise<BookAuthor[]> {
        const sql = `
            SELECT
                author.author_id,                
                author.name
            FROM
                book_author
            INNER JOIN author ON book_author.author_id = author.author_id
            WHERE
                book_author.book_number = ?;`;
        const [ rows ] = await this.db.execute(sql, [ bookNumber ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: BookAuthor[] = [];

        for (const row of rows as any) {
            items.push({
                authorId: +(row?.author_id),
                name: row?.name,                
            });
        }

        return items;
    }

    public async add(
        data: IAddBook,
    ): Promise<BookModel|IErrorResponse> {
        return new Promise<BookModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then(() => {
                this.db.execute(
                    `
                    INSERT book
                    SET
                        bookNumber = ?,
                        printYear = ?,
                        title = ?,
                        titleOriginal = ?,
                        pages = ?,
                        language = ?,
                        isActive = ?,
                        categoryId = ?,
                        publisherId = ?,
                        frontSideImage = ?,
                        backSideImage = ?,
                        isbn = ?,
                        locationId = ?;
                    `,
                    [
                        data.bookNumber,
                        data.printYear,
                        data.title,
                        data.titleOriginal,
                        data.pages,
                        data.language,                        
                        data.isActive ? 1 : 0,                      
                        data.categoryId,
                        data.publisherId,
                        data.frontSideImage,
                        data.backSideImage,
                        data.isbn,
                        data.locationId,
                    ]
                )
                .then(async (res: any) => {
                    const newBookNumber: number = +(res[0]?.insertId);

                    const promises = [];                  

                    for (const author of data.authors) {
                        promises.push(
                            this.db.execute(
                                `INSERT book_author
                                 SET book_number = ?, author_id = ?;`,
                                [ newBookNumber, author.authorId, ]
                            ),
                        );
                    }                  

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.bookService.getById(
                            newBookNumber,
                            {
                                loadCategory: true,
                                loadPublisher: true,
                                loadLocation: true,
                                loadAuthors: true,
                            }
                        ));
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode: error?.errno,
                            errorMessage: error?.sqlMessage
                        });
                    });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
            });
        });
    }

    private editBook(bookNumber: number, data: IEditBook) {
        return this.db.execute(
            `UPDATE
                book
            SET
                printYear = ?,
                title = ?,
                titleOriginal = ?,
                pages = ?,
                language = ?,
                isActive = ?,
                categoryId = ?,
                publisherId = ?,
                frontSideImage = ?,
                backSideImage = ?,
                isbn = ?,
                locationId = ?
            WHERE
                book_number = ?;`,
            [
                data.printYear,
                data.title,
                data.titleOriginal,
                data.pages,
                data.language,                        
                data.isActive ? 1 : 0,                      
                data.categoryId,
                data.publisherId,
                data.frontSideImage,
                data.backSideImage,
                data.isbn,
                data.locationId,
                bookNumber,
            ]
        );
    }

    public async edit(bookNumber: number, data: IEditBook): Promise<BookModel|null|IErrorResponse> {
        return new Promise<BookModel|null|IErrorResponse>(async resolve => {
            const currentBook = await this.getById(bookNumber, {
                loadAuthors: true,
            });

            if (currentBook === null) {
                return resolve(null);
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            }

            this.db.beginTransaction()
                .then(() => {
                    this.editBook(bookNumber, data)
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Part book: " + error?.sqlMessage,
                        });
                    });
                })
               
                .then(async () => {
                    const willHaveAuthors = data.authors.map(fv => fv.authorId);
                    const currentAuthors  = (currentBook as BookModel).authors.map(f => f.authorId);

                    for (const currentAuthor of currentAuthors) {
                        if (!willHaveAuthors.includes(currentAuthor)) {
                            this.deleteBookAuthor(bookNumber, currentAuthor)
                            .catch(error => {
                                rollbackAndResolve({
                                    errno: error?.errno,
                                    sqlMessage: `Part delete author ID(${currentAuthor}): ${error?.sqlMessage}`,
                                });
                            });
                        }
                    }
                })
                .then(async () => {
                    for (const fv of data.authors) {
                        this.insertOrUpdateAuthor(bookNumber, fv)
                        .catch(error => {
                            rollbackAndResolve({
                                errno: error?.errno,
                                sqlMessage: `Part add/edit author ID(${fv.authorId}): ${error?.sqlMessage}`,
                            });
                        });
                    }
                })
                .then(async () => {
                    this.db.commit()
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: `Part save changes: ${error?.sqlMessage}`,
                        });
                    });
                })
                .then(async () => {
                    resolve(await this.getById(bookNumber, {
                        loadCategory: true,
                        loadPublisher: true,
                        loadLocation: true,
                        loadAuthors: true,
                    }));
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }       

    private deleteBookAuthor(bookNumber: number, authorId: number) {
        return this.db.execute(
            `DELETE FROM
                book_author
            WHERE
                book_number = ? AND
                author_id = ?;`,
            [
                bookNumber,
                authorId,
            ]
        );
    }

    private insertOrUpdateAuthor(bookNumber: number, fv: BookAuthor) {
        return this.db.execute(
            `INSERT
                book_author
            SET
                book_number = ?,
                author_id = ?;`,
            [
                bookNumber,
                fv.authorId,
            ],
        );
    }

    private async deleteBookAuthors(bookNumber: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM book_author WHERE book_number = ?;`,
                [ bookNumber ]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }

    private async deleteBookRecord(bookNumber: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM book WHERE book_number = ?;`,
                [ bookNumber ]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }


    public async delete(bookNumber: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse>(async resolve => {
            const currentBook = await this.getById(bookNumber, {
                loadAuthors: true,
            });

            if (currentBook === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deleteBookAuthors(bookNumber)) return;
                    throw { errno: -1002, sqlMessage: "Could not delete book author.", };
                })
                
                .then(async (filesToDelete) => {
                    if (await this.deleteBookRecord(bookNumber)) return filesToDelete;
                    throw { errno: -1006, sqlMessage: "Could not delete the book records.", };
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Book deleted!",
                    });
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async getAllByCategoryId(categoryId: number): Promise<BookModel[]> {
        return await this.getAllByFieldNameFromTable<BookModelAdapterOptions>("book", "category_id", categoryId, {           
        }) as BookModel[];
    }

}

export default BookService;