import raf from 'raf';
import assign from 'object-assign';

class Stucky {
    constructor($el, opts) {
        const defaults = {
            offsetHeight: 0,    // Offset height of "top of screen"
            allowance: 100,     // Allowance at the bottom of the table
            wrapperClasses: ''  // Classes to add to the wrapper
        };

        this.$el = $el;
        this.$head = this.$el.querySelector('thead');
        this.$bodyHeaders = [...this.$el.querySelectorAll('tbody th')];
        this.$caption = this.$el.querySelector('caption');

        if(!this.$head && !this.$bodyHeaders.length) {
            return; // Nothing to stick?
        }

        this.opts = assign({}, defaults, opts);

        // Wrap the table in an overflowing div
        this._initWrap();


        if(this.$head) {
            this.$stickyHead = this._initStickyHead();
            this.$stickyIntersectTable = this._initStickyIntersect();
            let id = null;
            window.addEventListener('scroll', this._throttle(this._repositionStickyHead.bind(this), id));
            this._repositionStickyHead();
        }
        if(this.$bodyHeaders.length) {
            this.$stickyBodyTable = this._initStickyBody();
            let id = null;
            this.$el.parentNode.addEventListener('scroll', this._throttle(this._repositionStickyCols.bind(this), id));
            this._repositionStickyCols();
        }
    }

    _throttle(callback, id) {
        return () => {
            if (id) raf.cancel(id);
            raf(callback);
        }
    }

    _initWrap() {
        const $wrap = document.createElement('div');
        $wrap.classList.add('sticky-wrap');
        this.opts.wrapperClasses
            .split(' ')
            .filter(s => s && s.length)
            .forEach(className => $wrap.classList.add(className));

        this.$el.parentNode.insertBefore($wrap, this.$el);
        $wrap.appendChild(this.$el);
    }

    _initStickyHead() {
        if(!this.$head) {
            return;
        }

        const $stickyTHead = this.$head.cloneNode(true);
        $stickyTHead.classList.add('sticky-thead');

        const $stickyTable = document.createElement('table');
        $stickyTable.classList.add('sticky-head');

        // Insert placeholder table after original table
        this.$el.parentNode.insertBefore($stickyTable, this.$el.nextElementSibling);

        // Insert sticky head inside new table top
        $stickyTable.appendChild($stickyTHead);

        return $stickyTable;
    }

    _initStickyBody() {
        if(!this.$bodyHeaders) {
            return;
        }

        // Clone the table
        const $clonedTable = this.$el.cloneNode(true);

        // Delete ignorable content
        [...$clonedTable.querySelectorAll('thead th:not(:first-of-type), tbody td, caption')]
            .forEach($deletable => $deletable.parentNode.removeChild($deletable));


        // Create a new table for adding columns
        const $stickyCol = document.createElement('table');
        $stickyCol.classList.add('sticky-col');


        // Insert sticky column table after original table
        this.$el.parentNode.insertBefore($stickyCol, this.$el.nextElementSibling);
        [...$clonedTable.children].forEach($child => $stickyCol.appendChild($child));

        return $stickyCol;
    }

    _initStickyIntersect() {
        if(!this.$bodyHeaders) {
            return;
        }

        // Clone the table
        const $clonedTable = this.$el.cloneNode(true);

        [...$clonedTable.querySelectorAll('thead th:not(:first-of-type), tbody, caption')]
            .forEach($deletable => $deletable.parentNode.removeChild($deletable));

        // Create a new table for adding intersect
        const $stickyIntersect = document.createElement('table');
        $stickyIntersect.classList.add('sticky-intersect');

        // Insert sticky intersect table after original table
        this.$el.parentNode.insertBefore($stickyIntersect, this.$el.nextElementSibling);
        [...$clonedTable.children].forEach($child => $stickyIntersect.appendChild($child));

        return $stickyIntersect;
    }

