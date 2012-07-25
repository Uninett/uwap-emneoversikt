define([
  'lib/text!templates/chosen_template.html'    
], function(chosen_template){
  // Above we have passed in dependencies
  // They will not be accesible in the global scope
  
  // What we return here will be used by other modules

	ChosenCoursesView = Backbone.View.extend({
		initialize: function(){
	        //this.render();
	    },
	    render: function(){
	        // Compile the template using underscore
	        var template = _.template( chosen_template, { course: selectedCourses.toJSON()} );
	        // Load the compiled HTML into the Backbone "el"
	        this.$el.html( template );
	    }
	});

	return ChosenCoursesView;
});