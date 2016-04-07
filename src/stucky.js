import raf from 'raf';

export default class TableStickyHeader {
    constructor($el, opts) {
        this.$el = $el;
        this.$head = this.$el.querySelector('thead');
        this.$bodyHeaders = [...this.$el.querySelectorAll('tbody th')];
        this.siteHeaderHeight = document.querySelector('.site-header').offsetHeight;

        if(!this.$head && !this.$bodyHeaders.length) {
            return; // Nothing to stick?
        }

        // Mark the table as sticky enabled
        this._initWrap();

        if(this.$head) {
            this.$stickyHead = this._initStickyHead();
            this._calculateStickyHeadDimensions();
            let id = null;
            window.addEventListener('scroll', this._throttle(this._repositionStickyHead.bind(this), id));
            this._repositionStickyHead();
        }
        if(this.$bodyHeaders.length) {
            this.$stickyBodyTable = this._initStickyBody();
            this.$stickyIntersectTable = this._initStickyIntersect();
            this._calculateStickyBodyDimensions();
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
        this.$el.parentNode.classList.add('sticky-wrap');
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
        [...$clonedTable.querySelectorAll('thead th:not(:first-of-type), tbody td')]
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

        [...$clonedTable.querySelectorAll('thead th:not(:first-of-type), tbody')]
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
    }

    _calculateStickyBodyDimensions() {
        const $originalTableHeaders = [...this.$el.querySelectorAll('tbody th')];
        const $fakeTableHeaders = [...this.$stickyBodyTable.querySelectorAll('tbody th')];
        $originalTableHeaders.forEach(($th, i) => {
            $fakeTableHeaders[i].style.width = `${$th.getBoundingClientRect().width}px`;
            $fakeTableHeaders[i].style.height = `${$th.getBoundingClientRect().height}px`;
        });

        const $originalIntersect = this.$el.querySelector('thead th');
        const $fakeIntersect = this.$stickyIntersectTable.querySelector('thead th');
        $fakeIntersect.style.width = `${$originalIntersect.getBoundingClientRect().width}px`;
    }

    _repositionStickyHead() {
        const elRect = this.$el.getBoundingClientRect();

        if(elRect.top < this.siteHeaderHeight && elRect.bottom > 0) {
            this.$stickyHead.style.top = `${-elRect.top + this.siteHeaderHeight}px`;
            this.$stickyHead.classList.add('is-active');

            if(this.$stickyIntersectTable) {
                this.$stickyIntersectTable.style.top = `${-elRect.top + this.siteHeaderHeight}px`;
                this.$stickyIntersectTable.classList.add('is-active');
            }

        }
        else {
            this.$stickyHead.style.top = null;
            this.$stickyHead.classList.remove('is-active');

            if(this.$stickyIntersectTable) {
                this.$stickyIntersectTable.style.top = null;
                this.$stickyIntersectTable.classList.remove('is-active');
            }
        }
    }

    _repositionStickyCols() {
        const scrollLeft = this.$el.parentNode.scrollLeft;

        if(scrollLeft > 0) {

            this.$stickyBodyTable.style.transform = `translateX(${scrollLeft}px)`;
            this.$stickyBodyTable.classList.add('is-active');

            this.$stickyIntersectTable.style.transform = `translateX(${scrollLeft}px)`;
            this.$stickyIntersectTable.classList.add('is-active');
        }
        else {
            this.$stickyBodyTable.style.transform = null;
            this.$stickyBodyTable.classList.remove('is-active');

            this.$stickyIntersectTable.style.transform = null;
            this.$stickyIntersectTable.classList.remove('is-active');
        }
    }

}
