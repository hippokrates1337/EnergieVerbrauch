import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = (request) => {
    const values = request.request.body;
    return {
        status: 200,
        body: values
    }
}