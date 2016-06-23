!function(d, w, c, u){'use strict'

	/*
		REQUIRES: inView.js

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
			maxLoad: 4,
			onLoad: function(els, done){
				// Do stuff with els
				console.log('loading...')
				done()
			}
		})

	*/


	var proto = {
		maxLoad: 4,
		onLoad: noop,
		threshold: 20,

		listenerActive: true,
		processing: false,

		// See if raf is ready to update
		requestTick: function(){
			if(this.processing === false) {
				requestAnimationFrame(this.update.bind(this))
			}
			this.processing = true
		},
		// Update when refresh rate says we can
		update: function(){

			// See if loader is in view
			var winBottom = w.innerHeight + w.scrollY,
				docBottom = d.body.scrollHeight


			var diff = docBottom - winBottom

			// If in viewport
			if(diff <= this.threshold){
				console.log('in viewport')
				this.loaderShowing()
			}
			// If not in viewport
			else{
				this.processing = false
			}

		},
		// Send callback when at bottom of page
		loaderShowing: function(){
			this.extension.total(this.extension.showing + this.maxLoad)
			this.onLoad(this.extension.children, this.showConfirm.bind(this))
		},
		// After callback has ran
		showConfirm: function(){
			this.processing = false
			this.extension.show(this.extension.showing + this.maxLoad)
		}
	}


	// Constructor
	function InfiniteScroll(config){

		for(var i in config){
			this[i] = config[i]
		}
		this.extension = new c.DomExtension({
			parent: this.parent
		})

		// requestAnimationFrame on scroll
		this.requestTick()
		w.addEventListener('scroll', this.requestTick.bind(this))

		return this
	}
	InfiniteScroll.prototype = proto


	function noop(els, done){done()}


	c.InfiniteScroll = InfiniteScroll

}(document, window, c)