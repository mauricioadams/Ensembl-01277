import React, { Component } from 'react';
import './header.css';

class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className="wrap">
                    <h1 className="title">Ensembl App</h1>    
                </div>
            </header>
        );
    }
}

export default Header;