import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
    const values = (await event.request.formData()).get("userName");
    return {
        status: 200,
        body: values
    }
}