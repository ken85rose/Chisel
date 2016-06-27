!function(d, w, c, u){'use strict'

	/*
		- Integrate with menu button
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


		// Click forward/back on vertical
		clickOpen: function(el, e){
			if(getComputedStyle(el).display === 'block'){
				e.preventDefault()
				el.classList.add(this.classes.open)
				this.adjustHeight(el.querySelector('.' + this.classes.dropdown))
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
				this.mainLinks[i].addEventListener('mouseover', hoverOpen)
				this.mainLinks[i].addEventListener('mouseout', hoverClose)
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




	// Open or close on hover if navigation hasn't changed to vertical
	function hoverOpen(){
		if(getComputedStyle(this).display !== 'block'){
			this.classList.add(proto.classes.open)
		}
	}
	function hoverClose(){
		if(getComputedStyle(this).display !== 'block'){
			this.classList.remove(proto.classes.open)
		}
	}








	findNavigation()
	c.findNavigation = findNavigation
	c.Navigation = Navigation

}(document, window, c)