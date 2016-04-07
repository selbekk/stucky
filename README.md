# Stucky - sticky table headers

This is a pretty simple to use sticky table headers implementation

## Installation

The package is available via NPM:

```bash
$ npm install --save stucky
```

If you don't believe in package managers, you can grab either [the
uncompressed](dist/stucky.js) or [the minified version](dist/stucky.min.js).

## Usage

I like stuff to be simple to use. When the DOM is loaded, simply add this:

```javascript
// Import the scripts
import Stucky from 'stucky';

// Select your tables
const $tables = [...document.querySelectorAll('table')]

// Set up options
const opts = {
    // These are explained further down
};

// Initiate them
$tables.forEach($table => new Stucky($table, opts));
```

### Options

There are a few options available:

```javascript
const opts = {
    topMargin: 0 // If you have a fixed header, this value will let you account for it
};
```

## Development

## Open open source
