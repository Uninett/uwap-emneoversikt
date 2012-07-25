//require.config({
//  paths: {
//    jQuery: 'libs/jquery/jquery',
//    Underscore: 'libs/underscore/underscore',
//    Backbone: 'libs/backbone/backbone'
//  }
//
//});
require(["views/scheduleview", "views/examview", "views/ocwresultsview", "views/coursedetailsview", "views/chosencoursesview", "views/listcoursesview"],
			function(Course, CourseCollection)
		{
		
		//UWAP.data.get('https://foodl.org/api/activity', {handler: "foodle"}, activity);
		$(document).ready(function() {
			// Dokumentet er klart
	
			

			
			UWAP.auth.check(getPrevChosen, initEmptySelected);
			
			UWAP.messenger.receiver = function(msg){
				console.log('messager message: '+msg);
			};
			 var AppRouter = Backbone.Router.extend({
			        routes: {
			            "emne/:emne": "emneRoute", 
			            "*nothing": "defaultRoute"
			        },
			        emneRoute: function( emne ){
			            
			            console.log('emneRoute:'+ emne ); 
			            
			           	var uri = 'http://www.ime.ntnu.no/api/course/'+emne;
			           	UWAP.data.get(uri, {}, detailsRetrieved);
			          
			            
			            if(allCourses == undefined){console.log('allCourses undefined; loading...');
			            	var emneapi = 'http://www.ime.ntnu.no/api/course/-';
			            	UWAP.data.get(emneapi, {}, makeOnlyList);	
			            } else{
			            	
			            	}
			            
			        },
			        defaultRoute: function (nothing){
			        	console.log('nothing... load list');
			        	if(allCourses.length < 2){console.log('allCourses undefined; loading...');
		            		var emneapi = 'http://www.ime.ntnu.no/api/course/-';
		            		UWAP.data.get(emneapi, {}, makeList);	
			        	} else{
//		            		var course_view = new ListCoursesView({ el: $("#out") });
//		            		course_view.render(allCourses);
		            	}
			        }
			    });
			    // Initiate the router
			    var app_router = new AppRouter;
			    // Start Backbone history a neccesary step for bookmarkable URL's
			    Backbone.history.start();
			
		});
		
});