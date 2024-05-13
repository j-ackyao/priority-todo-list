import { Application, Request, Response } from "express";


export default function initTodoEndpoints(express: Application) {
    express.get("/todos/", getTasks);
    express.post("/todo/:str", postTask);
    express.delete("/todo/:str", deleteTask);
}


function getTasks(req: Request, res: Response) {
    res.status(501);
}

function postTask(req: Request, res: Response) {
    res.status(501);
}

function deleteTask(req: Request, res: Response) {
    res.status(501);
}