import { Sbox } from '@mdrajibul/sbox';
import $ from 'jquery';
import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const sboxRef = useRef();

  useEffect(() => {
    new Sbox({
      selector: sboxRef.current,
      width: '120px',
      typeHeader: false,
      dataStore: {
        json: [
          {
            id: 'usa',
            name: 'United states',
            image: 'https://www.countryflags.com/wp-content/uploads/united-states-of-america-flag-png-large.png',
          },
          {
            id: 'uk',
            name: 'United kingdom',
            image: 'https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png',
          },
          {
            id: 'india',
            name: 'India',
            image: 'https://www.countryflags.com/wp-content/uploads/india-flag-png-large.png',
          },
        ],
      },
      listners: {
        onSelect: function (el, data) {
          console.log(el, data);
        },
      },
    });
    $(() => {
      $('#status').Sbox({ width: 200 });
    });
  });

  return (
    <div className="App">
      <div id="sbox" ref={sboxRef}></div>
      <select id="status">
        <option>Active</option>
        <option>Inactive</option>
        <option>Deleted</option>
      </select>
    </div>
  );
}

export default App;
