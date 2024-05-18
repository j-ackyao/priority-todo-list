import { Application, Request, Response } from "express";
import { authUser, generateUserToken, decodeUserToken, createUser } from "./UserUtils";

export default function initUsersEndpoints(express: Application) {
    // testing purposes, temporary
    express.get("/genId/", (req, res) => {
        console.log("test gen id");
        try {
            res.send(generateUserToken(authUser("test", "test")));
        } catch(err) {
            console.log(err);
        }
    });
    express.get("/verId/:token", (req, res) => {
        console.log("test ver id");
        try {
            res.send(decodeUserToken(req.params.token));
        } catch (err) {
            res.status(401).send(err);
        }
        
    });

    express.post("/login/", login);
    express.post("/verify/", verify);
    express.post("/users/", registerUser);
    express.delete("/users/", deleteUser);
}

// very simplistic, should consider encryption
/**
 * Expects `username` and `password` in request body
 * 
 * Responds with a user token under `token`
 */
async function login(req: Request, res: Response) {
    console.log("Server::UsersEndpoints - Login request");
    let username: string = req.body.username;
    let password: string = req.body.password;

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    try {
        let userId: string = authUser(username, password);
        res.status(200).send({"token": generateUserToken(userId)});
    } catch (err) {
        res.status(401).send(err);
    }
}

/**
 * Expects `username` and `password` in request body
 * 
 * Responds with a userId token under `userId`
 */
async function registerUser(req: Request, res: Response) {
    console.log("Server::UsersEndpoints - Register request");
    let username: string = req.body.username;
    let password: string = req.body.password;
    
    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    try {
        let userId: string = createUser(username, password);
        res.status(200).send({"userId": userId});
    } catch (err) {
        res.status(409).send(err);
        return;
    }
}


/**
 * Expects `token` in request body
 * 
 * Responds with userId under `userId` if token is valid, error otherwise
 */

function verify(req: Request, res: Response) {
    console.log("Server::UsersEndpoints - Verify request");
    let token: string = req.body.token;

    if (!token) {
        res.sendStatus(400);
        return;
    }

    try {
        let userId: string = decodeUserToken(token);
        res.status(200).send({userId: userId});
    } catch (err) {
        res.status(401).send(err);
    }
}

// todo
function deleteUser(req: Request, res: Response) {
    res.sendStatus(501);
}