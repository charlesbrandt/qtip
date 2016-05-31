//alert example (alert on all link clicks)
//also console.log() is very useful for debugging
//    $("a").click(function(event){
//	alert("Thanks for visiting!");
//    });

//TODO:
//window.innerHeight example

//$(window).resize(function() {
//	$('body').prepend('<div>Window: ' + $(window).width() + ' x ' + $(window).height() + '</div>');
//	$('body').prepend('<div>Document: ' + $(document).width() + ' x ' + $(document).height() + '</div>');
//    });

$(document).ready(function(){
});

define(['jquery', 'ko', 'tree', 'moment'], function( $, ko, tree, moment) {

    function appViewModel() {
	var self = this;

	self.loaded = ko.observable("");
	self.filename = ko.observable("sequence");

	// where we're currently looking in self.original tree
	self.path = ko.observable("")

	//using this as a pointer to current node for view:
	self.tree = new tree();
	//console.log(self.tree);

	//keep a reference to our original (root)
	self.original = self.tree;


	// set up some sample data... 
	//might be ok to comment this out soon:
	var track1 = new tree('track1');
	var sequence1 = new tree('sequence1');
	var sequence2 = new tree('sequence2');
	track1.add(sequence1);
	track1.add(sequence2);
	
	self.original.add(track1);

	var track2 = new tree('track2');
	self.original.add(track2);
 


	//console.log(self.original.children());


	//self.tree = test_node;


	self.tree = ko.computed(function() {
	    var test_node = self.original.path(self.path());
	    //console.log(test_node.name());

	    return test_node;
	});


	//console.log(self.tree().children());


	//VIEW METHODS:

	self.clear = function () {
	    self.tree().clear();
	};

	self.save = function () {
	    //http://eligrey.com/blog/post/saving-generated-files-on-the-client-side
	    var d1 = moment();
	    var destination = d1.format('YYYYMMDD-HHmmss-') + self.filename() + '.json';
	    console.log(destination)
	    saveAs(
		new Blob(
		    [self.original.to_json()]
		    //http://stackoverflow.com/questions/477816/what-is-the-correct-json-content-type
		    , {type: "application/json"}
		)
		, destination
	    );
	};


	//http://www.html5rocks.com/en/tutorials/file/dndfiles/
	self.load = function (evt) {
	    var files = evt.target.files; // FileList object
	    
	    //javascript regular expressions:
	    //https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Regular_Expressions
	    var check_dash = /-/g;

	    // files is a FileList of File objects. 
	    var output = [];
	    for (var i = 0, f; f = files[i]; i++) {
		var reader = new FileReader();

		console.log(f);

		//update self.filename with loaded name:
		var parts = f.name.split('.');
		var prefix = parts[0];
		if (check_dash.test(prefix)) {
		    console.log("Prefix has dash: ", prefix);
		    parts = prefix.split('-');
		    self.filename(parts[2]);
		}
		else {
		    self.filename(prefix);
		}

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
		    return function(e) {
			self.original.from_json(e.target.result);
		    };
		})(f);

		// Read in the image file as a data URL.
		reader.readAsText(f);
	    }
	};

	//TODO:
	//might be a more knockout or jquery specific way to do this
	document.getElementById('files').addEventListener('change', self.load, false);

    };

    //ko.applyBindings(new appViewModel());
    //http://stackoverflow.com/questions/8649690/is-there-a-way-to-set-the-page-title-by-data-binding-using-knockout-js
    //using this so page title can be bound as well:
    ko.applyBindings(new appViewModel(), document.getElementById("htmlTop"));

    //do this later, so templates have been applied to DOM

    console.log("made it here!!");
    
    /*
    $('.sortable').sortable();
    $('.connected').sortable({
	connectWith: '.connected'
    });
    */

/*
*/

})

