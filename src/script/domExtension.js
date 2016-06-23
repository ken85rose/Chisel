!function(d, w, c, u){'use strict'

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
		showEl: function(el){
			el.style.display = 'block'
		},
		hideEl: function(el){
			el.style.display = 'none'
		},
		onExtend: noop,
		onContract: noop,

		// Extend/contract element list to new total
		total: function(n){
			if(this.showing < n){
				return this.extendChildren(n)
			}
			return this
		},

		// Increment total by n
		incrementTotal: function(n){
			return this.total(this.showing + n)
		},

		// Increment show by n
		incrementShow: function(n){
			return this.show(this.showing + n)
		},


		// Extend number of elements to n
		extendChildren: function(n){

			var deficit = n - this.children.length
			if(deficit > 0){
				while(deficit--){
					var el = this.orig.cloneNode(this.deep)
					this.parent.appendChild(el)
				}
			}

			return this
		},

		// Expand/contract to n
		show: function(n){

			while(this.showing > n){
				this.showing--
				this.hideEl(this.children[this.showing - 1])
				this.onContract()
			}
			while(this.showing < n){
				this.showing++
				this.showEl(this.children[this.showing - 1])
				this.onExtend()
			}

			return this
		},


	}


	function DomExtension(config){

		for(var i in config){
			this[i] = config[i]
		}

		this.children = this.parent.childNodes
		if(this.children.length){
			this.orig = this.children[0].cloneNode(this.deep)
			this.orig.style.display = 'none'
		}
		this.showing = this.children.length
		

		return this
	}
	DomExtension.prototype = proto


	function noop(){}

	c.DomExtension = DomExtension

}(document, window, c)