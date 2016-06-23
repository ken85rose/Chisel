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


		// TIPS:
		// For infinite scrolling, use an inView element at the bottom of your list


	*/

	var proto = {
		deep: true,
		showEl: function(el){
			el.style.display = 'block'
		},
		hideEl: function(el){
			el.style.display = 'none'
		},

		// Extend/contract element list to new total
		total: function(n){
			if(this.showing < n){
				return this.extendChildren(n)
			}
			return this
		},

		// Extend number of elements to n
		extendChildren: function(n){

			var deficit = n - this.children.length
			if(deficit > 0){
				while(deficit--){
					var el = this.children[0].cloneNode(this.deep)
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
			}
			while(this.showing < n){
				this.showing++
				this.showEl(this.children[this.showing - 1])
			}

			return this
		},


	}


	function DomExtension(config){

		for(var i in config){
			this[i] = config[i]
		}

		this.children = this.parent.childNodes
		this.showing = this.children.length
		

		return this
	}
	DomExtension.prototype = proto




	c.DomExtension = DomExtension

}(document, window, c)