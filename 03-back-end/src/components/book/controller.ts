import BaseController from '../../common/BaseController';
import { Request, Response } from 'express';
import { IAddBook, IAddBookValidator } from './dto/IAddBook';
import Config from '../../config/dev';
import { v4 } from "uuid";
import * as path from "path";
import { IEditBook, IEditBookValidator } from './dto/IEditBook';

class BookController extends BaseController {
    public async getById(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            res.sendStatus(400);
            return;
        }

        const item = await this.services.bookService.getById(
            id,
            {
                loadCategory: true,
                loadPublisher: true,
                loadLocation: true,
                loadAuthors: true,
            }
        );

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(item);
    }

    

    
    
    public async add(req: Request, res: Response) {
       
        try {
            const data = JSON.parse(req.body?.data);

            if (!IAddBookValidator(data)) {
                res.status(400).send(IAddBookValidator.errors);
                return;
            }

            const result = await this.services.bookService.add(data as IAddBook );

            res.send(result);
        } catch (e) {
            res.status(400).send(e?.message);
        }
    }

    public async edit(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        if (!IEditBookValidator(req.body)) {
            return res.status(400).send(IEditBookValidator.errors);
        }

        const result = await this.services.bookService.edit(id, req.body as IEditBook);

        if (result === null) {
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.bookService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(await this.services.bookService.delete(id));
    }

    
    

    public async getAllByCategoryId(req: Request, res: Response) {
        const id: number = +(req.params.id);
        if (id <= 0) return res.status(400).send("Invalid category ID value.");
        res.send(await this.services.bookService.getAllByCategoryId(id));
    }
}

export default BookController;