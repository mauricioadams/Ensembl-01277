import React, { Component } from 'react';

import { getSequence } from '../../services/sequence';
import { getEnsemblStableById } from '../../services/lookup';
import { aminoAcidTable } from '../../utils/aminoAcidAlphabet';

class HGVSSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hgvs: '',
            loading: false,
            error: false,
            noResults: false,
            searching: {},
            transcript: {}
        };

        this.validateHGVS = this.validateHGVS.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loading = this.loading.bind(this);
        this.handleError = this.handleError.bind(this);
        this.clearLoading = this.clearLoading.bind(this);
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        }, () => {
            this.validateHGVS();
        });
    }

    handleError() {
        //function to deal with critical errors... use not just to set state but to notify admin,create log entry, etc
        this.setState({error: true, loading: false, noResults: false, searching: {}, transcript: {}});
    }

    loading() {
        this.setState({loading: true, error: false, noResults: false, searching: {}, transcript: {}});
    }

    clearLoading() {
        this.setState({loading: false, error: false});
    }

    validateHGVS() {
        //once valid block typing TODO while search
        let type = null,
            variation = null,
            var1 = null,
            var2 = null,
            position = null;

        let hgvs = this.state.hgvs.split(":");
        let sequence = hgvs[0].split(".")[0]; //NOT IN SCOPE FOR THIS EXAMPLE Check if its a valid sequence (match size etc)

        if(hgvs.length > 1) {
            type = hgvs[1].split(".")[0]; //accepting only p for proteing, NOT IN SCOPE FOR THIS EXAMPLE - Create a type dictionary for this part
            variation = hgvs[1].split(".")[1].toLowerCase();
            if(variation) {
                var1 = variation.substring(0, 3);
                var2 = variation.substring(variation.length -3);
                position = variation.replace(var1, '').replace(var2, '');
                if(var1.length && var2.length && position.length) {
                    if(aminoAcidTable.hasOwnProperty(var1)  &&  aminoAcidTable.hasOwnProperty(var2)) {
                        this.loading();
                        getSequence(sequence, 'protein', position)
                        .then((data) => {
                            if(data.error) {
                                this.handleError();
                            } else {
                                this.setState({searching: { position: position, sequence: sequence, var1: var1, var2: var2 }});
                                sequence = data[0];
                                if(sequence.seq[0] === aminoAcidTable[var1]) { 
                                    getEnsemblStableById(sequence.id)
                                        .then((data) => {
                                            if(data.error) {
                                                this.handleError();
                                                return;
                                            }
                                            let translation = data;
                                            if(translation.hasOwnProperty('Parent')) {
                                                getEnsemblStableById(translation.Parent) //Have to create two calls to get transcript information, there is probably a rest service for that, not able to find it :( 
                                                    .then((data) => {
                                                        if(data.error) {
                                                            this.handleError();
                                                            return;
                                                        }
                                                        this.setState({loading: false, transcript: [data]});
                                                    });
                                            }
                                        });
                                } else {
                                    this.setState({noResults: true});
                                    //set loading
                                    this.clearLoading();
                                }
                            }
                        });
                    }
                }
            }
        }
    }

    render() {
        const loading = this.state.loading;
        const noResults = this.state.noResults;
        const error = this.state.error;
        const searching = this.state.searching;
        const transcripts = this.state.transcript;

        return (
            <div className="wrap container">
                <h2 className="title">Extending the Application</h2>
                <div className="row">
                    <div className="col-md-10">
                        <input type="text" name="hgvs" className="form-input" placeholder="Use HGVS nomenclature" onChange={this.handleInputChange} value={this.state.hgvs} disabled={loading}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {error &&
                            <span className="error">There was an error processing your request. Please check your Gene Symbol and try again.</span>
                        }
                        {loading &&
                            <span>Loading....</span>
                        }
                        {noResults &&
                            <span>No results found for this criteria: {searching.var1} at position {searching.position} in {searching.sequence}</span>
                        }
                        {!loading && Object.keys(transcripts).length > 0 &&
                            <div>
                                <h3>Transcript for {searching.var1} at position {searching.position} in {searching.sequence}</h3>
                                <ul>
                                    {transcripts.map( (transcript, i) =>
                                        <li key={i}><a href={`http://www.ensembl.org/id/${transcript.id}`} target="_blank" rel="noopener noreferrer">{transcript.display_name}</a></li>
                                    )}
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default HGVSSearch;