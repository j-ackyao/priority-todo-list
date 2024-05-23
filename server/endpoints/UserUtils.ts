import { readFileSync, writeFileSync } from "fs-extra";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { USERS_PATH, KEY_PATH } from "../Server";
import { hash } from "./Utils";

// consider hashing in future and different data struct
const USER_TOKEN_DURATION = "30min";


interface User {
    username: string
    password: string
}

interface Users {
    [userId: string]: User
}

// temporary deep compare
function compareUser(u1: User, u2: User) {
    return (
        u1.username == u2.username &&
        u1.password == u2.password
    )
}

/**
 * @param username Username as string
 * @param password Password as string
 * @returns userId if successful, else throws error
 */
export function createUser(username: string, password: string): string {
    let user: User = {username: username, password: password};
    let userId: string = hash(user);

    let users: Users = JSON.parse(readFileSync(USERS_PATH, "utf8"));
    // simple check that also accounts for hash collision, not ideal
    if (users[userId]) {
        throw Error("User already exists");
    }

    users[userId] = user;

    writeFileSync(USERS_PATH, JSON.stringify(users));
    
    return userId;
}

/**
 * @param username Username as string
 * @param password Password as string
 * @returns userId if user is found and verified, else throws error
 */
export function authUser(username: string, password: string): string {
    let users: Users = JSON.parse(readFileSync(USERS_PATH, "utf8"));
    
    let user: User = {username: username, password: password};
    let userId = hash(user);
    if (compareUser(users[userId], user)) {
        return userId;
    }
    throw Error("User not found");
}

// should consider expiration time
/**
 * @param userId Payload to encode
 * @returns A JSON Web Token as string
 */
export function generateUserToken(userId: string): string { 
    let token: string = sign({userId: userId}, readFileSync(KEY_PATH), {
        algorithm: "RS256", 
        expiresIn: USER_TOKEN_DURATION
    });
    return token;
}

/**
 * @param token A valid JSON Web Token
 * @returns Decoded userId as string, else undefined
 * @throws Error with "TokenExpiredError" if token has expired
 */
export function decodeUserToken(token: string): string {
    return (verify(token, readFileSync(KEY_PATH)) as JwtPayload).userId;
}