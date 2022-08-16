import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
    const userName = (await event.request.formData()).get("userName");
    const email = (await event.request.formData()).get("email");
    const password = (await event.request.formData()).get("password");

    return {
        status: 200,
        body: {userName: userName, email: email, password: password}
    }
}