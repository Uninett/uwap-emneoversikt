define([
  'lib/text!templates/courses_template.html'    
], function(courses_template){
  // Above we have passed in dependencies
  // They will not be accesible in the global scope
  
  // What we return here will be used by other modules

	ListCoursesView = Backbone.View.extend({
	    initialize: function(){
//	        this.render();
	    },
	    render: function(courses){
	        // Compile the template using underscore
	        var template = _.template( courses_template, { course: courses.toJSON()} );
	        // Load the compiled HTML into the Backbone "el"
	        this.$el.html( template );
	    }
	});


	return ListCoursesView;
});