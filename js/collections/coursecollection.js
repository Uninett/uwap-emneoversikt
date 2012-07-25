
	CourseCollection = Backbone.Collection.extend({
		  model: Course,
		  comparator: function(c){
				return c.get('name');
			}
	});
