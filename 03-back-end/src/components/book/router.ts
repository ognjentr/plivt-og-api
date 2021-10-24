import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import BookController from './controller';


export default class BookRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        // Controller:
        const bookController = new BookController(resources);

        // Routing:
        application.get(
            '/Book/:id',
            // AuthMiddleware.getVerifier("user", "administrator"),
            bookController.getById.bind(BookController)
        );

        application.post(
            '/Book',
            // AuthMiddleware.getVerifier("administrator"),
            bookController.add.bind(BookController)
        );

        application.put(
            '/Book/:id',
            // AuthMiddleware.getVerifier("administrator"),
            bookController.edit.bind(BookController)
        );

        application.delete(
            '/Book/:id',
            // AuthMiddleware.getVerifier("administrator"),
            bookController.delete.bind(BookController)
        );       

        application.get(
            "/category/:id/Book",
            // AuthMiddleware.getVerifier("user", "administrator"),
            bookController.getAllByCategoryId.bind(BookController)
        );
    }
}