//Model
//Person = Backbone.Model.extend({
//        initialize: function(){
//        }
//    });
//	var person = new Person;
	allCourses = new CourseCollection;
	selectedCourses = new CourseCollection;
	var detailCourse = new Course;
	var ocwRes = 'none';
	var shCourse = null;
	var filterCourses = '';
	var selDetail = new CourseCollection;
	var selTime = new ActivityCollection;
	var selTimeMondays = new ActivityCollection;
	var selTimeTuesdays = new ActivityCollection;
	var selTimeWednesdays = new ActivityCollection;
	var selTimeThursdays = new ActivityCollection;
	var selTimeFridays = new ActivityCollection;
	var programmes = new Array();
	var pubElements = [ 
	        			{key:30, label: "Emner", open:true, children: []}
	        		];
	var onceRun = false;

//	Controller
	function updateCourses(d){
		
		console.log('updating courses: '+d);
		
		$('#ocwstuff').remove();
		shCourse = d;

		var course_view = new ListCoursesView({ el: $("#out") });
		course_view.render(allCourses);
	}
	function runOnce() {
		initscheduler();
		if(onceRun == false){
			
			
			
			onceRun = true;
		}
		
		
	}
	
	function loggedIn(user){
		$('li#login').html('<label>Innlogget som '+user.name+'</label>');
	}
	
	function filterSomeCourses(d){
		filterCourses = d; 
		console.log('statechange');
		var course_view = new ListCoursesView({ el: $("#out")});
		course_view.render(allCourses);
	}
	
	function createEksamensOversikt(){
		$('#ocwstuff').remove();
		selDetail = new CourseCollection;
		selectedCourses.each(function(c) {UWAP.data.get('http://www.ime.ntnu.no/api/course/'+c.get('code'), {}, eksamenRetrieved);});
	}
	function eksamenRetrieved(d){
		console.log('legg til i eksamensoversikt: {'+ d.course+'}');
		selDetail.add(d.course);
		var eView = new ExamView({ el: $("#out") });
		eView.render();
	}
	function createTimePlan(semester){
		$('#ocwstuff').remove();
		if(scheduler){
			scheduler.clearAll();
		}
		selTime = new ActivityCollection;
		selTimeMondays = new ActivityCollection;
		selTimeTuesdays = new ActivityCollection;
		selTimeWednesdays = new ActivityCollection;
		selTimeThursdays = new ActivityCollection;
		selTimeFridays = new ActivityCollection;
		pubElements = [ 
	        			{key:30, label: "Emner", open:true, children: []}
	        		];
		selectedCourses.each(function(c){UWAP.data.get('http://www.ime.ntnu.no/api/schedule/'+c.get('code')+'/'+semester, {}, scheduleRetrieved);})
		
	}
	function makeTimeLine(){
		console.log(pubElements);
		scheduler.createTimelineView({
			section_autoheight: false,
			name:	"timeline",
			x_unit:	"minute",
			x_date:	"%H:%i",
			x_step:	30,
			x_size: 24,
			x_start: 16,
			x_length:	48,
			y_unit: pubElements,
			y_property:	"section_id",
			render: "tree",
			folder_dy:20,
			dy:60
		});
		
		
		

		//===============
		//Data loading
		//===============
//		scheduler.config.lightbox.sections=[	
//			{name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
//			{name:"custom", height:23, type:"timeline", options:null , map_to:"section_id" }, //type should be the same as name of the tab
//			{name:"time", height:72, type:"time", map_to:"auto"}
//		];
		
//		scheduler.init('scheduler_here',new Date(),"timeline");
//		console.log('scheduler inited');
		$('.dhx_scell_level10').bind('click', function(d){console.log('change:'); console.log(d);});
	}
	function scheduleRetrieved(d){
		_.each(d.activity, function(a){
			_.each(a.activitySchedules, function(s){
				if(s.dayNumber == 0){
					selTimeMondays.add(d.activity);
				} else if(s.dayNumber == 1){
					selTimeTuesdays.add(d.activity);
					} else if(s.dayNumber == 2){
						selTimeWednesdays.add(d.activity);
						
						} else if(s.dayNumber == 3){
							selTimeThursdays.add(d.activity);
							} else {
								selTimeFridays.add(d.activity);
								}
						
			});
			if(a.studyProgrammes==undefined){} else{
				_.each(a.studyProgrammes, function(p){ 
					if($.inArray(p, programmes)) {
						
					}
					else {
						programmes.push(p);
					}
				
				});
			}
		});
		selTime.add(d.activity);
		var aView = new ScheduleView({ el: $("#out") });
		aView.render();
		
		runOnce();
        $('#scheduleTabs a').click(function (e){
			console.log('ffs');
			e.preventDefault();
			$(this).tab('show');
			console.log(e);
		});
		$('a[href="#scheduler"]').on('shown', function (e){
//			console.log('scheduler_here showage');
			
			$('#scheduler_here').css('height', '400px'); 
			scheduler.setCurrentView(new Date());
		});
		$('a[href="#timeplan"]').on('shown', function (e){
//			console.log('scheduler_here showage');
			$('#scheduler_here').css('height', '100%'); 


		});
		
		
		var tempEls = new Array();
		var tempLength = pubElements[0].children.length;
		
		if(d.activity[0]){
			console.log(d);
			tempEls.push({ key: tempLength+31, label: d.activity[0].courseCode+' '+d.activity[0].norwegianCourseName});
			pubElements[0].children.push(tempEls[0]);
			makeTimeLine();
		}
		_.each(d.activity, function(a){
			
			
		_.each(a.activitySchedules, function(s){
				_.each(a.studyProgrammes, function(sp){
					console.log($('input#progchooser').attr('value').toUpperCase() +' vs '+sp);
					if($('input#progchooser').attr('value').toUpperCase()==sp || !$('input#progchooser').attr('value')){
						var wArray = s.weeks.split(',');	
						_.each(wArray, function(w){
							var tempDate = getDate(w, s.dayNumber);
							var tArray = s.start.split(':');
							var momStart = moment(tempDate).hours(tArray[0]).minutes(tArray[1]).format("YYYY-MM-DD HH:mm");
							var endArray = s.end.split(':');
							var momEnd = moment(tempDate).hours(endArray[0]).minutes(endArray[1]).format("YYYY-MM-DD HH:mm");
							//console.log({ start_date: momStart, end_date: momEnd, text:"Tasktest", section_id:20});
							scheduler.parse([{ start_date: momStart, end_date: momEnd, text:a.courseCode+' ('+a.activityAcronym+') <br />Linjer: '+a.studyProgrammes+' <br /> Rom: '+s.rooms[0], section_id: tempLength+31}], 'json');
//							var childArray = new Array();
						});
					} 
				});
				
			});
			console.log(a);
			
		});
	}
	function getDate(weekNo, dayNo){
		var today = new Date();
		var onejan = new Date(today.getFullYear(),0,1);
		if(moment(onejan).day() ==0){
			weekNo--;
		}
		return moment(new Date(today.getFullYear(),0,1)).add('weeks', weekNo-1).add('days', dayNo+1).subtract('days', moment(new Date(today.getFullYear(),0,1)).day());	
	}
	Date.prototype.getWeek = function() {
		var onejan = new Date(this.getFullYear(),0,1);
		return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
	};
	function initscheduler(){
		console.log('sff');
		scheduler.locale.labels.timeline_tab = "Timeline";
		scheduler.locale.labels.section_custom="Section";
		scheduler.config.details_on_create=true;
		scheduler.config.details_on_dblclick=true;
		scheduler.config.xml_date="%Y-%m-%d %H:%i";
		
		
		//===============
		//Configuration
		//===============	
		
//		elements = [ // original hierarhical array to display
////			{key:10, label:"My calendar", open: true, children: [
////			{key:11, label: UC.User.name}	]},
////			{key:20, label: "V&aelig;rmelding", open: false, children: [
////			{key:21, label: "<button class='btn btn-inverse' id='weatherbutton' onclick=\"navigator.geolocation.getCurrentPosition(function(d){console.log(\'found location: \'+d.coords.latitude); UWAP.data.get(\'http://api.met.no/weatherapi/locationforecastlts/1.1/?lat=\'+d.coords.latitude+\';lon=\'+d.coords.longitude, {xml:\'1\'}, UC.weatherCallback, UC.weatherFail);}, function(err){console.log(\'error in finding location: \'+err)} );\">Hent v&aelig;rdata fra met.no</button>"} ]},
//			{key:30, label: "Emner", open:false, children: []}
//			
//			];
		//pubElements = elements;
		
		
		scheduler.createTimelineView({
			section_autoheight: false,
			name:	"timeline",
			x_unit:	"minute",
			x_date:	"%H:%i",
			x_step:	30,
			x_size: 24,
			x_start: 16,
			x_length:	48,
			y_unit: pubElements,
			y_property:	"section_id",
			render: "tree",
			folder_dy:20,
			dy:60
		});
		
		
		

		//===============
		//Data loading
		//===============
		scheduler.config.lightbox.sections=[	
			{name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
			{name:"custom", height:23, type:"timeline", options:null , map_to:"section_id" }, //type should be the same as name of the tab
			{name:"time", height:72, type:"time", map_to:"auto"}
		];
		
		scheduler.init('scheduler_here',new Date(),"timeline");
		
		
	}
	function makeList(emner) {
		allCourses.add(emner.course);
		allCourses.sort();
		createAutocomplete(allCourses);
		
		var course_view = new ListCoursesView({ el: $("#out") });
		course_view.render(allCourses);
	}
	function makeOnlyList(emner) {
		allCourses.add(emner.course);
		allCourses.sort();
		createAutocomplete(allCourses);
		
	}

	function openDetails(c){
//		c2=allCourses.where({code: c});
////		var res = _.map(c2, function (model) { return model.toJSON();});
//		var res = allCourses.find(function(huh){
//		console.log(c);
//		console.log(huh);

//		console.log(huh.attributes.code);
//		return huh.code = c;
//		});
		var uri = 'http://www.ime.ntnu.no/api/course/'+c;
		UWAP.data.get(uri, {}, detailsRetrieved);

//		detailsCourse = new Course(res.attributes);
//		console.log('open details for: '+res.attributes.code);
//		var dView = new CourseDetailsView({course: res.attributes});

	}
	
	function detailsRetrieved(d){
		console.log('detailsdata: '+d.course.code);
		detailsCourse = new Course(d.course);

		var dView = new CourseDetailsView({course: detailsCourse});

		window.scrollTo(0,0);
		
		$('#detailTabs a').click(function (e){
			e.preventDefault();
			$(this).tab('show');
			console.log(e);
		});
		$('a[href="#OCWx"]').on('shown', function(e){
			console.log('show ocw');
			
		});
		$('a[href="#ntnuemne"]').on('shown', function(e){
			console.log('hide ocw');
			$('div#OCW').html('');
		});
		$('#detailTabs a:first').tab('show');
	}

	function checkOCW(what){
		var uri2 = 'http://www.ocwsearch.com/api/v1/search.json?q=statistics&contact=http%3a%2f%2fwww.ocwsearch.com%2fabout';
		var uri = 'http://www.ocwsearch.com/api/v1/search.json?q='+escape(what)+'&contact='+escape('https://emneoversikt.uwap.org/test/index.html#');
		UWAP.data.get(uri, {}, ocwRetrieved);
	}
	
	function ocwRetrieved(d){
//		console.log(d);
		var nowHeight = document.body.scrollHeight;
		ocwRes = d.Results;
		console.log(ocwRes);
		var ocwView = new OCWResultsView(ocwRes);

//		window.scrollTo(0, nowHeight);
	}

	function selectCourse(c){

		selectedCourses.add(allCourses.where({code: c}));
		var selView = new ChosenCoursesView({ el: $("#selectedCourses") });
		selView.render();
		console.log('saving selected, data: ');
		console.log({ app: 'select', selectedCourses: selectedCourses.where({code : c}) });
		UWAP.store.save({ app: "select", selectedCourses: allCourses.where({code : c}) }, saveCallback, saveError);
//		UWAP.auth.check(saveSelected, authFail);
	}
	function deselectCourse(c){
		selectedCourses.remove(selectedCourses.where({code: c}));
		var selView = new ChosenCoursesView({ el: $("#selectedCourses") });
		selView.render();
		UWAP.store.remove({ app: "select", selectedCourses: allCourses.where({code : c}) }, saveCallback, saveError);
//		UWAP.auth.checkPassive(saveSelected, authFail);
//		UWAP.store.remove({app:"select"});
	}

	function saveSelected(c){
		
		UWAP.store.save({ app: "select", selectedCourses: selectedCourses.at(1).toJSON() }, saveCallback, saveError);
	}
	function authFail(){
		console.log('auth failed');

	}
	function saveCallback(d){
		console.log('success:');
		console.log(d);
	}
	function saveError(err){
		console.log(err);
	}
	function refAll(){
		console.log('refreshing alle emner liste');
		var v = new ListCoursesView({ el: $("#out") });
	}

	function getPrevChosen(d){
		loggedIn(d);
		UWAP.store.queryList({app: 'select'},prevCallback, prevError);
		
	}
	function initEmptySelected(){

	}
	function prevCallback(d){
		console.log(d);
		selectedCourses = new CourseCollection;
		for (sel in d){
			selectedCourses.add(d[sel].selectedCourses);
		}
//		var lastSelected = d[d.length-1].selectedCourses;
//		selectedCourses = new CourseCollection(lastSelected);
		var selView = new ChosenCoursesView({ el: $("#selectedCourses") });
		selView.render();
		console.log(selectedCourses);
	}
	function prevError(err){
		console.log(err);
	}

//	View
	function createAutocomplete(collect){
		var allCoursesCodes = allCourses.pluck('code');
//		console.log(allCoursesCodes[1]);
		var CourseAutocomplete = Backbone.View.extend({ 
			el : $('#course-selection'),
			render: function() {
				//$(this.el).html("You Selected : " + this.model.get('code')); 
				selectCourse(this.model.get('code'));
				return this;
			},
		});

		$("#course-input").autocomplete({ 
			source : allCoursesCodes,
			minLength : 2,
			select: function(event, ui){ 
				var selectedModel = collect.where({code: ui.item.value})[0];
				var view = new CourseAutocomplete({model: selectedModel});
				view.render();
			}
		});
	}

	function linjeValg(linje){
//		UWAP.store.remove({type: 'linjevalg'}, function(d){console.log(d);}, function(err){console.log(err);});
//		UWAP.store.save({type: 'linjevalg', valg: linje}, function(d){console.log(d);}, function(err){console.log(err);});
//
//		UWAP.store.queryList({app: 'select'},prevCallback, prevError);
		scheduler.clearAll();
		pubElements = new Array();
		pubElements.push( // original hierarhical array to display
			{key:30, label:"Emner", open: true, children: []});
		
		
		var tempEls = new Array();
		var tempLength = pubElements[0].children.length;
		selTime.each( function(a){
		
			tempEls.push({ key: tempLength+31, label: a.attributes.courseCode+' '+a.attributes.norwegianCourseName});
			pubElements[0].children.push(tempEls[0]);
			makeTimeLine();
			tempEls = new Array();
		
			console.log(a);
			_.each(a.attributes.activitySchedules, function(s){
				_.each(a.attributes.studyProgrammes, function(sp){
					console.log($('input#progchooser').attr('value').toUpperCase() +' vs '+sp);
					if($('input#progchooser').attr('value').toUpperCase()==sp || !$('input#progchooser').attr('value')){
						var wArray = s.weeks.split(',');	
						_.each(wArray, function(w){
							var tempDate = getDate(w, s.dayNumber);
							var tArray = s.start.split(':');
							var momStart = moment(tempDate).hours(tArray[0]).minutes(tArray[1]).format("YYYY-MM-DD HH:mm");
							var endArray = s.end.split(':');
							var momEnd = moment(tempDate).hours(endArray[0]).minutes(endArray[1]).format("YYYY-MM-DD HH:mm");
							//console.log({ start_date: momStart, end_date: momEnd, text:"Tasktest", section_id:20});
							scheduler.parse([{ start_date: momStart, end_date: momEnd, text:a.attributes.courseCode+' ('+a.attributes.activityAcronym+') <br />Linjer: '+a.attributes.studyProgrammes+' <br /> Rom: '+s.rooms[0], section_id: tempLength+31}], 'json');
//							var childArray = new Array();
							tempLength++;
						});
					} 
				});
				
			});
			console.log(a);
			
		});
//		});
		
////			{key:20, label: "V&aelig;rmelding", open: true, children: [
////			{key:21, label: "<button id='weatherbutton' onclick=\"navigator.geolocation.getCurrentPosition(function(d){console.log(\'found location: \'+d.coords.latitude); UWAP.data.get(\'http://api.met.no/weatherapi/locationforecastlts/1.1/?lat=\'+d.coords.latitude+\';lon=\'+d.coords.longitude, {xml:\'1\'}, weatherCallback, weatherFail);}, function(err){console.log(\'error in finding location: \'+err)} );\">Hent v&aelig;rdata fra met.no</button>"} ]}
//			                                                   	
//		);
	}
