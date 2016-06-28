!function(d, w, c, u){'use strict'

	var proto = {

	}

	
	function Toggle(config){
		for(var i in config){
			this[i] = config[i]
		}


		return this
	}
	Toggle.prototype = proto



	// Find all toggle elements in DOM
	function findToggle(){

	}



	c.findToggle = findToggle
	c.Toggle = Toggle

}(document, window, c)