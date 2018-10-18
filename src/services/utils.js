export function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function returnError(error) {
    return { error: true, errorMsg: error.message }
}