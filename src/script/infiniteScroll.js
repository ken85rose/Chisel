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
		increment: 8,
		onLoad: noop,
		threshold: 10,

		listenerActive: true,
		processing: false,

		// Contract DomExtension
		// Note: set this.processing back to false when done
		contract: function(n){
			this.processing = true
			this.extension.show(n ? n : 0)
		},

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
				if(this.onIncrement){
					this.onIncrement(this.dynamicIncrement.bind(this))
				}
				else{
					this.loaderShowing()
				}
			}
			// If not in viewport
			else{
				this.processing = false
			}

		},
		dynamicIncrement: function(increment){
			this.increment = increment
			this.loaderShowing()
		},
		// Send callback when at bottom of page
		loaderShowing: function(){
			this.extension.incrementTotal(this.increment)
			this.onLoad(this.extension.children, this.showConfirm.bind(this))
		},
		// After callback has ran
		showConfirm: function(){
			this.processing = false
			this.extension.show(this.extension.showing + this.increment)
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