import { Application, Request, Response } from "express";
import { decodeUserToken } from "./UserUtils"
import { readFileSync, writeFileSync } from "fs-extra";
import { TODOS_PATH } from "../Server";

export default function initTodosEndpoints(express: Application) {

    express.get("/todos/", getTasks);
    express.post("/todos/", postTask);
    express.delete("/todos/", deleteTask);
}

interface Task {
    task: string
    hours: number
    deadline: Date
    priority: "high" | "medium" | "low"
}


function getUserId(req: Request): string {
    let token = req.get("Authorization") as string;
    return decodeUserToken(token);
}

/**
 * Expects `Authorization` in request header with user token
 * 
 * Responds with list of tasks as JSON objects under `todos`
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
    res.status(200).send({"todos": userTasks});
}

/**
 * Expects `Authorization` in request header with user token
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
        userTodo[userId] = [];
    }

    userTodo[userId].push(req.body);
    console.log(JSON.stringify(req.body));
    writeFileSync(TODOS_PATH, JSON.stringify(userTodo));
    res.status(200).send();
}

/**
 * Expects `Authorization` in request header with user token
 * 
 * Responds with 200 if successfully added task
 */
function deleteTask(req: Request, res: Response) {
    let userId: string;
    try {
        userId = getUserId(req);
    } catch (err) {
        res.status(401).send(err);
        return;
    }

    res.status(501).send();
}
