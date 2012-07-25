define([
  'lib/text!templates/schedule_template.html'    
], function(schedule_template){
  // Above we have passed in dependencies
  // They will not be accesible in the global scope
  
  // What we return here will be used by other modules

	ScheduleView = Backbone.View.extend({
	    initialize: function(){
//	        this.render();
	    },
	    render: function(){
	        // Compile the template using underscore
	    	console.log(selTime.toJSON());
	        var template = _.template( schedule_template, { monday: selTimeMondays.toJSON(),
	        												tuesday: selTimeTuesdays.toJSON(),
	        												wednesday: selTimeWednesdays.toJSON(),
	        												thursday: selTimeThursdays.toJSON(),
	        												friday: selTimeFridays.toJSON(),
	        												programmes: programmes} );
	        // Load the compiled HTML into the Backbone "el"
	        this.$el.html( template );
	         
	        
	    }
	    
	    
	});

	return ScheduleView;
});