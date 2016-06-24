!function(d, w, c, u){'use strict'

	
	var proto = {
		showOn: 'mouseover',
		hideOn: 'mouseout',
		elements: {
			nav: 'nav'
		}
	}



	function Navigation(config){
		for(var i in config){
			this[i] = config[i]
		}
		this.mainLinks = this.parent.children[0].querySelectorAll('ul:not(.dropdown) > li')
		console.log(this.mainLinks)
		for(var i = this.mainLinks.length; i--;){
			this.mainLinks[i].addEventListener(this.showOn, showDropdown)
			this.mainLinks[i].addEventListener(this.hideOn, hideDropdown)
		}
		return this
	}
	Navigation.prototype = proto




	function findNavigation(){
		var navs = d.querySelectorAll(proto.elements.nav)
		for(var i = navs.length; i--;){
			new Navigation({
				parent: navs[i]
			})
		}
	}

	function showDropdown(){
		this.classList.add('dropdownOpen')
	}
	function hideDropdown(){
		this.classList.remove('dropdownOpen')
	}



	// Get all forms that need validation
	function findValidate(){
		var els = d.querySelectorAll('[data-' + proto.data.validate + ']:not([data-' + proto.data.processed + '])')
	}


	findNavigation()
	c.findNavigation = findNavigation


}(document, window, c)