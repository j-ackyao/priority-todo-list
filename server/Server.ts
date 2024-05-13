import express, { Application } from 'express';
import http from 'http';
import cors from "cors";
import initTodoEndpoints from './endpoints/TodoEndpoints';
import initUserEndpoints from './endpoints/UserEndpoints';


export default class Server {
    private readonly port: number;
    private express: Application;
    private server: http.Server | undefined;

    constructor(port: number) {
        console.log(`Server::<init>(${port})`);
        this.port = port;
        this.express = express();
        this.server = undefined;

        this.initMiddleware();
        this.initRoutes();
    }

    private initMiddleware() {
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		this.express.use(cors());
    }

    private initRoutes() {
        initUserEndpoints(this.express);
        initTodoEndpoints(this.express);
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log(`Server::start()`);
            if (this.server) {
                console.error(`Server::start - Server already started`);
                reject();
            }
            this.server = this.express.listen(this.port, () => {
                console.log(`Server::start() - Server listening on ${this.port}`);
                resolve();
            }).on("error", (err: Error) => {
                console.error(`Server::start - Server error: ${err.message}`);
            });
        });
    }

    public stop(): Promise<void> {
        console.log(`Server::stop()`);
        return new Promise(((resolve, reject) => {
            if (this.server) {
                this.server.close(() => {                
                    console.log(`Server::stop()`);
                    this.server = undefined;
                    resolve();
                });
            }
            console.error(`Server::start - Server not started`);
            reject();
        }));
    }
}