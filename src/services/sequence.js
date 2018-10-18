import { handleErrors, returnError } from './utils';

const ENDPOINT = 'http://rest.ensembl.org/sequence/id';

export function getSequence(id, type, start = 0) {
    let API = `${ENDPOINT}/${id}.json?multiple_sequences=1&type=${type}&start=${start}`;
    return fetch(API)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                return json;
            })
            .catch(returnError);
}