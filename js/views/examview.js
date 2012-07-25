define([
  'lib/text!templates/exam_template.html'    
], function(exam_template){
  // Above we have passed in dependencies
  // They will not be accesible in the global scope
  
  // What we return here will be used by other modules

	ExamView = Backbone.View.extend({
	    initialize: function(){
//	        this.render();
	    },
	    render: function(){
	        // Compile the template using underscore
	        var template = _.template( exam_template, { course: selDetail.toJSON()} );
	        // Load the compiled HTML into the Backbone "el"
	        this.$el.html( template );
	    },
	    courses: {}
	    
	    
	});


	return ExamView;
});