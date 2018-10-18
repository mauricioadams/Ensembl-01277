import React, { Component } from 'react';
import { getGeneBySymbol } from '../../services/lookup';
import { getSequence } from '../../services/sequence';

import './transcripts.css';

class GeneTranscripts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gene: '',
            position: '',
            aminoLetter: '',
            error: false,
            loading: false,
            transcripts: {},
            fieldError: false,
            noResults: false 
        };
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loading = this.loading.bind(this);
        this.clearLoading = this.clearLoading.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    loading() {
        this.setState({loading: true, error: false, formError: false, noResults: false});
    }

    clearLoading() {
        this.setState({loading: false, error: false, formError: false});
    }

    handleError() {
        //function to deal with critical errors... use not just to set state but to notify admin,create log entry, etc
        this.setState({error: true, loading: false, formError: false, noResults: false});
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    generateTranscriptsResult(gene, sequence, amino) {
        let transcripts = gene.Transcript;
        //filter all sequence valid by amino starting on position and get only ids to compare in transcripts
        let sequenceIds = sequence.filter(function(elem) {
            return elem.seq[0] === amino;
        }).map(function(elem) {
              return elem.id;
        });

        transcripts = transcripts.filter(function(elem) {
            return  (elem.hasOwnProperty('Translation')) && (sequenceIds.includes(elem.Translation.id));
        });

        if(transcripts.length) {
            this.setState({transcripts: transcripts});
        } else {
            this.setState({noResults: true});
        }
        
    }

    handleSubmit(e) {
        e.preventDefault();

        let gene = [];
        let sequence = [];
        
        //Simple form validation... in a real world all inputs would be checked by type and regex not just empty
        if(!this.state.position.length || !this.state.aminoLetter.length || !this.state.gene.length) {
            this.setState({formError: true});
            return;
        }

        this.loading();
        getGeneBySymbol(this.state.gene)
            .then((data) => {
                if(data.error) {
                    this.handleError();
                } else {
                    //Add gene information
                    gene = data;
                    getSequence(gene.id, 'protein', this.state.position)
                        .then((data) => {
                            if(data.error) {
                                this.handleError();
                            } else {
                                sequence = data;      
                                this.generateTranscriptsResult(gene, sequence, this.state.aminoLetter);
                                this.clearLoading();
                            }
                        });
                }
            });
    }

    render() {
        const error = this.state.error;
        const loading = this.state.loading;
        const transcripts = this.state.transcripts;
        const formError = this.state.formError;
        const noResults = this.state.noResults;

        return (
            <div className="wrap container">
                <h2 className="title">Task 1</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                            <div className="col-md-3">
                                <input type="text" name="gene" className="form-input" placeholder="Gene symbol" onChange={this.handleInputChange} value={this.state.gene} />
                            </div>
                            <div className="col-md-3">
                            <input type="text" name="position" className="form-input" placeholder="Protein sequence position" onChange={this.handleInputChange} value={this.state.position} />
                            </div>
                            <div className="col-md-3">
                            <input type="text" name="aminoLetter" className="form-input" placeholder="Amino acid letter" onChange={this.handleInputChange} value={this.state.aminoLetter}  />
                            </div>
                            <div className="col-md-3">
                                <input className="form-buttom" type="submit" value="Search" disabled={loading}/>
                            </div>
                    </div>
                </form>
                <div className="row">
                    <div className="col-md-12">
                        {formError && 
                            <span className="error">Please inform all fields.</span>
                        }
                        {error &&
                            <span className="error">There was an error processing your request. Please check your Gene Symbol and try again.</span>
                        }
                        {loading &&
                            <span>Loading....</span>
                        }
                        {!loading && Object.keys(transcripts).length > 0 &&
                            <div>
                                <h3>All transcripts for <i>{this.state.gene}</i> with <i>{this.state.aminoLetter}</i> amino acid at position <i>{this.state.position}</i></h3>
                                <ul>
                                    {transcripts.map( (transcript, i) =>
                                        <li key={i}><a href={`http://www.ensembl.org/id/${transcript.id}`} target="_blank" rel="noopener noreferrer">{transcript.display_name}</a></li>
                                    )}
                                </ul>
                            </div>
                        }
                        {noResults &&
                            <span>There are no results for this search</span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default GeneTranscripts;