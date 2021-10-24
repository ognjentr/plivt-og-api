export default interface IConfig{
    auth: any;
    server: {
        port: number,
        static: {

            path: string,
            route: string,
            cacheControl: boolean,
            dotfiles: string,
            etag: boolean,
            index: boolean
            maxAge: number,
        }
    },
    database:{
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        charset: string,
        timezone: string,
    },
};