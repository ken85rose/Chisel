!function(w, d, c, u){'use strict'

	
	setTimeout(function(){


	
		var list = new c.InfiniteScroll({
			parent: document.querySelector('#productList'),
			loader: document.querySelector('#listEnd'),
			onIncrement: function(done){
				done(4)
			},
			onLoad: function(els, done){
				setTimeout(done, 600)
			}
		})



	}, 100)



}(window, document, c)

