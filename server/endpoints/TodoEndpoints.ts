import {Request, Response} from "express";
import express, { Application } from 'express';
const path = require("path");

export default function initTodoEndpoints(express: Application) {
    express.get("/todo/", getTasks);
    express.put("/todo/:str", putTask);
    express.delete("/todo/:str", deleteTask);
}


function getTasks(req: Request, res: Response) {
    let result: any = {test: "test"};
    // res.status(200).json({result: result});
    res.status(200).send(result);
}

function putTask() {

}

function deleteTask() {

}