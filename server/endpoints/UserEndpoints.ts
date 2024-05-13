import { Application, Request, Response } from "express";

import { authenticate, encode, decode } from "./UserAuth";


export default function initUserEndpoints(express: Application) {
    express.get("/users/", getUsers);
    express.post("/user/", login);
    express.delete("/user/", deleteUser);
}

function getUsers(req: Request, res: Response) {
    // res.send({message: "hello"});
    res.status(501).send();
}

// very simplistic, should consider encryption
async function login(req: Request, res: Response) {
    let username: string = req.body.username;
    let password: string = req.body.password;
    
    if (!username || !password) {
        res.status(400).send();
        return;
    }

    let userId: string = "";
    
    await authenticate(username, password).then(val => {
        userId = val;
    }).catch(err => {
        // failed to authenticate
    });

    if (!userId) {
        res.status(401).send();
        return;
    }
    res.status(200).send(encode(userId));
}


function deleteUser(req: Request, res: Response) {
    res.status(501).send();
}