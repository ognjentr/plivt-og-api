import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import CategoryRouter from './components/category/router';
import * as mysql2 from "mysql2/promise"
import { config } from "process";
import IApplicationResources from "./common/IApplicationResources.interface";
import Router from "./router";
import CategoryService from "./components/category/service";
import PublisherService from "./components/publisher/service";
import AuthorService from "./components/author/service";
import LocationService from "./components/location/service";
import UserService from "./components/user/service";
import BookService from "./components/book/service";

async function main(){
    const application: express.Application = express();

    application.use(cors());
    application.use(express.json());

    const db = await mysql2.createConnection({
        host: Config.database.host,
        port: Config.database.port,
        user: Config.database.user,
        password: Config.database.password,
        database: Config.database.database,
        charset: Config.database.charset,
        timezone: Config.database.timezone,
        supportBigNumbers: true,
        });

    const resources: IApplicationResources = {
        databaseConnection: db,
         
    };

     resources.databaseConnection.connect();

     resources.services = {
        bookService: new BookService(resources),
        categoryService: new CategoryService(resources),
        publisherService: new PublisherService(resources),
        authorService: new AuthorService(resources),
        locationService: new LocationService(resources),
        userService: new UserService(resources),
     };
    
    application.use(
        Config.server.static.route, 
    express.static( Config.server.static.path,{
        index: Config.server.static.index,
        cacheControl:  Config.server.static.cacheControl,
        maxAge:  Config.server.static.maxAge,
        etag:  Config.server.static.etag,
        dotfiles:  Config.server.static.dotfiles,
    })
    );
    

    Router.setupRoutes(application,resources,[
        new CategoryRouter()
    ]);
    
    
    application.use((req,res)=>{
        res.sendStatus(404);
    });
    application.use((err, req, res, next) =>{
         res. status(err.status).send(err.type);
    })
    
    application.listen(Config.server.port);

}

main();