define([
  'lib/text!templates/details_template.html'    
], function(details){
  // Above we have passed in dependencies
  // They will not be accesible in the global scope
  
  // What we return here will be used by other modules

	CourseDetailsView = Backbone.View.extend({
		initialize: function(){
			
	        this.render();
	    },
	    render: function(){
	    	console.log('render detail for: '+detailsCourse.get('code'));
	        // Compile the template using underscore
	        var template = _.template( details,  detailsCourse.toJSON()  );
	        // Load the compiled HTML into the Backbone "el"
	        this.$el.html( template );
	    },
	    el : $('#out')
	});
	return CourseDetailsView;
});