    _calculateStickyHeadDimensions() {
        // Set width of fake headers to equal the real headers
        const $originalTableHeaders = [...this.$el.querySelectorAll('thead th')];
        const $fakeTableHeaders = [...this.$stickyHead.querySelectorAll('thead th')];
        $originalTableHeaders.forEach(($th, i) => {
            $fakeTableHeaders[i].style.width = `${$th.getBoundingClientRect().width}px`;
        });

        // Set width of fake table to equal the real table
        this.$stickyHead.style.width = `${this.$el.getBoundingClientRect().width}px`;

        const $originalIntersect = this.$el.querySelector('thead th');
        if($originalIntersect) {
            const $fakeIntersect = this.$stickyIntersectTable.querySelector('thead th');
            $fakeIntersect.style.width = `${$originalIntersect.getBoundingClientRect().width}px`;
        }
    }

    _calculateStickyBodyDimensions() {
        const $originalTableHeaders = [...this.$el.querySelectorAll('tbody th')];
        const $fakeTableHeaders = [...this.$stickyBodyTable.querySelectorAll('tbody th')];
        $originalTableHeaders.forEach(($th, i) => {
            $fakeTableHeaders[i].style.width = `${$th.getBoundingClientRect().width}px`;
            $fakeTableHeaders[i].style.height = `${$th.getBoundingClientRect().height}px`;
        });

        const $originalIntersect = this.$el.querySelector('thead th');
        if($originalIntersect) {
            const $fakeIntersect = this.$stickyIntersectTable.querySelector('thead th');
            $fakeIntersect.style.width = `${$originalIntersect.getBoundingClientRect().width}px`;
        }
    }

    _repositionStickyHead() {
        this._calculateStickyHeadDimensions();
        const elRect = this.$el.getBoundingClientRect();
        const captionHeight = this.$caption ? this.$caption.offsetHeight : 0;

        if(elRect.top + captionHeight < this.opts.offsetHeight && elRect.bottom > this.opts.allowance) {
            this.$stickyHead.style.top = `${-elRect.top + this.opts.offsetHeight}px`;
            this.$stickyHead.classList.add('is-active');

            if(this.$stickyIntersectTable) {
                this.$stickyIntersectTable.style.top = `${-elRect.top + this.opts.offsetHeight}px`;
                this.$stickyIntersectTable.classList.add('is-active');
                this.$stickyIntersectTable.style.transform = null;
            }
        }
        else {
            this.$stickyHead.style.top = null;
            this.$stickyHead.classList.remove('is-active');

            if(this.$stickyIntersectTable) {
                this.$stickyIntersectTable.style.transform = `translateY(${captionHeight}px)`;
                this.$stickyIntersectTable.style.top = null;
                this.$stickyIntersectTable.classList.remove('is-active');
            }
        }
    }

    _repositionStickyCols() {
        this._calculateStickyBodyDimensions();
        const scrollLeft = this.$el.parentNode.scrollLeft;
        const captionHeight = this.$caption ? this.$caption.offsetHeight : 0;



        if(scrollLeft > 0) {
            this.$stickyBodyTable.style.transform = `translateY(${captionHeight}px)`;
            this.$stickyBodyTable.style.left = `${scrollLeft}px`;
            this.$stickyBodyTable.classList.add('is-active');

            if(this.$stickyIntersectTable) {
                this.$stickyIntersectTable.style.left = `${scrollLeft}px`;
                this.$stickyIntersectTable.classList.add('is-active');
            }
        }
        else {
            this.$stickyBodyTable.style.top = null;
            this.$stickyBodyTable.style.transform = null
            this.$stickyBodyTable.style.left = null;
            this.$stickyBodyTable.classList.remove('is-active');

            if(this.$stickyIntersectTable) {
                this.$stickyIntersectTable.style.left = null;
                this.$stickyIntersectTable.classList.remove('is-active');
            }
        }
    }

}

export default Stucky;
if(module.exports) {
    exports.default = Stucky;
}
else {
    window.Stucky = Stucky;
}
