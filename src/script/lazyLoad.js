!function(d, w, c, u){'use strict'


	var options = {
		classes: {
			lazyProcessed: 'lazyProc'
		},
		data: {
			lazy: 'lazy'
		}
	}


	var lazyLoadEls = [],
		ticking = false




	// Returns true if in viewport
	function checkYPosition(el){
		var winBottom = w.innerHeight + w.scrollY
		var rect = el.getBoundingClientRect()

		return (rect.top < winBottom)
	}






	// Get elements already on page for lazyLoad
	var selector = []
	for(var i in options.data){
		selector.push('[data-' + options.data[i] + ']:not(.' + options.classes.lazyProcessed + ')')
	}
	selector = selector.join(', ')



	// Check for any new elements
	function findLazyLoad(){
		var els = d.querySelectorAll(selector)
		for(var i = els.length; i--;){
			els[i].classList.add(options.classes.lazyProcessed)
			lazyLoadEls.push(els[i])
		}
	}
	function addLazyLoad(el){
		el.classList.add(options.classes.lazyProcessed)
		lazyLoadEls.push(el)
	}
	findLazyLoad()





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


	c.findLazyLoad = findLazyLoad
	c.addLazyLoad = addLazyLoad


}(document, window, c)