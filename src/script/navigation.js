!function(d, w, c, u){'use strict'
	/*
		USAGE:

		nav.ver.m-hor
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
		elements: {
			nav: 'nav'
		},
		classes: {
			vertical: 'ver',
			open: 'open',
			dropdown: 'drop'
		},


		// Closes all dropdowns
		closeAll: function(){
			for(var i = this.mainLinks.length; i--;){
				this.mainLinks[i].classList.remove(this.classes.open)
			}
		},



		// Open or close on hover if navigation hasn't changed to vertical
		hoverOpen: function(el){
			var display = getComputedStyle(el).display
			if(display !== 'block' && display !== 'list-item'){
				el.classList.add(this.classes.open)
			}
		},
		hoverClose: function(el){
			var display = getComputedStyle(el).display
			if(display !== 'block' && display !== 'list-item'){
				el.classList.remove(this.classes.open)
			}
		},




		// Click forward/back on vertical
		clickOpen: function(el, e){
			var display = getComputedStyle(el).display
			if(display === 'block'){
				e.preventDefault()
				el.classList.add(this.classes.open)
				this.adjustHeight(el.querySelector('.' + this.classes.dropdown))
			}
			// If accordion
			else if(display === 'list-item'){
				e.preventDefault()
				if(el.classList.contains(this.classes.open)){
					el.classList.remove(this.classes.open)
				}
				else{
					this.closeAll()
					el.classList.add(this.classes.open)
				}
			}
		},
		clickBack: function(el, e){
			if(e.target.tagName === 'UL'){
				e.stopPropagation()

				var parent = el.parentElement
				parent.classList.remove(this.classes.open)

				parent = parent.parentElement
				if(parent.parentElement.classList.contains(this.classes.vertical)){
					this.parent.style.height = '100%'
				}
				else{
					this.adjustHeight(parent)
				}
			}
		},




		// Adjust size after every vertical menu change
		adjustHeight: function(el){
			this.parent.style.height = el.offsetHeight + 'px'
		}
	}







	// Navigation constructor
	function Navigation(config){
		for(var i in config){
			this[i] = config[i]
		}


		// Back pseudo element click
		this.mainLinks = []
		this.dropdowns = this.parent.querySelectorAll('.' + this.classes.dropdown)
		for(i = this.dropdowns.length; i--;){
			this.dropdowns[i].addEventListener('click', this.clickBack.bind(this, this.dropdowns[i]))
			this.mainLinks.push(this.dropdowns[i].parentElement)
		}


		// Attach hover and click events
		for(var i = this.mainLinks.length; i--;){
			if(this.jsHover){
				this.mainLinks[i].addEventListener('mouseover', this.hoverOpen.bind(this, this.mainLinks[i]))
				this.mainLinks[i].addEventListener('mouseout', this.hoverClose.bind(this, this.mainLinks[i]))
			}
			this.mainLinks[i].addEventListener('click', this.clickOpen.bind(this, this.mainLinks[i]))
		}




		return this
	}
	Navigation.prototype = proto







	// Find each navigation on page
	function findNavigation(){
		var navs = d.querySelectorAll(proto.elements.nav)
		for(var i = navs.length; i--;){
			new Navigation({
				parent: navs[i]
			})
		}
	}





	//findNavigation()
	c.findNavigation = findNavigation
	c.Navigation = Navigation

}(document, window, c)