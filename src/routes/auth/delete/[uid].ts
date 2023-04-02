import type { RequestEvent, RequestHandler } from "@sveltejs/kit";
import * as cookie from "cookie";

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    console.log("Account deletion endpoint reached for user" + event.params.uid)
    
    return {
        status: 500,
        body: {
            error: "Funktionalität nicht implementiert."
        }
    };
}