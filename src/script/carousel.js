!function(d, w, c, u){'use strict'

	var proto = {
		onSlide: 0,						// Starting slide
		auto: false,					// Whether or not the slides change on their own
		delay: 2000,					// Delay between slides
		stopAnimationOnClick: false,	// Stops animation on user interaction
		animation: false,				// Animation type (can also be set in markup)
		buttons: false,					// Creates buttons if they don't already exist
		arrows: false,					// Creates arrows if they don't already exist
		gallery: false,					// Image gallery behavior (can also be set in markup)
		ignoreClasses: [				// Classes that won't be treated like slides
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

		nextSlide: function(){
			var n = this.onSlide
			n++
			if(n >= this.total){
				n = 0
			}
			return this.goToSlide(n)
		},
		previousSlide: function(){
			var n = this.onSlide
			n--
			if(n < 0){
				n = this.total - 1
			}
			return this.goToSlide(n)
		},
		goToSlide: function(n){
			if(n === this.onSlide){
				return this
			}
			var prev = this.onSlide
			this.onSlide = n

			if(this.previous){
				this.previous.classList.remove(this.classes.last)
			}
			this.previous = this.slides[prev]
			this.slides[n].classList.add(this.classes.active)
			this.previous.classList.remove(this.classes.active)
			this.previous.classList.add(this.classes.last)

			// If gallery
			if(this.gallery && !this.galleryActivated[n]){
				this.galleryActivated[n] = true
				var el = this.slides[n].querySelector('[data-src]')
				if(el){
					el.src = el.dataset.src
				}
			}


			// Add active state to button if exists
			if(this.buttons){
				this.buttons[n].classList.add(this.classes.active)
				this.buttons[prev].classList.remove(this.classes.active)
			}

			return this
		},
		loop: function($this){
			$this.nextSlide()
			$this.timeout = setTimeout($this.loop, $this.delay, $this)
		},
		goToId: function(id){
			return this.goToSlide(this.slideIds[id])
		}

	}




	function Carousel(obj){

		var $this = this

		// Copy options
		if(obj.nodeType && obj.nodeType === 1){
			obj = {
				el: obj
			}
		}
		else{
			for(var i in obj){
				this[i] = obj[i]
			}
		}

		// Pull in options from data
		if(this.el.dataset){
			for(var i in Carousel.prototype){
				var lower = i.toLowerCase()
				if(lower in this.el.dataset){
					if(typeof Carousel.prototype[i] !== 'string'){
						this[i] = JSON.parse(this.el.dataset[lower])
					}
					else{
						this[i] = this.el.dataset[lower]
					}
				}
			}
		}


		// Add animation class
		if(this.animation === 'fade'){
			this.el.classList.add(this.classes.fade)
		}

		// Activate image gallery
		if(this.el.classList.contains(this.classes.gallery)){
			this.gallery = true
		}
		else if(this.gallery === true){
			this.el.classList.add(this.classes.gallery)
		}
		this.galleryActivated = []


		// Get all slide elements
		this.slides = []
		this.slideIds = {}
		var children = this.el.children
		for(i = 0; i < children.length; i++){
			var skip = false
			for(var ii = this.ignoreClasses.length; ii--;){
				if(children[i].classList.contains(this.ignoreClasses[ii])){
					skip = true
					break
				}
			}
			if(!skip){
				this.slides.push(children[i])
				this.slideIds[children[i].id] = i

				// Look for links to change slides
				var els = d.querySelectorAll('[data-carousel="' + children[i].id + '"]')
				for(var ii = 0; ii < els.length; ii++){
					els[ii].addEventListener('click', this.goToId.bind(this, children[i].id))
				}

			}
		}

		// Get total
		this.total = this.slides.length

		// Find active slide
		if(!this.onSlide){
			for(i = this.slides.length; i--;){
				if(this.slides[i].classList.contains(this.classes.active)){
					this.onSlide = i
				}
			}
		}

		// Find/create buttons
		var buttons = this.el.querySelectorAll('.' + this.classes.buttons + ' > *')
		if(!buttons.length){
			if(this.buttons){
				this.buttons = []
				buttons = d.createElement('div')
				buttons.style.opacity = 0
				buttons.className = this.classes.buttons
				for(i = 0; i < this.slides.length; i++){
					this.buttons[i] = d.createElement('a')
					this.buttons[i].dataset.carousel = this.slides[i].id

					buttons.appendChild(this.buttons[i])
				}
				this.el.appendChild(buttons)
				buttons.style.opacity = 1
				this.buttons[this.onSlide].classList.add(this.classes.active)
			}

		}
		else{
			this.buttons = buttons
			this.buttons[this.onSlide].classList.add(this.classes.active)
		}


		// Create arrows
		if(this.arrows === true){
			var el = d.createElement('div')
			el.className = this.classes.previous
			this.el.appendChild(el)
			el = d.createElement('div')
			el.className = this.classes.next
			this.el.appendChild(el)
		}


		// Configure controls
		this.el.addEventListener('click', function(e){

			var isControl = false

			// If previous or next
			if(e.target.classList.contains($this.classes.previous)){
				isControl = true
				$this.previousSlide()
			}
			else if(e.target.classList.contains($this.classes.next)){
				isControl = true
				$this.nextSlide()
			}

			if(isControl){
				if($this.auto){
					clearTimeout($this.timeout)
					if(!$this.stopAnimationOnClick){
						$this.timeout = setTimeout($this.loop, $this.delay, $this)
					}
				}
				e.preventDefault()
			}

		})


		// Start animation
		if(this.auto){
			clearTimeout(this.timeout)
			this.timeout = setTimeout(this.loop, this.delay, this)
		}


		return this


	}
	Carousel.prototype = proto



	// Initiate modals already in DOM
	var els = d.getElementsByClassName('carousel')
	for(var i = els.length; i--;){
		if(els[i].dataset.options){
			var obj = JSON.parse(els[i].dataset.options)
		}
		else{
			obj = {}
		}
		obj.el = els[i]

		new Carousel(obj)
	}




	c.Carousel = Carousel


}(document, window, c)