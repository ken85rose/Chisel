!function(d, w, c, u){'use strict'
	/*
		USAGE:

		// Jade
		button(data-modal="modalId")
		#modalId.modal.fixed
			.box
				.x
				.content This is a modal window.


		// Javascript
		c.findModals()

		// or

		var modal = new Modal({
			el: document.querySelector('#modalId'),
			bind: document.querySelectorAll('button')
		})



	*/

	var proto = {
		// Modal option defaults:
		animate: 'fade',				// Animates open/close: (false | 'fade')
		confirmText: 'Okay',			// Confirm button text
		denyText: 'Cancel',				// Deny button text
		showOnCreate: false,			// Set to true to instantly show the modal upon creation
		shorthandShowOnCreate: true,	// Instantly shows modals created via shorthand
		xButton: true,					// Creates an X close button
		confirmButton: false,			// Creates a confirm button
		denyButton: false,				// Creates a confirm button
		destroyOnClose: false,			// Destroys element on close
		destroyDelay: 500,				// Delay timer on destroy to wait for closing animation
		closeClasses: [					// Classes that will trigger a close
			'modal',
			'x',
			'confirm',
			'deny'
		],
		classes: {						// Default classes for element rendering
			modal: 'modal',
			box: 'box',
			content: 'content',
			confirm: 'confirm',
			deny: 'deny',
			x: 'x',
			animate: 'animate',
			animateIn: 'animateIn',
			modalProcessed: 'modalProc',
			lazyProcessed: 'lazyProc'
		},
		data: {
			lazy: 'lazy'
		},
		lazyLoaded: false,

		destroy: function(){

			if(this.animate){
				setTimeout(destroyEl, this.destroyDelay, this.el)
			}
			else{
				destroyEl(this.el)
			}
			delete modals[this.id]
		},
		changeContent: function(newHtml){
			this.contentEl.innerHTML = newHtml
			return this
		},
		show: function(){
			if(this.showing){
				return this
			}
			this.showing = true
			this.lazyLoad()
			if(this.animate === 'fade'){
				this.el.classList.add(this.classes.animateIn)
			}
			else{
				this.el.style.display = 'block'
			}
			this.onShow()
			return this
		},
		hide: function(){
			if(!this.showing){
				return this
			}
			this.showing = false
			this.lazyUnload()
			if(this.animate === 'fade'){
				this.el.classList.remove(this.classes.animateIn)
			}
			else{
				this.el.style.display = 'none'
			}
			this.onHide()
			if(this.destroyOnClose){
				this.destroy()
			}
			return this
		},
		toggle: function(){
			if(!this.showing){
				return this.show()
			}
			else{
				return this.hide()
			}
		},
		lazyLoad: function(){
			if(this.lazyLoaded === false){
				for(var i = this.lazyEls.length; i--;){
					this.lazyEls[i].src = this.lazyEls[i].dataset[this.data.lazy]
				}
				this.lazyLoaded = true
			}
			for(i = this.lazyFrames.length; i--;){
				this.lazyFrames[i].src = this.lazyFrames[i].dataset[this.data.lazy]
			}
		},
		lazyUnload: function(){
			for(var i = this.lazyFrames.length; i--;){
				this.lazyFrames[i].src = ''
			}
		},

		onConfirm: noop,
		onDeny: noop,
		onShow: noop,
		onHide: noop
	}



	var modals = {}

	function Modal(obj){

		var $this = this

		this.showing = false

		if(typeof obj !== 'object'){
			this.content = obj
			if(this.shorthandShowOnCreate === true){
				this.showOnCreate = true
			}
		}
		else{
			for(var i in obj){
				this[i] = obj[i]
			}
		}


		// If element doesn't exist in object
		if(!('el' in this)){

			this.el = d.querySelector('#' + this.id)

			// If element doesn't exist on page
			if(!this.el){
				this.el = d.createElement('div')
				this.el.classList.add(this.classes.modal)
				if(this.id){
					this.el.id = this.id
				}

				// Create box
				this.boxEl = d.createElement('div')
				this.boxEl.className = this.classes.box
				this.el.appendChild(this.boxEl)

				// Create X
				if(this.xButton){
					this.xButton = d.createElement('div')
					this.xButton.className = this.classes.x
					this.boxEl.appendChild(this.xButton)
				}

				// Populate
				if(this.content){
					this.contentEl = d.createElement('div')
					this.contentEl.className = this.classes.content
					this.contentEl.innerHTML = this.content
					this.boxEl.appendChild(this.contentEl)
				}

				// Create confirm & deny
				if(this.confirmButton || this.onConfirm !== noop || this.onDeny !== noop){
					if(typeof this.confirmButton === 'string'){
						this.confirmText = this.confirmButton
					}
					this.confirmButton = d.createElement('button')
					this.confirmButton.className = this.classes.confirm
					this.confirmButton.innerText = this.confirmText
					this.boxEl.appendChild(this.confirmButton)
				}
				if(this.denyButton || this.onConfirm !== noop || this.onDeny !== noop){
					if(typeof this.denyButton === 'string'){
						this.denyText = this.denyButton
					}
					this.denyButton = d.createElement('button')
					this.denyButton.className = this.classes.deny
					this.denyButton.innerText = this.denyText
					this.boxEl.appendChild(this.denyButton)
				}

				d.body.appendChild(this.el)
			}
		}

		// If element already exists
		else{
			this.boxEl = this.el.querySelector(this.classes.box)
			if(this.el.id){
				this.id = this.el.id
			}
			if(this.el.dataset){
				for(var i in Modal.prototype){

					var lower = i.toLowerCase()
					if(lower in this.el.dataset){

						if(typeof Modal.prototype[i] !== 'string'){
							this[i] = JSON.parse(this.el.dataset[lower])
						}
						else{
							this[i] = this.el.dataset[lower]
						}
					}



				}
			}
		}



		// Add close/open animation
		if(this.animate === 'fade'){
			this.el.classList.add(this.classes.animate)
			this.el.style.display = 'block'
		}

		// Mark element as processed
		this.el.classList.add(this.classes.modalProcessed)


		this.el.addEventListener('click', function(e){

			// Confirm/deny events
			if(e.target.classList.contains($this.classes.confirm)){
				$this.onConfirm()
			}
			else if(e.target.classList.contains($this.classes.deny)){
				$this.onDeny()
			}

			// If closing
			if('close' in e.target.dataset){
				return $this.hide()
			}
			for(var i = $this.closeClasses.length; i--;){
				if(e.target.classList.contains($this.closeClasses[i])){
					return $this.hide()
				}
			}
		})


		// Lazy load elements
		this.lazyEls = this.el.querySelectorAll('[data-' + this.data.lazy + ']:not(iframe)')
		this.lazyFrames = this.el.querySelectorAll('iframe[data-' + this.data.lazy + ']')


		// If binding element was supplied
		if(this.bind){
			this.bind.dataset.modal = this.id
			bindModal(this.bind)
		}


		// Show if needed
		if(this.showOnCreate){
			setTimeout(this.show.bind(this), 2)
		}

		if(this.id){
			modals[this.id] = this
		}

		return this

	}
	Modal.prototype = proto

	function destroyEl(el){
		el.parentElement.removeChild(el)
	}


	// Initiate modals already in DOM
	function findModals(){

		// Find modal windows
		var els = d.querySelectorAll('.' + Modal.prototype.classes.modal + ':not(.' + Modal.prototype.classes.modalProcessed + ')')
		for(var i = els.length; i--;){
			if(els[i].dataset.options){
				var obj = JSON.parse(els[i].dataset.options)
			}
			else{
				obj = {}
			}
			obj.el = els[i]
			new Modal(obj)
		}

		// Find modal togglers
		els = d.querySelectorAll('[data-modal]:not(.' + Modal.prototype.classes.modalProcessed + ')')
		for(i = els.length; i--;){
			bindModal(els[i])
		}

	}

	function bindModal(el){
		el.classList.add(Modal.prototype.classes.modalProcessed)
		el.addEventListener('click', showBind)
	}
	function showBind(e){
		e.preventDefault()
		showModal(this.dataset.modal)
	}

	// Default event function
	function noop(){}

	// Exposed show/hide modal by id
	function showModal(id){
		if(id in modals){
			modals[id].show()
		}
	}
	function hideModal(id){
		if(id in modals){
			modals[id].hide()
		}
	}
	function toggleModal(id){
		if(id in modals){
			modals[id].toggle()
		}
	}


	function createModal(obj){
		if(typeof obj !== 'string' && Modal.prototype.shorthandShowOnCreate === true){
			obj.showOnCreate = true
		}
		return new Modal(obj)
	}


	findModals()
	c.findModals = findModals
	c.Modal = Modal
	c.showModal = showModal
	c.hideModal = hideModal
	c.createModal = createModal
	c.toggleModal = toggleModal
	c.bindModal = bindModal

}(document, window, c)