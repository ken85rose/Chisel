!function(d, w, c, u){'use strict'

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
		request: function(){
			if(this.pool.length > 0){
				return this.pool.pop()
			}
			return this.create()
		},
		requestLot: function(n){
			var lot = []
			while(n--){
				lot.push(this.request())
			}
			return lot
		},
		release: function(node){
			this.pool.push(node)
			return this
		},
		releaseLot: function(lot){
			for(var i = lot.length; i--;){
				this.release(lot.pop())
			}
		},
		create: function(){
			var el = this.origin.cloneNode(this.deep)
			console.log(el)
			return el
		}
	}


	function DomPool(config){

		for(var i in config){
			this[i] = config[i]
		}

		this.pool = []
		this.origin = d.createElement(this.tagName)

		for(var i in this.attributes){
			this.origin.setAttribute(i, this.attributes[i])
		}
		if('innerText' in this){
			this.origin.innerText = this.innerText
		}
		else if('innerHTML' in this){
			this.origin.innerHTML = this.innerHTML
		}

		return this
	}
	DomPool.prototype = proto




	c.DomPool = DomPool

}(document, window, c)