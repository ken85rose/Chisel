!function(d, w, c, u){'use strict'


	var options = {
		classes: {
			lazyProcessed: 'lazyProc',
			modal: 'modal'
		},
		data: {
			lazy: 'lazy'
		}
	}


	var lazyLoadEls = [],
		ticking = false




	// Returns true if in viewport
	function checkYPosition(el){
		var winBottom = w.innerHeight + w.scrollY,
			rect = el.getBoundingClientRect()

		return (rect.top < winBottom)
	}









	// Check for any new elements
	function findLazyLoad(){
		var els = d.querySelectorAll('[data-' + options.data.lazy + ']:not(.' + options.classes.lazyProcessed + ')'),
			modalEls = d.querySelectorAll('.' + options.classes.modal + ' [data-' + options.data.lazy + ']')

		for(var i = els.length; i--;){
			// Make sure it's not inside a modal
			var found = false
			for(var ii = modalEls.length; ii--;){
				if(modalEls[ii] == els[i]){
					found = true
					break
				}
			}
			if(found === true){
				continue
			}

			els[i].classList.add(options.classes.lazyProcessed)
			lazyLoadEls.push(els[i])
		}
	}
	function addLazyLoad(el){
		el.classList.add(options.classes.lazyProcessed)
		lazyLoadEls.push(el)
	}





	// Make changes on scroll
	function update(){
		ticking = false
		
		// Make change
		for(var i = lazyLoadEls.length; i--;){
			if(checkYPosition(lazyLoadEls[i])){
				lazyLoadEls[i].src = lazyLoadEls[i].dataset.lazy
				lazyLoadEls.splice(i, 1)
			}
		}


	}

	// Use requestAnimationFrame to update on scroll
	function requestTick() {
		if(ticking === false) {
			requestAnimationFrame(update)
		}
		ticking = true
	}
	function createListener(){
		ticking = false
		requestTick()
		w.addEventListener('scroll', requestTick)
		w.addEventListener('resize', requestTick)
	}
	if(lazyLoadEls.length){
		createListener()
	}

	findLazyLoad()
	c.findLazyLoad = findLazyLoad
	c.addLazyLoad = addLazyLoad


}(document, window, c)