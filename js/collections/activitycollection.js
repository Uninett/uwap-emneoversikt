
	ActivityCollection = Backbone.Collection.extend({
		  model: Activity,
		  comparator: function(c){
			  	var st = c.get('activitySchedules')[0].start;
			  	if(st.substring(0,1)=='7' || st.substring(0,1) =='8' || st.substring(0,1) =='9') {
			  		return '0'+st;
			  	}
			  	else {
			  		return st;
			  	}
			}
	});