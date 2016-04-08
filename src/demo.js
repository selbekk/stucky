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
