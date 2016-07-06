/*! Chisel v0.0.23 | MIT License | http://kennedyrose.com/ */
;
window.c = {
    noop: function () {
    }
};
!function (d, w, c, u) {
    'use strict';
    var proto = {
        onSlide: 0,
        // Starting slide
        auto: false,
        // Whether or not the slides change on their own
        delay: 2000,
        // Delay between slides
        stopAnimationOnClick: false,
        // Stops animation on user interaction
        animation: false,
        // Animation type (can also be set in markup)
        buttons: false,
        // Creates buttons if they don't already exist
        arrows: false,
        // Creates arrows if they don't already exist
        gallery: false,
        // Image gallery behavior (can also be set in markup)
        ignoreClasses: [
            // Classes that won't be treated like slides
            'buttons',
            'previous',
            'next'
        ],
        classes: {
            active: 'active',
            gallery: 'gallery',
            last: 'last',
            buttons: 'buttons',
            previous: 'previous',
            next: 'next',
            fade: 'fade'
        },
        nextSlide: function () {
            var n = this.onSlide;
            n++;
            if (n >= this.total) {
                n = 0;
            }
            return this.goToSlide(n);
        },
        previousSlide: function () {
            var n = this.onSlide;
            n--;
            if (n < 0) {
                n = this.total - 1;
            }
            return this.goToSlide(n);
        },
        goToSlide: function (n) {
            if (n === this.onSlide) {
                return this;
            }
            var prev = this.onSlide;
            this.onSlide = n;
            if (this.previous) {
                this.previous.classList.remove(this.classes.last);
            }
            this.previous = this.slides[prev];
            this.slides[n].classList.add(this.classes.active);
            this.previous.classList.remove(this.classes.active);
            this.previous.classList.add(this.classes.last);
            // If gallery
            if (this.gallery && !this.galleryActivated[n]) {
                this.galleryActivated[n] = true;
                var el = this.slides[n].querySelector('[data-src]');
                if (el) {
                    el.src = el.dataset.src;
                }
            }
            // Add active state to button if exists
            if (this.buttons) {
                this.buttons[n].classList.add(this.classes.active);
                this.buttons[prev].classList.remove(this.classes.active);
            }
            return this;
        },
        loop: function ($this) {
            $this.nextSlide();
            $this.timeout = setTimeout($this.loop, $this.delay, $this);
        },
        goToId: function (id) {
            return this.goToSlide(this.slideIds[id]);
        }
    };
    function Carousel(obj) {
        var $this = this;
        // Copy options
        if (obj.nodeType && obj.nodeType === 1) {
            obj = { el: obj };
        } else {
            for (var i in obj) {
                this[i] = obj[i];
            }
        }
        // Pull in options from data
        if (this.el.dataset) {
            for (var i in Carousel.prototype) {
                var lower = i.toLowerCase();
                if (lower in this.el.dataset) {
                    if (typeof Carousel.prototype[i] !== 'string') {
                        this[i] = JSON.parse(this.el.dataset[lower]);
                    } else {
                        this[i] = this.el.dataset[lower];
                    }
                }
            }
        }
        // Add animation class
        if (this.animation === 'fade') {
            this.el.classList.add(this.classes.fade);
        }
        // Activate image gallery
        if (this.el.classList.contains(this.classes.gallery)) {
            this.gallery = true;
        } else if (this.gallery === true) {
            this.el.classList.add(this.classes.gallery);
        }
        this.galleryActivated = [];
        // Get all slide elements
        this.slides = [];
        this.slideIds = {};
        var children = this.el.children;
        for (i = 0; i < children.length; i++) {
            var skip = false;
            for (var ii = this.ignoreClasses.length; ii--;) {
                if (children[i].classList.contains(this.ignoreClasses[ii])) {
                    skip = true;
                    break;
                }
            }
            if (!skip) {
                this.slides.push(children[i]);
                this.slideIds[children[i].id] = i;
                // Look for links to change slides
                var els = d.querySelectorAll('[data-carousel="' + children[i].id + '"]');
                for (var ii = 0; ii < els.length; ii++) {
                    els[ii].addEventListener('click', this.goToId.bind(this, children[i].id));
                }
            }
        }
        // Get total
        this.total = this.slides.length;
        // Find active slide
        if (!this.onSlide) {
            for (i = this.slides.length; i--;) {
                if (this.slides[i].classList.contains(this.classes.active)) {
                    this.onSlide = i;
                }
            }
        }
        // Find/create buttons
        var buttons = this.el.querySelectorAll('.' + this.classes.buttons + ' > *');
        if (!buttons.length) {
            if (this.buttons) {
                this.buttons = [];
                buttons = d.createElement('div');
                buttons.style.opacity = 0;
                buttons.className = this.classes.buttons;
                for (i = 0; i < this.slides.length; i++) {
                    this.buttons[i] = d.createElement('a');
                    this.buttons[i].dataset.carousel = this.slides[i].id;
                    buttons.appendChild(this.buttons[i]);
                }
                this.el.appendChild(buttons);
                buttons.style.opacity = 1;
                this.buttons[this.onSlide].classList.add(this.classes.active);
            }
        } else {
            this.buttons = buttons;
            this.buttons[this.onSlide].classList.add(this.classes.active);
        }
        // Create arrows
        if (this.arrows === true) {
            var el = d.createElement('div');
            el.className = this.classes.previous;
            this.el.appendChild(el);
            el = d.createElement('div');
            el.className = this.classes.next;
            this.el.appendChild(el);
        }
        // Configure controls
        this.el.addEventListener('click', function (e) {
            var isControl = false;
            // If previous or next
            if (e.target.classList.contains($this.classes.previous)) {
                isControl = true;
                $this.previousSlide();
            } else if (e.target.classList.contains($this.classes.next)) {
                isControl = true;
                $this.nextSlide();
            }
            if (isControl) {
                if ($this.auto) {
                    clearTimeout($this.timeout);
                    if (!$this.stopAnimationOnClick) {
                        $this.timeout = setTimeout($this.loop, $this.delay, $this);
                    }
                }
                e.preventDefault();
            }
        });
        // Start animation
        if (this.auto) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(this.loop, this.delay, this);
        }
        return this;
    }
    Carousel.prototype = proto;
    // Initiate modals already in DOM
    function findCarousel() {
        var els = d.getElementsByClassName('carousel');
        for (var i = els.length; i--;) {
            if (els[i].dataset.options) {
                var obj = JSON.parse(els[i].dataset.options);
            } else {
                obj = {};
            }
            obj.el = els[i];
            new Carousel(obj);
        }
    }
    c.findCarousel = findCarousel;
    c.Carousel = Carousel;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*
		// USAGE:

		// Setup to-be parent element as extendable (Must have at least one child)
		var productList = new DomExtension({
			parent: document.querySelector('#productList')
		})

		// Create new elements if needed
		productList.total(10)
		// Populate/modify the newly created elements if needed
		// Show elements when done
		productList.show(10)

	*/
    var proto = {
        deep: true,
        showEl: function (el) {
            el.style.display = 'block';
        },
        hideEl: function (el) {
            el.style.display = 'none';
        },
        onExtend: noop,
        onContract: noop,
        // Extend/contract element list to new total
        total: function (n) {
            if (this.showing < n) {
                return this.extendChildren(n);
            }
            return this;
        },
        // Increment total by n
        incrementTotal: function (n) {
            return this.total(this.showing + n);
        },
        // Increment show by n
        incrementShow: function (n) {
            return this.show(this.showing + n);
        },
        // Extend number of elements to n
        extendChildren: function (n) {
            var deficit = n - this.children.length;
            if (deficit > 0) {
                while (deficit--) {
                    var el = this.orig.cloneNode(this.deep);
                    this.parent.appendChild(el);
                }
            }
            return this;
        },
        // Expand/contract to n
        show: function (n) {
            while (this.showing > n) {
                this.showing--;
                this.hideEl(this.children[this.showing]);
                this.onContract();
            }
            while (this.showing < n) {
                this.showing++;
                this.showEl(this.children[this.showing - 1]);
                this.onExtend();
            }
            return this;
        }
    };
    function DomExtension(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        this.children = this.parent.children;
        if (this.children.length) {
            this.orig = this.children[0].cloneNode(this.deep);
            this.orig.style.display = 'none';
        }
        this.showing = this.children.length;
        return this;
    }
    DomExtension.prototype = proto;
    function noop() {
    }
    c.DomExtension = DomExtension;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*

		// USAGE:

		// Create a pool with an origin element
		var productPool = new c.DomPool({
			tagName: 'div',
			attributes: {
				class: 'prod inView',
				height: '100px',
				'data-somedata': 'true'
			},
			innerText: 'okay',
			innerHtml: '<span>inner DOM</span>'
		})
	
		// Request elements
		var prod = productPool.request(),
			prodLot = productPool.requestLot(9)


		// Release elements when no longer needed
		productPool.release(prod)
		productPool.releaseLot(prodLot)


	*/
    var proto = {
        tagName: 'div',
        attributes: {},
        deep: true,
        request: function () {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            return this.create();
        },
        requestLot: function (n) {
            var lot = [];
            while (n--) {
                lot.push(this.request());
            }
            return lot;
        },
        release: function (node) {
            this.pool.push(node);
            return this;
        },
        releaseLot: function (lot) {
            for (var i = lot.length; i--;) {
                this.release(lot.pop());
            }
        },
        create: function () {
            var el = this.origin.cloneNode(this.deep);
            console.log(el);
            return el;
        }
    };
    function DomPool(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        this.pool = [];
        this.origin = d.createElement(this.tagName);
        for (var i in this.attributes) {
            this.origin.setAttribute(i, this.attributes[i]);
        }
        if ('innerText' in this) {
            this.origin.innerText = this.innerText;
        } else if ('innerHTML' in this) {
            this.origin.innerHTML = this.innerHTML;
        }
        return this;
    }
    DomPool.prototype = proto;
    c.DomPool = DomPool;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    // Settings / prototype
    var proto = {
        active: false,
        classes: {
            hamburger: 'ham',
            activated: 'active',
            processed: 'hamProc'
        },
        onOpen: noop,
        onClose: noop,
        toggle: function (e) {
            e.preventDefault();
            if (this.active === false) {
                this.active = true;
                this.el.classList.add(this.classes.activated);
                this.onClose();
            } else {
                this.active = false;
                this.el.classList.remove(this.classes.activated);
                this.onOpen();
            }
        }
    };
    // Constructor
    function Hamburger(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        this.el.classList.add(this.classes.processed);
        this.el.addEventListener('click', this.toggle.bind(this));
        // If active
        if (this.el.classList.contains(this.classes.activated)) {
            this.active = true;
        }
        return this;
    }
    Hamburger.prototype = proto;
    // Finds all hamburger menu buttons
    function findHamburger() {
        var els = d.querySelectorAll('.' + proto.classes.hamburger);
        for (var i = els.length; i--;) {
            new Hamburger({ el: els[i] });
        }
    }
    function noop() {
    }
    c.Hamburger = Hamburger;
    c.findHamburger = findHamburger;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*
		USAGE:
		<div class="watchView"></div>

	*/
    var proto = {
        showProgress: false,
        // Save progress in data-viewprog
        ignoreClasses: [],
        classes: {
            inView: 'inView',
            outView: 'outView',
            watchView: 'watchView'
        },
        data: {
            viewData: 'view',
            viewProgData: 'viewprog'
        },
        threshold: 0.75,
        // How close to center element must be to be considered in the viewport
        onShow: noop,
        onHide: noop,
        inView: false,
        update: function () {
            if (this.inView === false) {
                var yDistance = viewportYDistance(this);
                if (Math.abs(yDistance) < this.threshold) {
                    if (this.showProgress) {
                        this.el.dataset.progress = yDistance;
                    }
                    return this.show();
                }
            } else {
                yDistance = viewportYDistance(this);
                if (Math.abs(yDistance) > this.threshold) {
                    if (this.showProgress) {
                        this.el.dataset.progress = 1;
                    }
                    return this.hide();
                }
                if (this.showProgress) {
                    this.el.dataset.progress = viewportYDistance(this) / this.threshold;
                }
            }
            return this;
        },
        show: function () {
            this.inView = true;
            this.el.classList.add('inView');
            this.el.classList.remove('outView');
            this.onShow();
            return this;
        },
        hide: function () {
            this.inView = false;
            this.el.classList.remove('inView');
            this.el.classList.add('outView');
            this.onHide();
            return this;
        }
    };
    var inViewEls = [], listenerActive = false, latestKnownScrollY = 0, ticking = false;
    function InView(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        // Set attributes from element
        if (this.el.dataset) {
            if (this.el.dataset.view) {
                this.threshold = Number(this.el.dataset.view);
            }
            if ('viewprog' in this.el.dataset) {
                this.showProgress = true;
            }
        }
        // Activate current state
        this.update();
        // Store for window event
        inViewEls.push(this);
        if (listenerActive === false) {
            createListener();
        }
        return this;
    }
    InView.prototype = proto;
    // Get elements already on page for inView
    function findInView() {
        var selector = [];
        for (var i in proto.classes) {
            selector.push('.' + proto.classes[i]);
        }
        for (i in proto.data) {
            selector.push('[data-' + proto.data[i] + ']');
        }
        var els = d.querySelectorAll(selector);
        for (i = els.length; i--;) {
            new InView(els[i]);
        }
    }
    // Checks if element is in viewport
    function viewportYDistance(obj) {
        var top = obj.el.offsetTop, height = obj.el.offsetHeight, wHeight = w.innerHeight;
        var elCenter = top + height / 2, wCenter = w.pageYOffset + w.innerHeight / 2;
        var distance = (elCenter - wCenter) / wHeight * 2;
        return distance;
    }
    // Make changes on scroll
    function update() {
        ticking = false;
        for (var i = inViewEls.length; i--;) {
            inViewEls[i].update();
        }
    }
    // Use requestAnimationFrame to update on scroll
    function requestTick() {
        if (ticking === false) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }
    function createListener() {
        listenerActive = true;
        ticking = false;
        requestTick();
        w.addEventListener('scroll', requestTick);
        w.addEventListener('resize', requestTick);
    }
    if (inViewEls.length) {
        createListener();
    }
    function noop() {
    }
    c.findInView = findInView;
    c.InView = InView;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*
		REQUIRES: domExtension.js

		USAGE:
		<div id="productList">
			<div class="product"></div>
			<div class="product"></div>
			<div class="product"></div>
			<div class="product"></div>
		</div>
		<div id="loader"></div>
		

		var list = new c.InfiniteScroll({
			parent: document.querySelector('#productList'),
			loader: document.querySelector('#loader'),
			increment: 4,
			onIncrement: function(done){
				// Changes increment number
				done(8)
			},
			onLoad: function(els, done){
				// Do stuff with els
				console.log('loading...')
				done()
			}
		})

	*/
    var proto = {
        increment: 8,
        onLoad: noop,
        threshold: 10,
        listenerActive: true,
        processing: false,
        // See if raf is ready to update
        requestTick: function () {
            if (this.processing === false) {
                requestAnimationFrame(this.update.bind(this));
            }
            this.processing = true;
        },
        // Update when refresh rate says we can
        update: function () {
            // See if loader is in view
            var winBottom = w.innerHeight + w.scrollY, docBottom = d.body.scrollHeight;
            var diff = docBottom - winBottom;
            // If in viewport
            if (diff <= this.threshold) {
                this.loader.style.visibility = 'visible';
                if (this.onIncrement) {
                    this.onIncrement(this.dynamicIncrement.bind(this));
                } else {
                    this.loaderShowing();
                }
            }    // If not in viewport
            else {
                this.processing = false;
            }
        },
        dynamicIncrement: function (increment) {
            this.increment = increment;
            this.loaderShowing();
        },
        // Send callback when at bottom of page
        loaderShowing: function () {
            this.extension.incrementTotal(this.increment);
            this.onLoad(this.extension.children, this.showConfirm.bind(this));
        },
        // After callback has ran
        showConfirm: function () {
            this.processing = false;
            this.extension.incrementShow(this.increment);
            this.loader.style.visibility = 'hidden';
        }
    };
    // Constructor
    function InfiniteScroll(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        this.extension = new c.DomExtension({ parent: this.parent });
        // requestAnimationFrame on scroll
        this.requestTick();
        w.addEventListener('scroll', this.requestTick.bind(this));
        w.addEventListener('resize', this.requestTick.bind(this));
        return this;
    }
    InfiniteScroll.prototype = proto;
    function noop(els, done) {
        done();
    }
    c.InfiniteScroll = InfiniteScroll;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    var options = {
        classes: {
            lazyProcessed: 'lazyProc',
            modal: 'modal'
        },
        data: { lazy: 'lazy' }
    };
    var lazyLoadEls = [], ticking = false;
    // Returns true if in viewport
    function checkYPosition(el) {
        var winBottom = w.innerHeight + w.scrollY, rect = el.getBoundingClientRect();
        return rect.top < winBottom;
    }
    // Check for any new elements
    function findLazyLoad() {
        var els = d.querySelectorAll('[data-' + options.data.lazy + ']:not(.' + options.classes.lazyProcessed + ')'), modalEls = d.querySelectorAll('.' + options.classes.modal + ' [data-' + options.data.lazy + ']');
        for (var i = els.length; i--;) {
            // Make sure it's not inside a modal
            var found = false;
            for (var ii = modalEls.length; ii--;) {
                if (modalEls[ii] == els[i]) {
                    found = true;
                    break;
                }
            }
            if (found === true) {
                continue;
            }
            els[i].classList.add(options.classes.lazyProcessed);
            lazyLoadEls.push(els[i]);
        }
    }
    function addLazyLoad(el) {
        el.classList.add(options.classes.lazyProcessed);
        lazyLoadEls.push(el);
    }
    // Make changes on scroll
    function update() {
        ticking = false;
        // Make change
        for (var i = lazyLoadEls.length; i--;) {
            if (checkYPosition(lazyLoadEls[i])) {
                lazyLoadEls[i].src = lazyLoadEls[i].dataset.lazy;
                lazyLoadEls.splice(i, 1);
            }
        }
    }
    // Use requestAnimationFrame to update on scroll
    function requestTick() {
        if (ticking === false) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }
    function createListener() {
        ticking = false;
        requestTick();
        w.addEventListener('scroll', requestTick);
        w.addEventListener('resize', requestTick);
    }
    if (lazyLoadEls.length) {
        createListener();
    }
    findLazyLoad();
    c.findLazyLoad = findLazyLoad;
    c.addLazyLoad = addLazyLoad;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*
		USAGE:

		// Jade
		button(data-modal="modalId")
		#modalId.modal.fixed
			.box
				.x
				.content This is a modal window.


		// Javascript
		c.findModals()

		// or

		var modal = new Modal({
			el: document.querySelector('#modalId'),
			bind: document.querySelectorAll('button')
		})



	*/
    var proto = {
        // Modal option defaults:
        animate: 'fade',
        // Animates open/close: (false | 'fade')
        confirmText: 'Okay',
        // Confirm button text
        denyText: 'Cancel',
        // Deny button text
        showOnCreate: false,
        // Set to true to instantly show the modal upon creation
        shorthandShowOnCreate: true,
        // Instantly shows modals created via shorthand
        xButton: true,
        // Creates an X close button
        confirmButton: false,
        // Creates a confirm button
        denyButton: false,
        // Creates a confirm button
        destroyOnClose: false,
        // Destroys element on close
        destroyDelay: 500,
        // Delay timer on destroy to wait for closing animation
        closeClasses: [
            // Classes that will trigger a close
            'modal',
            'x',
            'confirm',
            'deny'
        ],
        classes: {
            // Default classes for element rendering
            modal: 'modal',
            box: 'box',
            content: 'content',
            confirm: 'confirm',
            deny: 'deny',
            x: 'x',
            animate: 'animate',
            animateIn: 'animateIn',
            modalProcessed: 'modalProc',
            lazyProcessed: 'lazyProc'
        },
        data: { lazy: 'lazy' },
        lazyLoaded: false,
        destroy: function () {
            if (this.animate) {
                setTimeout(destroyEl, this.destroyDelay, this.el);
            } else {
                destroyEl(this.el);
            }
            delete modals[this.id];
        },
        changeContent: function (newHtml) {
            this.contentEl.innerHTML = newHtml;
            return this;
        },
        show: function () {
            if (this.showing) {
                return this;
            }
            this.showing = true;
            this.lazyLoad();
            if (this.animate === 'fade') {
                this.el.classList.add(this.classes.animateIn);
            } else {
                this.el.style.display = 'block';
            }
            this.onShow();
            return this;
        },
        hide: function () {
            if (!this.showing) {
                return this;
            }
            this.showing = false;
            this.lazyUnload();
            if (this.animate === 'fade') {
                this.el.classList.remove(this.classes.animateIn);
            } else {
                this.el.style.display = 'none';
            }
            this.onHide();
            if (this.destroyOnClose) {
                this.destroy();
            }
            return this;
        },
        toggle: function () {
            if (!this.showing) {
                return this.show();
            } else {
                return this.hide();
            }
        },
        lazyLoad: function () {
            if (this.lazyLoaded === false) {
                for (var i = this.lazyEls.length; i--;) {
                    this.lazyEls[i].src = this.lazyEls[i].dataset[this.data.lazy];
                }
                this.lazyLoaded = true;
            }
            for (i = this.lazyFrames.length; i--;) {
                this.lazyFrames[i].src = this.lazyFrames[i].dataset[this.data.lazy];
            }
        },
        lazyUnload: function () {
            for (var i = this.lazyFrames.length; i--;) {
                this.lazyFrames[i].src = '';
            }
        },
        onConfirm: noop,
        onDeny: noop,
        onShow: noop,
        onHide: noop
    };
    var modals = {};
    function Modal(obj) {
        var $this = this;
        this.showing = false;
        if (typeof obj !== 'object') {
            this.content = obj;
            if (this.shorthandShowOnCreate === true) {
                this.showOnCreate = true;
            }
        } else {
            for (var i in obj) {
                this[i] = obj[i];
            }
        }
        // If element doesn't exist in object
        if (!('el' in this)) {
            this.el = d.querySelector('#' + this.id);
            // If element doesn't exist on page
            if (!this.el) {
                this.el = d.createElement('div');
                this.el.classList.add(this.classes.modal);
                if (this.id) {
                    this.el.id = this.id;
                }
                // Create box
                this.boxEl = d.createElement('div');
                this.boxEl.className = this.classes.box;
                this.el.appendChild(this.boxEl);
                // Create X
                if (this.xButton) {
                    this.xButton = d.createElement('div');
                    this.xButton.className = this.classes.x;
                    this.boxEl.appendChild(this.xButton);
                }
                // Populate
                if (this.content) {
                    this.contentEl = d.createElement('div');
                    this.contentEl.className = this.classes.content;
                    this.contentEl.innerHTML = this.content;
                    this.boxEl.appendChild(this.contentEl);
                }
                // Create confirm & deny
                if (this.confirmButton || this.onConfirm !== noop || this.onDeny !== noop) {
                    if (typeof this.confirmButton === 'string') {
                        this.confirmText = this.confirmButton;
                    }
                    this.confirmButton = d.createElement('button');
                    this.confirmButton.className = this.classes.confirm;
                    this.confirmButton.innerText = this.confirmText;
                    this.boxEl.appendChild(this.confirmButton);
                }
                if (this.denyButton || this.onConfirm !== noop || this.onDeny !== noop) {
                    if (typeof this.denyButton === 'string') {
                        this.denyText = this.denyButton;
                    }
                    this.denyButton = d.createElement('button');
                    this.denyButton.className = this.classes.deny;
                    this.denyButton.innerText = this.denyText;
                    this.boxEl.appendChild(this.denyButton);
                }
                d.body.appendChild(this.el);
            }
        }    // If element already exists
        else {
            this.boxEl = this.el.querySelector(this.classes.box);
            if (this.el.id) {
                this.id = this.el.id;
            }
            if (this.el.dataset) {
                for (var i in Modal.prototype) {
                    var lower = i.toLowerCase();
                    if (lower in this.el.dataset) {
                        if (typeof Modal.prototype[i] !== 'string') {
                            this[i] = JSON.parse(this.el.dataset[lower]);
                        } else {
                            this[i] = this.el.dataset[lower];
                        }
                    }
                }
            }
        }
        // Add close/open animation
        if (this.animate === 'fade') {
            this.el.classList.add(this.classes.animate);
            this.el.style.display = 'block';
        }
        // Mark element as processed
        this.el.classList.add(this.classes.modalProcessed);
        this.el.addEventListener('click', function (e) {
            // Confirm/deny events
            if (e.target.classList.contains($this.classes.confirm)) {
                $this.onConfirm();
            } else if (e.target.classList.contains($this.classes.deny)) {
                $this.onDeny();
            }
            // If closing
            if ('close' in e.target.dataset) {
                return $this.hide();
            }
            for (var i = $this.closeClasses.length; i--;) {
                if (e.target.classList.contains($this.closeClasses[i])) {
                    return $this.hide();
                }
            }
        });
        // Lazy load elements
        this.lazyEls = this.el.querySelectorAll('[data-' + this.data.lazy + ']:not(iframe)');
        this.lazyFrames = this.el.querySelectorAll('iframe[data-' + this.data.lazy + ']');
        // If binding element was supplied
        if (this.bind) {
            this.bind.dataset.modal = this.id;
            bindModal(this.bind);
        }
        // Show if needed
        if (this.showOnCreate) {
            setTimeout(this.show.bind(this), 2);
        }
        if (this.id) {
            modals[this.id] = this;
        }
        return this;
    }
    Modal.prototype = proto;
    function destroyEl(el) {
        el.parentElement.removeChild(el);
    }
    // Initiate modals already in DOM
    function findModals() {
        // Find modal windows
        var els = d.querySelectorAll('.' + Modal.prototype.classes.modal + ':not(.' + Modal.prototype.classes.modalProcessed + ')');
        for (var i = els.length; i--;) {
            if (els[i].dataset.options) {
                var obj = JSON.parse(els[i].dataset.options);
            } else {
                obj = {};
            }
            obj.el = els[i];
            new Modal(obj);
        }
        // Find modal togglers
        els = d.querySelectorAll('[data-modal]:not(.' + Modal.prototype.classes.modalProcessed + ')');
        for (i = els.length; i--;) {
            bindModal(els[i]);
        }
    }
    function bindModal(el) {
        el.classList.add(Modal.prototype.classes.modalProcessed);
        el.addEventListener('click', showBind);
    }
    function showBind(e) {
        e.preventDefault();
        showModal(this.dataset.modal);
    }
    // Default event function
    function noop() {
    }
    // Exposed show/hide modal by id
    function showModal(id) {
        if (id in modals) {
            modals[id].show();
        }
    }
    function hideModal(id) {
        if (id in modals) {
            modals[id].hide();
        }
    }
    function toggleModal(id) {
        if (id in modals) {
            modals[id].toggle();
        }
    }
    function createModal(obj) {
        if (typeof obj !== 'string' && Modal.prototype.shorthandShowOnCreate === true) {
            obj.showOnCreate = true;
        }
        return new Modal(obj);
    }
    findModals();
    c.findModals = findModals;
    c.Modal = Modal;
    c.showModal = showModal;
    c.hideModal = hideModal;
    c.createModal = createModal;
    c.toggleModal = toggleModal;
    c.bindModal = bindModal;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*
		USAGE:

		nav
			#navToggle.hide-m Menu
			.ver.m-hor
				ul
					li
						a(href='#') Menu Item
					ul.drop
						li
							a(href='#') Sub Menu Item


		// Process all nav elements as navigation
		c.findNavigation()


		// Manually create nav
		var nav = new c.Navigation({
			parent: document.querySelector('nav')
		})


	*/
    // Navigation prototype/default options
    var proto = {
        jsHover: true,
        classes: {
            nav: 'nav',
            vertical: 'ver',
            open: 'open'
        },
        // Closes all dropdowns
        closeAll: function () {
            for (var i = this.mainLinks.length; i--;) {
                this.mainLinks[i].classList.remove(this.classes.open);
            }
        },
        // Open or close on hover if navigation hasn't changed to vertical
        hoverOpen: function (el) {
            var display = getComputedStyle(el).display;
            if (display !== 'block' && display !== 'list-item') {
                el.classList.add(this.classes.open);
            }
        },
        hoverClose: function (el) {
            var display = getComputedStyle(el).display;
            if (display !== 'block' && display !== 'list-item') {
                el.classList.remove(this.classes.open);
            }
        },
        // Click forward/back on vertical
        clickOpen: function (el, e) {
            var display = getComputedStyle(el).display;
            if (display === 'block') {
                e.preventDefault();
                el.classList.add(this.classes.open);
                this.adjustHeight(el.querySelector('ul'));
            }    // If accordion
            else if (display === 'list-item') {
                e.preventDefault();
                if (el.classList.contains(this.classes.open)) {
                    el.classList.remove(this.classes.open);
                } else {
                    this.closeAll();
                    el.classList.add(this.classes.open);
                }
            }
        },
        clickBack: function (el, e) {
            if (e.target.tagName === 'UL') {
                e.stopPropagation();
                var parent = el.parentElement;
                parent.classList.remove(this.classes.open);
                parent = parent.parentElement;
                if (parent.parentElement.classList.contains(this.classes.vertical)) {
                    this.parent.style.height = '100%';
                } else {
                    this.adjustHeight(parent);
                }
            }
        },
        // Adjust size after every vertical menu change
        adjustHeight: function (el) {
            this.parent.style.height = el.offsetHeight + 'px';
        }
    };
    // Navigation constructor
    function Navigation(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        // Back pseudo element click
        this.mainLinks = [];
        this.dropdowns = this.parent.querySelectorAll('ul ul');
        for (i = this.dropdowns.length; i--;) {
            this.dropdowns[i].addEventListener('click', this.clickBack.bind(this, this.dropdowns[i]));
            this.mainLinks.push(this.dropdowns[i].parentElement);
        }
        // Attach hover and click events
        for (var i = this.mainLinks.length; i--;) {
            if (this.jsHover) {
                this.mainLinks[i].addEventListener('mouseover', this.hoverOpen.bind(this, this.mainLinks[i]));
                this.mainLinks[i].addEventListener('mouseout', this.hoverClose.bind(this, this.mainLinks[i]));
            }
            this.mainLinks[i].addEventListener('click', this.clickOpen.bind(this, this.mainLinks[i]));
        }
        return this;
    }
    Navigation.prototype = proto;
    // Find each navigation on page
    function findNavigation() {
        var navs = d.querySelectorAll('.' + proto.classes.nav);
        for (var i = navs.length; i--;) {
            new Navigation({ parent: navs[i] });
        }
    }
    c.findNavigation = findNavigation;
    c.Navigation = Navigation;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    /*
		
		JADE:
		div(data-toggle="#hidden")
		// or
		div(data.toggleall=".hide")
		// are both targeting element:
		#hidden.hide

		JAVASCRIPT
		// Find all toggle elements
		c.findToggle()
		// or create manually
		var menuToggle = new Toggle({
			el: document.querySelector('#navToggle'),
			target: document.querySelector('#nav')
		})



	*/
    var proto = {
        toggleOn: 'click',
        toggleClass: 'show',
        classes: {
            toggled: 'toggled',
            processed: 'toggleProc'
        },
        data: {
            toggle: 'toggle',
            toggleAll: 'toggleall'
        },
        showing: false,
        onShow: noop,
        onHide: noop,
        toggle: function () {
            if (this.showing === false) {
                return this.show();
            }
            return this.hide();
        },
        show: function () {
            this.showing = true;
            this.el.classList.add(this.classes.toggled);
            if (this.target) {
                this.target.classList.add(this.toggleClass);
            } else if (this.targetAll) {
                for (var i = this.targetAll.length; i--;) {
                    this.targetAll[i].classList.add(this.toggleClass);
                }
            }
            this.onShow();
            return this;
        },
        hide: function () {
            this.showing = false;
            this.el.classList.remove(this.classes.toggled);
            if (this.target) {
                this.target.classList.remove(this.toggleClass);
            } else if (this.targetAll) {
                for (var i = this.targetAll.length; i--;) {
                    this.targetAll[i].classList.remove(this.toggleClass);
                }
            }
            this.onHide();
            return this;
        }
    };
    function Toggle(config) {
        for (var i in config) {
            this[i] = config[i];
        }
        // Mark as processed
        this.el.classList.add(this.classes.processed);
        // Change toggle class
        if (this.el.dataset.toggleclass) {
            this.toggleClass = this.el.dataset.toggleclass;
        }
        // Find target elements
        if (this.el.dataset.toggle) {
            this.target = d.querySelector(this.el.dataset.toggle);
            if (this.target.classList.contains(this.toggleClass)) {
                this.showing = true;
            }
        }
        if (this.el.dataset.toggleall) {
            this.targetAll = d.querySelectorAll(this.el.dataset.toggleAll);
            if (this.targetAll[0].classList.contains(this.toggleClass)) {
                this.showing = true;
            }
        }
        // Event handler
        this.el.addEventListener(this.toggleOn, this.toggle.bind(this));
        return this;
    }
    Toggle.prototype = proto;
    // Find all toggle elements in DOM
    function findToggle() {
        var els = d.querySelectorAll('[data-' + proto.data.toggle + ']:not(.' + proto.classes.processed + '), [data-' + proto.data.toggleAll + ']:not(.' + proto.classes.processed + ')');
        for (var i = els.length; i--;) {
            new Toggle({ el: els[i] });
        }
    }
    function noop() {
    }
    //findToggle()
    c.findToggle = findToggle;
    c.Toggle = Toggle;
}(document, window, c);
!function (d, w, c, u) {
    'use strict';
    var proto = {
        data: {
            validate: 'validate',
            processed: 'validateprocessed'
        }
    };
    // Get all forms that need validation
    function findValidate() {
        var els = d.querySelectorAll('[data-' + proto.data.validate + ']:not([data-' + proto.data.processed + '])');
    }
}(document, window, c);
//# sourceMappingURL=chisel.js.map
