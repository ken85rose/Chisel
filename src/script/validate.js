!function(d, w, c, u){'use strict'

	
	var proto = {
		data: {
			validate: 'validate',
			processed: 'validateprocessed'
		}
	}




	// Get all forms that need validation
	function findValidate(){
		var els = d.querySelectorAll('[data-' + proto.data.validate + ']:not([data-' + proto.data.processed + '])')
	}



}(document, window, c)