!function(d, w, c, u){'use strict'

	// Settings / prototype
	var proto = {
		active: false,
		classes: {
			hamburger: 'ham',
			activated: 'active',
			processed: 'hamProc'
		},
		onOpen: noop,
		onClose: noop,
		toggle: function(e){
			e.preventDefault()
			if(this.active === false){
				this.active = true
				this.el.classList.add(this.classes.activated)
				this.onClose()
			}
			else{
				this.active = false
				this.el.classList.remove(this.classes.activated)
				this.onOpen()
			}
		}
	}





	// Constructor
	function Hamburger(config){
		for(var i in config){
			this[i] = config[i]
		}

		this.el.classList.add(this.classes.processed)
		this.el.addEventListener('click', this.toggle.bind(this))

		// If active
		if(this.el.classList.contains(this.classes.activated)){
			this.active = true
		}

		return this
	}
	Hamburger.prototype = proto





	// Finds all hamburger menu buttons
	function findHamburger(){
		var els = d.querySelectorAll('.' + proto.classes.hamburger)
		for(var i = els.length; i--;){
			new Hamburger({
				el: els[i]
			})
		}
	}


	function noop(){}


	c.Hamburger = Hamburger
	c.findHamburger = findHamburger

}(document, window, c)