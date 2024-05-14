import { readFile, writeFile } from "fs";
import { readFileSync } from "fs-extra";
import { sign, verify } from "jsonwebtoken";
import { USERS_PATH, KEY_PATH } from "../Server";


// consider hashing in future and different data struct

// resolves with userid if authenticated
export function authenticate(username: string, password: string): Promise<string> {
    return new Promise ((resolve, reject) => {
        readFile(USERS_PATH, "utf8", (err, data) => {
            // temp err handling
            if (err) {
                if (err.code === "ENOENT") {
                    writeFile(USERS_PATH, "{}", () => {});
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
export function encode(obj: any): string { 
    let token = sign(obj, readFileSync(KEY_PATH), {algorithm: "RS256"});
    return token;
}

/**
 * @param token A valid JSON Web Token
 * @returns Decoded contents as string, else undefined
 */
export function decode(token: string): string | undefined {
    let obj;
    try {
        obj = verify(token, readFileSync(KEY_PATH));
    } catch (err) {
        return undefined;
    }
    return obj as string;
}