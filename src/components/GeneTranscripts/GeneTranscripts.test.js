import React from 'react';
import { configure, shallow } from 'enzyme';
import GeneTranscripts from './index';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


/* mock definition */
const geneMock = {
    id: 'ENSG00000000001',
    Transcript: [
        {
            display_name: "TRANSCRIPT-1",
            Translation: {
                id: 'ENSP00000000001'
            }
        },
        {
            display_name: "TRANSCRIPT-2",
            Translation: {
                id: 'ENSP00000000002'
            }
        },
        {
            display_name: "TRANSCRIPT-3",
            Translation: {
                id: 'ENSP00000000003'
            }
        }
    ],
};

const sequenceMock = [
    {
        id: 'ENSP00000000001',
        seq: 'VCNIK'
    },
    {
        id: 'ENSP00000000002',
        seq: 'WVNIK'
    },
    {
        id: 'ENSP00000000003',
        seq: 'KVNIK'
    },
];

 
it('should render GeneTranscripts module', () => {
  const wrapper = shallow(<GeneTranscripts />);
  const moduleTitle = <h2 className="title">Task 1</h2>;
  expect(wrapper.contains(moduleTitle)).toEqual(true);
});


it('should execute generateTranscriptsResult and return TRANSCRIPT-1', () => {
    const wrapper = shallow(<GeneTranscripts />);
    const instance = wrapper.instance();
    instance.generateTranscriptsResult(geneMock, sequenceMock, 'V');
    expect(wrapper.state('transcripts')).toEqual([geneMock.Transcript[0]]);
});


it('should execute generateTranscriptsResult and return no results', () => {
    const wrapper = shallow(<GeneTranscripts />);
    const instance = wrapper.instance();
    instance.generateTranscriptsResult(geneMock, sequenceMock, 'I');
    expect(wrapper.state('noResults')).toBe(true);
});