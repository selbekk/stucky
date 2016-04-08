import 'classlist.js'; // Needed for IE9 and below
import 'babel-polyfill'; // Needed for IE11 and below
import Stucky from './stucky';

document.addEventListener('DOMContentLoaded', () => {
    // Import the scripts

    // Select your tables
    const $tables = [...document.querySelectorAll('table')];

    // Set up options
    const opts = {
        // These are explained further down
    };

    // Initiate them
    $tables.forEach($table => new Stucky($table, opts));
});
