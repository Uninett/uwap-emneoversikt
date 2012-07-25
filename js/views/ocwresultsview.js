define([
  'lib/text!templates/ocw.html'    
], function(ocw_template){
  // Above we have passed in dependencies
  // They will not be accesible in the global scope
  
  // What we return here will be used by other modules
	OCWResultsView = Backbone.View.extend({
		initialize: function(ocwRes){
			
			this.render(ocwRes);
		},
		render: function(ocwRes){
			// Compile the template using underscore
			console.log('render ocw: ');
			console.log(ocwRes);
			var template = _.template( ocw_template, {course: ocwRes}  );
			// Load the compiled HTML into the Backbone "el"
			this.$el.html( template );
		},
		el : $('#OCW')
	});
	return OCWResultsView;
});