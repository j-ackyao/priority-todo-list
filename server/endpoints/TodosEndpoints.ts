import { Application, Request, Response } from "express";
import { decodeUserToken } from "./UserUtils"
import { readFileSync, writeFileSync } from "fs-extra";
import { TODOS_PATH } from "../Server";
import { hash } from "./Utils";

export default function initTodosEndpoints(express: Application) {
    express.get("/todos/", getTasks);
    express.post("/todos/", postTask);
    express.delete("/todos/", deleteTask);
}

interface Task {
    text: string
    hours: number
    deadline: Date
    priority: "high" | "medium" | "low"
}

interface Tasks {
    [id: string]: Task
}


function getUserId(req: Request): string {
    let token = req.get("Authorization") as string;
    return decodeUserToken(token);
}

/**
 * Expects `Authorization` in request header with user token
 * 
 * Responds with Tasks
 */
function getTasks(req: Request, res: Response) {
    console.log("Server::TodosEndpoints - Get tasks request");

    let userId: string;
    try {
        userId = getUserId(req);
    } catch (err) {
        res.status(401).send(err);
        return;
    }

    let userTasks = JSON.parse(readFileSync(TODOS_PATH, "utf-8"))[userId];
    if (!userTasks) {
        userTasks = {};
    }

    res.status(200).send(userTasks);
}

/**
 * Expects `Authorization` in request header with user token and task under body
 * 
 * Responds with 200 if successfully added task
 */
function postTask(req: Request, res: Response) {
    console.log("Server::TodosEndpoints - Post task request");

    let userId: string;
    try {
        userId = getUserId(req);
    } catch (err) {
        res.status(401).send(err);
        return;
    }


    let userTodo: any = JSON.parse(readFileSync(TODOS_PATH, "utf-8"));

    if (!userTodo[userId]) {
        userTodo[userId] = {};
    }

    let task: Task = req.body

    // todo verify contents

    userTodo[userId][hash(task)] = task;
    writeFileSync(TODOS_PATH, JSON.stringify(userTodo));
    res.status(200).send();
}

/**
 * Expects `Authorization` in request header with user token and id of task under body
 * 
 * Responds with 200 if successfully added task
 */
function deleteTask(req: Request, res: Response) {
    console.log("Server::TodosEndpoints - Delete task request");
    let userId: string;
    try {
        userId = getUserId(req);
    } catch (err) {
        res.status(401).send(err);
        return;
    }

    let userTodo: any = JSON.parse(readFileSync(TODOS_PATH, "utf-8"));

    if (!userTodo[userId]) {
        userTodo[userId] = {};
    }

    let id = req.body.id
    console.log(id);

    delete userTodo[userId][id];
    
    console.log(userTodo);

    writeFileSync(TODOS_PATH, JSON.stringify(userTodo));
    res.status(200).send();
}
