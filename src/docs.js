// Polyfills
import 'classlist.js'; // Needed for IE9 and below
import 'babel-polyfill'; // Needed for IE11 and below

import 'whatwg-fetch';
import Stucky from './stucky';

function getRandomSelection(arr, count) {
    const result = [];
    for(let i = 0; i < count; i++) {
        result.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    return result;
}

function populateTestData() {
    if(localStorage.getItem('testData')) {
        return renderTableRows();
    }

    return fetch('https://randomuser.me/api/?results=1000')
        .then(res => res.json())
        .then(json => localStorage.setItem('testData', JSON.stringify(json.results)))
        .then(renderTableRows);
}

function renderTableRows() {
    const testData = JSON.parse(localStorage.getItem('testData'))
        .map(person => ({
            name: `${person.name.first} ${person.name.last}`,
            address: `${person.location.street}, ${person.location.postcode} ${person.location.city}`,
            email: `${person.email}`,
            phone: `${person.phone}`,
            username: `${person.login.username}`,
            gender: `${person.gender}`,
            nationality: `${person.nat}`
        }));

    const $tables = [...document.querySelectorAll('table')];

    $tables.forEach($table => {
        const isVertical = $table.getAttribute('data-vertical') === 'true';

        const rowCount = parseInt($table.getAttribute('data-rows'));
        const colCount = [...$table.querySelectorAll('thead th')].length
            || parseInt($table.getAttribute('data-columns'))
            || 3;

        const $tbody = $table.querySelector('tbody');

        for(let row = 0; row < rowCount; row++) {
            const tr = document.createElement('tr');
            const data = getRandomSelection(testData, rowCount);
            const keys = Object.keys(data[row]);

            for(let col = 0; col < colCount; col++) {
                let cell = document.createElement(isVertical && col === 0 ? 'th' : 'td');
                cell.innerHTML = data[row][keys[col]];
                tr.appendChild(cell);
            }
            $tbody.appendChild(tr);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Populate some test data
    populateTestData();

    // Select your tables
    const $tables = [...document.querySelectorAll('table')];

    // Set up options
    const opts = {

    };

    // Initiate them
    $tables.forEach($table => {

        new Stucky($table, opts);
    });
});
