import { Application, Request, Response } from "express";


export default function initTodoEndpoints(express: Application) {
    express.get("/todos/", getTasks);
    express.post("/todo/", postTask);
    express.delete("/todo/", deleteTask);
}

// 
function getTasks(req: Request, res: Response) {
    res.status(501).send();
}

function postTask(req: Request, res: Response) {
    res.status(501).send();
}

function deleteTask(req: Request, res: Response) {
    res.status(501).send();
}