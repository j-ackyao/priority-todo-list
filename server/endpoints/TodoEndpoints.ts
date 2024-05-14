import { Application, Request, Response } from "express";
import { decode } from "./UserAuth"
import { readFileSync, writeFileSync } from "fs-extra";
import { TODOS_PATH } from "../Server";

export default function initTodoEndpoints(express: Application) {
    express.get("/todos/", getTasks);
    express.post("/todo/", postTask);
    express.delete("/todo/", deleteTask);
}

/**
 * Expects `Authorization` in request header with user token
 * 
 * Responds with list of tasks as JSON objects in `todos`
 */
function getTasks(req: Request, res: Response) {
    console.log("Server::TodoEndpoints - Get tasks request");
    let token = req.get("Authorization") as string;
    if (!token) {
        res.status(400).send();
        return;
    }
    let userId = decode(token);
    if (!userId) {
        res.status(400).send();
        return;
    }
    let userTodo: any = JSON.parse(readFileSync(TODOS_PATH, "utf-8"))[userId];
    
    res.status(200).send({"todos": userTodo});
}

function postTask(req: Request, res: Response) {
    console.log("Server::TodoEndpoints - Post task request");
    let token = req.get("Authorization") as string;
    if (!token) {
        res.status(400).send();
        return;
    }
    let userId = decode(token);
    if (!userId) {
        res.status(400).send();
        return;
    }


    let userTodo: any = JSON.parse(readFileSync(TODOS_PATH, "utf-8"));

    if (!userTodo[userId]) {
        userTodo[userId] = [];
    }

    userTodo[userId].push(req.body);
    console.log(JSON.stringify(req.body));
    writeFileSync(TODOS_PATH, JSON.stringify(userTodo));
    res.status(200).send();
}

function deleteTask(req: Request, res: Response) {
    res.status(501).send();
}