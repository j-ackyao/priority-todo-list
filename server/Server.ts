import express, { Application } from 'express';
import http from 'http';
import cors from "cors";
import initTodosEndpoints from './endpoints/TodosEndpoints';
import initUsersEndpoints from './endpoints/UserEndpoints';
import { join } from "path";
import { existsSync, writeFile } from "fs-extra";

export const KEY_PATH = join(__dirname, "/privateKey.key");
export const USERS_PATH = join(__dirname, "/data/users.json");
export const TODOS_PATH = join(__dirname, "/data/todos.json");



export default class Server {
    private readonly port: number;
    private express: Application;
    private server: http.Server | undefined;

    constructor(port: number) {
        console.log(`Server::<init>(${port})`);
        this.port = port;
        this.express = express();
        this.server = undefined;

        this.initFiles();

        this.initMiddleware();
        this.initRoutes();
    }

    private initFiles() {
        if (!existsSync(KEY_PATH)) {
            throw new Error("Private server key (data/privateKey.key) does not exist! Generate a key with the appropriate algorithm.");
        }
        if (!existsSync(USERS_PATH)) {
            writeFile(USERS_PATH, "{}");
        }
        if (!existsSync(TODOS_PATH)) {
            writeFile(TODOS_PATH, "{}");
        }
    }

    private initMiddleware() {
		this.express.use(express.json());
		this.express.use(express.raw({type: "application/*", limit: "10mb"}));

		this.express.use(cors());
    }

    private initRoutes() {
        initUsersEndpoints(this.express);
        initTodosEndpoints(this.express);
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