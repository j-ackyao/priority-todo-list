import { createHash } from "crypto";

/** Use to resolve hash conflict */
export const NONCE = "somenoncestring";

const TRUNC = 10

// todo consider how to handle collisions
/**
 * @param obj A JSON object
 * @returns Hashed to string and truncated to length `TRUNC`
 */
export function hash(obj: any): string {
    let hash: string = createHash("sha1").update(JSON.stringify(obj)).digest("hex");
    return hash.substring(0, TRUNC);
}