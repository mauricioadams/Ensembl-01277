import { handleErrors, returnError } from './utils';

const ENDPOINTSYMBOL = 'https://rest.ensembl.org/lookup/symbol';
const ENDPOINTID = 'https://rest.ensembl.org/lookup/id';
const SPECIES = 'homo_sapiens'; //Species hardcoded because it was not a input request on the task 1... but it can be changed to a parameter or an input

export function getGeneBySymbol(symbol) {
    let API = `${ENDPOINTSYMBOL}/${SPECIES}/${symbol}.json?expand=1`;
    return fetch(API)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                return json;
            })
            .catch(returnError);
}

export function getEnsemblStableById(id) {
    let API = `${ENDPOINTID}/${id}.json`;
    return fetch(API)
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                return json;
            })
            .catch(returnError);
}