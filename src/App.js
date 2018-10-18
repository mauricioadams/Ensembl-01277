import React, { Component } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import GeneTranscripts from './components/GeneTranscripts';
import HGVSSearch from './components/HGVSSearch';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Header />
        <GeneTranscripts />
        <HGVSSearch />
        <Footer />
      </div>
    );
  }
}

export default App;
