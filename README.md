# Stucky - sticky table headers

This is a pretty simple to use sticky table headers implementation. Not a ton
of features, but who needs them anyways.

**Oh, and a nice bonus is that it doesn't require jQuery!**

[selbekk.github.io/stucky](https://selbekk.github.io/stucky)

## Features

Once initialized, your tables should hopefully get awesome sticky headers.

- If you have a `<thead />`, you'll get a horizontal sticky header row
- If you have `<th />`s inside your `<tbody>` tag, you'll get a vertical sticky
header row.
- If you have both - well, god darn it, you'll get all the stickies.

### Browser compatibility

Tested and working in latest evergreen browsers, on both desktop and phones, as
well as IE 9 or newer. Note that in order for IE9 to work, you need a
[`classList`](https://github.com/eligrey/classList.js) polyfill. The `demo.js`
also uses [`babel-polyfill`](https://github.com/babel/babel/tree/master/packages/babel-polyfill),
which adds some ES5 methods.

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

// Select the tables you want to have sticky headers
const $tables = [...document.querySelectorAll('table')];

// Set up options
const opts = {
    // If you have a fixed header, this px value will let you account for it
    topMargin: 0,
    // Remove the header this px value before the end of the table
    allowance: 0,
    // Space separated class names to apply to the table wrapper
    wrapperClasses: ''
};

// Initiate them
$tables.forEach($table => new Stucky($table, opts));
```

### A note about styles

There are some styles that are required for this to work. You'll find it
[here](dist/stucky.css) - but it's also included in the NPM package if you want
to use it directly. Just make sure they are included somehow!

## Open open source

**We :heart: pull requests!** If you want to help out, feel free to create an issue,
or even better - create a pull request to go with it. If I like your work, I'll
make sure to make you a contributor :)

### Development

If you'd like to submit a pull request or fork this project, I've already set
up some basic build tasks:

```bash
$ npm run build     # Build the project
$ npm start         # Start a dev server and open the demo page in a new tab
```
