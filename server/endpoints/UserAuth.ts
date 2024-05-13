import { Application, Request, Response } from "express";
// import { genSalt } from "bcrypt";
import { readFile, writeFile } from "fs";
import { ensureFile, readFileSync } from "fs-extra";
import { sign, verify } from "jsonwebtoken";
import { join } from "path";


const KEY = readFileSync(__dirname + "/privateKey.key");

// temporary solution to store in json file
const USERS = join(__dirname, "../data/users.json");


// consider hashing in future and different data struct

// resolves with userid if authenticated
export function authenticate(username: string, password: string): Promise<string> {
    ensureFile(USERS);
    return new Promise ((resolve, reject) => {
        readFile(USERS, "utf8", (err, data) => {
            // temp err handling
            if (err) {
                if (err.code === "ENOENT") {
                    writeFile(USERS, "{}", () => {});
                    return "";
                } else {
                    throw err;
                }
            }
            let users = JSON.parse(data);
            for (let userId of Object.keys(users)) {
                let user = users[userId]
                if (user.username === username) {
                    if (user.password === password) {
                        resolve(userId);
                        return;
                    }
                    reject("Incorrect password");
                    return;
                }
            }
            reject("User not found");
            return;
        });
    });
}

// should consider expiration time
export function encode(obj: any) { 
    let token = sign(obj, KEY, {algorithm: "RS256"});
    return token;
}

export function decode(token: string) {
    let obj = verify(token, KEY);
    return obj;
}