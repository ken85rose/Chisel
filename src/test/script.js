!function(w, d, c, u){'use strict'


	new c.InfiniteScroll({
		parent: document.querySelector('#productList'),
		loader: document.querySelector('#listEnd'),
		onLoad: function(els, done){
			setTimeout(done, 600)
		}
	})


	c.findNavigation()
	c.findToggle()
	c.findHamburger()

	FastClick.attach(d.body)
}(window, document, c)

