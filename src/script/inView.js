!function(d, w, c, u){'use strict'

	/*
		USAGE:
		<div class="watchView"></div>

	*/

	var proto = {
		showProgress: false,			// Save progress in data-viewprog
		ignoreClasses: [				// Classes that won't be treated like inView elements
		],
		classes: {
			inView: 'inView',
			outView: 'outView',
			watchView: 'watchView'
		},
		data: {
			viewData: 'view',
			viewProgData: 'viewprog'
		},
		threshold: .75,					// How close to center element must be to be considered in the viewport
		onShow: noop,
		onHide: noop,
		inView: false,

		update: function(){

			if(this.inView === false){
				var yDistance = viewportYDistance(this)
				if(Math.abs(yDistance) < this.threshold){
					if(this.showProgress){
						this.el.dataset.progress = yDistance
					}
					return this.show()

				}

			}
			else{
				yDistance = viewportYDistance(this)
				if(Math.abs(yDistance) > this.threshold){
					if(this.showProgress){
						this.el.dataset.progress = 1
					}
					return this.hide()
				}
				if(this.showProgress){
					this.el.dataset.progress = viewportYDistance(this) / this.threshold
				}
			}


			return this
		},
		show: function(){
			this.inView = true
			this.el.classList.add('inView')
			this.el.classList.remove('outView')
			this.onShow()
			return this
		},
		hide: function(){
			this.inView = false
			this.el.classList.remove('inView')
			this.el.classList.add('outView')
			this.onHide()
			return this
		}
	}

	var inViewEls = [],
		listenerActive = false,
		latestKnownScrollY = 0,
		ticking = false





	function InView(config){

		for(var i in config){
			this[i] = config[i]
		}

		// Set attributes from element
		if(this.el.dataset){
			if(this.el.dataset.view){
				this.threshold = Number(this.el.dataset.view)
			}
			if('viewprog' in this.el.dataset){
				this.showProgress = true
			}
		}



		// Activate current state
		this.update()

		// Store for window event
		inViewEls.push(this)

		if(listenerActive === false){
			createListener()
		}


		return this
	}
	InView.prototype = proto



	// Get elements already on page for inView
	var selector = []
	for(var i in proto.classes){
		selector.push('.' + proto.classes[i])
	}
	for(i in proto.data){
		selector.push('[data-' + proto.data[i] + ']')
	}
	var els = d.querySelectorAll(selector)

	for(i = els.length; i--;){
		new InView(els[i])
	}


	// Checks if element is in viewport
	function viewportYDistance(obj){

		var top = obj.el.offsetTop,
			height = obj.el.offsetHeight,
			wHeight = w.innerHeight

		var elCenter = top + (height / 2),
			wCenter = w.pageYOffset + (w.innerHeight / 2)

		var distance = ((elCenter - wCenter) / wHeight) * 2



		return distance
	}



	// Make changes on scroll
	function update(){
		ticking = false
		
		for(var i = inViewEls.length; i--;){
			inViewEls[i].update()
		}


	}



	// Use requestAnimationFrame to update on scroll
	function requestTick() {
		if(ticking === false) {
			requestAnimationFrame(update)
		}
		ticking = true
	}
	function createListener(){
		listenerActive = true
		ticking = false
		requestTick()
		w.addEventListener('scroll', requestTick)
	}
	if(inViewEls.length){
		createListener()
	}

	function noop(){}

	c.InView = InView


}(document, window, c)