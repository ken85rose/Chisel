!function(d, w, c, u){'use strict'
	/*
	- Dataset for how close element is to center
	*/



	var proto = {
		showProgress: false,			// Save progress in data-viewprog
		ignoreClasses: [				// Classes that won't be treated like inView elements
		],
		classes: {
			inView: 'inView',
			outView: 'outView',
			watchView: 'watchView',
			viewData: 'view',
			viewProgData: 'viewprog'
		},
		threshold: .75,					// How close to center element must be to be considered in the viewport

		checkPositionY: function(){

			if(this.inView === false){
				if(inViewportY(this)){
					return this.show()
				}
			}
			else if(!inViewportY(this)){
				return this.hide()
			}

			return this
		},
		show: function(){
			this.inView = true
			this.el.classList.add('inView')
			this.el.classList.remove('outView')
			return this
		},
		hide: function(){
			this.inView = false
			this.el.classList.remove('inView')
			this.el.classList.add('outView')
			return this
		}
	}

	var inViewEls = [],
		listenerActive = false,
		latestKnownScrollY = 0,
		ticking = false





	function InView(el){

		this.el = el

		// Set attributes from element
		if(el.dataset && el.dataset.view){
			this.threshold = Number(el.dataset.view)
		}
		if(this.el.dataset.viewprog){
			this.showProgress = true
		}



		// Activate current state
		if(inViewportY(this)){
			this.show()
		}
		else{
			this.hide()
		}

		// Store for window event
		inViewEls.push(this)


		return this
	}
	InView.prototype = proto



	// Get elements already on page for inView
	var els = d.querySelectorAll('.' + proto.classes.inView + ', .' + proto.classes.outView + ', .' + proto.classes.watchView + ', [data-' + proto.classes.viewData + '], [data-' + proto.classes.viewProgData + ']')

	for(var i = els.length; i--;){
		new InView(els[i])
	}


	// Checks if element is in viewport
	function inViewportY(obj){
		var top = obj.el.offsetTop,
			height = obj.el.offsetHeight,
			wHeight = w.innerHeight

		var elCenter = top + (height / 2),
			wCenter = w.pageYOffset + (w.innerHeight / 2)

		var distance = ((elCenter - wCenter) / wHeight) * 2,
			absDistance = Math.abs(distance)

		return (absDistance < obj.threshold)
	}



	// Make changes on scroll
	function update(){
		ticking = false
		
		for(var i = inViewEls.length; i--;){
			inViewEls[i].checkPositionY()
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


}(document, window, c)