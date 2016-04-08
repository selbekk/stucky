'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stucky = function () {
    function Stucky($el, opts) {
        _classCallCheck(this, Stucky);

        var defaults = {
            offsetHeight: 0, // Offset height of "top of screen"
            allowance: 100, // Allowance at the bottom of the table
            wrapperClasses: '' // Classes to add to the wrapper
        };

        this.$el = $el;
        this.opts = (0, _objectAssign2.default)({}, defaults, opts);
        this.$head = this.$el.querySelector('thead');
        this.$bodyHeaders = [].concat(_toConsumableArray(this.$el.querySelectorAll('tbody th')));

        if (!this.$head && !this.$bodyHeaders.length) {
            return; // Nothing to stick?
        }

        // Mark the table as sticky enabled
        this._initWrap();

        if (this.$head) {
            this.$stickyHead = this._initStickyHead();
            this.$stickyIntersectTable = this._initStickyIntersect();
            this._calculateStickyHeadDimensions();
            var id = null;
            window.addEventListener('scroll', this._throttle(this._repositionStickyHead.bind(this), id));
            this._repositionStickyHead();
        }
        if (this.$bodyHeaders.length) {
            this.$stickyBodyTable = this._initStickyBody();
            this._calculateStickyBodyDimensions();
            var _id = null;
            this.$el.parentNode.addEventListener('scroll', this._throttle(this._repositionStickyCols.bind(this), _id));
            this._repositionStickyCols();
        }
    }

    _createClass(Stucky, [{
        key: '_throttle',
        value: function _throttle(callback, id) {
            return function () {
                if (id) _raf2.default.cancel(id);
                (0, _raf2.default)(callback);
            };
        }
    }, {
        key: '_initWrap',
        value: function _initWrap() {
            var $wrap = document.createElement('div');
            $wrap.classList.add('sticky-wrap');
            this.opts.wrapperClasses.split(' ').filter(function (s) {
                return s && s.length;
            }).forEach(function (className) {
                return $wrap.classList.add(className);
            });

            this.$el.parentNode.insertBefore($wrap, this.$el);
            $wrap.appendChild(this.$el);
        }
    }, {
        key: '_initStickyHead',
        value: function _initStickyHead() {
            if (!this.$head) {
                return;
            }

            var $stickyTHead = this.$head.cloneNode(true);
            $stickyTHead.classList.add('sticky-thead');

            var $stickyTable = document.createElement('table');
            $stickyTable.classList.add('sticky-head');

            // Insert placeholder table after original table
            this.$el.parentNode.insertBefore($stickyTable, this.$el.nextElementSibling);

            // Insert sticky head inside new table top
            $stickyTable.appendChild($stickyTHead);

            return $stickyTable;
        }
    }, {
        key: '_initStickyBody',
        value: function _initStickyBody() {
            if (!this.$bodyHeaders) {
                return;
            }

            // Clone the table
            var $clonedTable = this.$el.cloneNode(true);

            // Delete ignorable content
            [].concat(_toConsumableArray($clonedTable.querySelectorAll('thead th:not(:first-of-type), tbody td'))).forEach(function ($deletable) {
                return $deletable.parentNode.removeChild($deletable);
            });

            // Create a new table for adding columns
            var $stickyCol = document.createElement('table');
            $stickyCol.classList.add('sticky-col');

            // Insert sticky column table after original table
            this.$el.parentNode.insertBefore($stickyCol, this.$el.nextElementSibling);
            [].concat(_toConsumableArray($clonedTable.children)).forEach(function ($child) {
                return $stickyCol.appendChild($child);
            });

            return $stickyCol;
        }
    }, {
        key: '_initStickyIntersect',
        value: function _initStickyIntersect() {
            if (!this.$bodyHeaders) {
                return;
            }

            // Clone the table
            var $clonedTable = this.$el.cloneNode(true);

            [].concat(_toConsumableArray($clonedTable.querySelectorAll('thead th:not(:first-of-type), tbody'))).forEach(function ($deletable) {
                return $deletable.parentNode.removeChild($deletable);
            });

            // Create a new table for adding intersect
            var $stickyIntersect = document.createElement('table');
            $stickyIntersect.classList.add('sticky-intersect');

            // Insert sticky intersect table after original table
            this.$el.parentNode.insertBefore($stickyIntersect, this.$el.nextElementSibling);
            [].concat(_toConsumableArray($clonedTable.children)).forEach(function ($child) {
                return $stickyIntersect.appendChild($child);
            });

            return $stickyIntersect;
        }
    }, {
        key: '_calculateStickyHeadDimensions',
        value: function _calculateStickyHeadDimensions() {
            // Set width of fake headers to equal the real headers
            var $originalTableHeaders = [].concat(_toConsumableArray(this.$el.querySelectorAll('thead th')));
            var $fakeTableHeaders = [].concat(_toConsumableArray(this.$stickyHead.querySelectorAll('thead th')));
            $originalTableHeaders.forEach(function ($th, i) {
                $fakeTableHeaders[i].style.width = $th.getBoundingClientRect().width + 'px';
            });

            // Set width of fake table to equal the real table
            this.$stickyHead.style.width = this.$el.getBoundingClientRect().width + 'px';

            var $originalIntersect = this.$el.querySelector('thead th');
            if ($originalIntersect) {
                var $fakeIntersect = this.$stickyIntersectTable.querySelector('thead th');
                $fakeIntersect.style.width = $originalIntersect.getBoundingClientRect().width + 'px';
            }
        }
    }, {
        key: '_calculateStickyBodyDimensions',
        value: function _calculateStickyBodyDimensions() {
            var $originalTableHeaders = [].concat(_toConsumableArray(this.$el.querySelectorAll('tbody th')));
            var $fakeTableHeaders = [].concat(_toConsumableArray(this.$stickyBodyTable.querySelectorAll('tbody th')));
            $originalTableHeaders.forEach(function ($th, i) {
                $fakeTableHeaders[i].style.width = $th.getBoundingClientRect().width + 'px';
                $fakeTableHeaders[i].style.height = $th.getBoundingClientRect().height + 'px';
            });

            var $originalIntersect = this.$el.querySelector('thead th');
            if ($originalIntersect) {
                var $fakeIntersect = this.$stickyIntersectTable.querySelector('thead th');
                $fakeIntersect.style.width = $originalIntersect.getBoundingClientRect().width + 'px';
            }
        }
    }, {
        key: '_repositionStickyHead',
        value: function _repositionStickyHead() {
            var elRect = this.$el.getBoundingClientRect();

            if (elRect.top < this.opts.offsetHeight && elRect.bottom > this.opts.allowance) {
                this.$stickyHead.style.top = -elRect.top + this.opts.offsetHeight + 'px';
                this.$stickyHead.classList.add('is-active');

                if (this.$stickyIntersectTable) {
                    this.$stickyIntersectTable.style.top = -elRect.top + this.opts.offsetHeight + 'px';
                    this.$stickyIntersectTable.classList.add('is-active');
                }
            } else {
                this.$stickyHead.style.top = null;
                this.$stickyHead.classList.remove('is-active');

                if (this.$stickyIntersectTable) {
                    this.$stickyIntersectTable.style.top = null;
                    this.$stickyIntersectTable.classList.remove('is-active');
                }
            }
        }
    }, {
        key: '_repositionStickyCols',
        value: function _repositionStickyCols() {
            var scrollLeft = this.$el.parentNode.scrollLeft;

            if (scrollLeft > 0) {

                this.$stickyBodyTable.style.transform = 'translateX(' + scrollLeft + 'px)';
                this.$stickyBodyTable.classList.add('is-active');

                if (this.$stickyIntersectTable) {
                    this.$stickyIntersectTable.style.transform = 'translateX(' + scrollLeft + 'px)';
                    this.$stickyIntersectTable.classList.add('is-active');
                }
            } else {
                this.$stickyBodyTable.style.transform = null;
                this.$stickyBodyTable.classList.remove('is-active');

                if (this.$stickyIntersectTable) {
                    this.$stickyIntersectTable.style.transform = null;
                    this.$stickyIntersectTable.classList.remove('is-active');
                }
            }
        }
    }]);

    return Stucky;
}();

exports.default = Stucky;

if (module.exports) {
    exports.default = Stucky;
}
