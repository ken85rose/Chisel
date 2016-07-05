!function(d, w, c, u){'use strict'
	/*
		
		JADE:
		div(data-toggle="#hidden")
		// or
		div(data.toggleall=".hide")
		// are both targeting element:
		#hidden.hide

		JAVASCRIPT
		// Find all toggle elements
		c.findToggle()
		// or create manually
		var menuToggle = new Toggle({
			el: document.querySelector('#navToggle'),
			target: document.querySelector('#nav')
		})



	*/

	var proto = {
		toggleOn: 'click',
		toggleClass: 'show',
		classes: {
			toggled: 'toggled',
			processed: 'toggleProc'
		},
		data: {
			toggle: 'toggle',
			toggleAll: 'toggleall'
		},

		showing: false,

		onShow: noop,
		onHide: noop,
		toggle: function(){
			if(this.showing === false){
				return this.show()
			}
			return this.hide()
		},
		show: function(){
			this.showing = true
			this.el.classList.add(this.classes.toggled)
			if(this.target){
				this.target.classList.add(this.toggleClass)
			}
			else if(this.targetAll){
				for(var i = this.targetAll.length; i--;){
					this.targetAll[i].classList.add(this.toggleClass)
				}
			}
			this.onShow()
			return this
		},
		hide: function(){
			this.showing = false
			this.el.classList.remove(this.classes.toggled)
			if(this.target){
				this.target.classList.remove(this.toggleClass)
			}
			else if(this.targetAll){
				for(var i = this.targetAll.length; i--;){
					this.targetAll[i].classList.remove(this.toggleClass)
				}
			}
			this.onHide()
			return this
		}
	}

	
	function Toggle(config){
		for(var i in config){
			this[i] = config[i]
		}

		// Mark as processed
		this.el.classList.add(this.classes.processed)

		// Change toggle class
		if(this.el.dataset.toggleclass){
			this.toggleClass = this.el.dataset.toggleclass
		}

		// Find target elements
		if(this.el.dataset.toggle){
			this.target = d.querySelector(this.el.dataset.toggle)
			if(this.target.classList.contains(this.toggleClass)){
				this.showing = true
			}
		}
		if(this.el.dataset.toggleall){
			this.targetAll = d.querySelectorAll(this.el.dataset.toggleAll)
			if(this.targetAll[0].classList.contains(this.toggleClass)){
				this.showing = true
			}
		}

		// Event handler
		this.el.addEventListener(this.toggleOn, this.toggle.bind(this))

		return this
	}
	Toggle.prototype = proto



	// Find all toggle elements in DOM
	function findToggle(){
		var els = d.querySelectorAll('[data-' + proto.data.toggle + ']:not(.' + proto.classes.processed + '), [data-' + proto.data.toggleAll + ']:not(.' + proto.classes.processed + ')')
		for(var i = els.length; i--;){
			new Toggle({
				el: els[i]
			})
		}
	}


	function noop(){}


	//findToggle()
	c.findToggle = findToggle
	c.Toggle = Toggle

}(document, window, c)