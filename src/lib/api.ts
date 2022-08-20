type Send = Promise<{
    error?: string,
    success?: string,
    user?: {
        userName: string
    }
}>

export const send = async (form: HTMLFormElement): Send => {
    const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            accept: "application/json"
        }
    });

    return await response.json();
}