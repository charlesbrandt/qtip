/*
*2013.03.09 09:23:22 
Description:

often think of needing a tree object to store data in...
ideally you just use the DOM for this and then use jQuery to navigate...
http://api.jquery.com/category/traversing/tree-traversal/

but sometimes it might be nice to convert to and from JSON

for automatic syncing with the DOM, consider using something like Knockout

be sure to set paths up correctly in main javascript setup

requirejs.config({
paths : {
    jquery : "lib/jquery",
    json2 : "lib/json2"
},

shim : {
    "json2" : [ "jquery" ]
}
});


*/

//path to jquery should be defined in main.js
define(['jquery', 'lodash', 'ko'], function($, _, ko) {
    //defining a var name before returning it 
    //since it gets referenced when adding children nodes

    //trying to decide between requiring a name
    //or passing in an object with named parameters
    //leaning toward named parameters argument
    //can then just call self.from_json
    //return function(name) { 
    var tree = function(args) { 
	var self = this;
	
	//console.log('call from tree.js');

	//these functions should be useful
	//http://api.jquery.com/category/traversing/tree-traversal/

	//these should also help when in DOM:
	//http://api.jquery.com/category/selectors/
	
	//this should be the same as the id of the element in the DOM
	// (should be unique)
	//self.name = name;
	self.name = ko.observable('');

	self.content = ko.observable('');

	//aka items (but usually think of children in this context)
	self.children = ko.observableArray();

	//should keep track of this locally
	//if it changes in the DOM, 
	//that should be updated here explicitly (left to caller)
	//automatic updates may be possible with a tool like Knockout
	self.parent = '';

	//similar to using DOM lookup to determine.
	//http://api.jquery.com/parent/
	//self.parent = function() {
	//    return $(self.id).parent();
	//};

	self.size = ko.observable(0);

	self.total_size = ko.computed(function() {
	    var tally = 0;
	    for (var i = 0, len = self.children().length; i < len; i++) {
		tally += self.children()[i].total_size();
            }
	    if (self.size()) {
		tally += parseFloat(self.size());
	    }
	    return(tally); 
	});

	// keep a running total of sizes as they increase in order
	// does not factor in self.size
	self.size_list =  ko.computed(function() {
	    var tally = 0;
	    var all_sizes = [];
	    for (var i = 0, len = self.children().length; i < len; i++) {
		tally += self.children()[i].total_size();
		all_sizes.push(tally);
            }
	    return(all_sizes); 
	});


	self.editing_name = ko.observable(false);        
	// Behaviors
	self.edit_name = function() { self.editing_name(true) }

	self.editing_size = ko.observable(false);        
	// Behaviors
	self.edit_size = function() { self.editing_size(true) }

	self.editing_content = ko.observable(false);        
	// Behaviors
	self.edit_content = function() { self.editing_content(true) }

	self.id = ko.computed(function() {
	    return("." + self.name()); 
	});

	//avoids confusion if different elements are passed to function
	//could customize what is added based on the data supplied, if needed
	self.add_new = function(data) { 
	    var node = new tree("New Item");
	    self.append(node);
	}

	//aka add or append
	//append was easy to confuse as a native js method 
	//(too similar to python)
	//functionality is similar to a python list here...
	//append to the end of children list
	//*2013.11.14 13:40:25 
	//getting strange error with add
	//conflicting with jqeury function
	//was not due to the name... 
	//ok to change back to add, but append should work the same
	self.append = function(item) {
	    self.children.push(item);
	    item.parent = self;
	};

	//similar to a python list here...
	//insert at the specified position of children
	self.insert = function(item, position) {
	    self.children.splice(position, 0, item);
	    item.parent = self;
	};

	//remove self from parent
	self.remove_self = function() {
	    self.parent.remove(self);
	}

	//remove the item from self and any children
	self.remove = function(item) {
	    var index = self.children.indexOf(item);
	    while (index !== -1) {
		self.children.splice(index, 1);
		index = self.children.indexOf(item);
	    }
	};
	
	//remove all items from self
	self.clear = function(item) {
	    //could consider recursing and clearing everything else out too
	    //knockout provides a similar method
	    return self.children.removeAll()
	    
	    //reset / recreate approach:
	    //self.children = ko.observableArray();
	    //self.children = [];
	    //could consider returning the collection of items cleared
	    //not sure if any of these actions are actually needed though
	};
	
	self.from_json = function(data) {
	    //could use typeof natively here:
	    //typeof "Hello World"; // string
	    //typeof 123;           // number
	    //via
	    //http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
	    
	    //but seems like underscore/lodash is a better/easier alternative:
	    if (_.isString(data)) {
		obj = JSON.parse(data);
	    }
	    else if (_.isObject(data)) {
		//assume that the object is a Node already
		obj = data;
	    }
	    else { 
		console.log("Tree.from_json: Unknown object: " + data);
		obj = {};
	    }

	    if ('name' in obj) {
		self.name(obj['name']);
	    }

	    if ('content' in obj) {
		self.content(obj['content']);
	    }

	    if ('size' in obj) {
		self.size(obj['size']);
	    }

	    if ('children' in obj) {
		//_.each(obj['children'], self.add);
		_.each(obj['children'], function(item) {
		    //HOW DOES THIS HANDLE INITIALIZATION???
		    var node = new tree(item);
		    self.append(node);
		});
	    }

	    //not sure if this can be added via JSON
	    //maybe if some context was passed in, 
	    //and the parent could be found via a search
	    /*
	    if ('parent' in obj) {
		self.parent = obj['parent'];
	    }
	    */
	    
	};


	//initialize with any data sent now
	if (_.isString(args)) {
	    self.name(args);
	}
	else if (_.isObject(args)) {
	    self.from_json(args);
	}



	//this is a helper function for to_json
	//removes circular objects
	self.copy = function() { 
	    var copy = {};
	    copy.name = self.name();
	    //assumes a primitive type
	    //see:
	    //http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
	    //for more complex types (Arrays, Ojbects, Dates, etc)
	    copy.content = self.content();
	    copy.size = self.size();
	    copy.children = [];
	    for (var i = 0, len = self.children().length; i < len; i++) {
		copy.children[i] = self.children()[i].copy();
            }
            return copy;
	};
	
	self.to_json = function() {
	    //https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
	    //could use something like cycle to automatically handle 
	    //circular objects
	    
	    //in this case we can always reference the parent
	    //when we recreate the object (and this is where the cycle comes in)
	    //console.log(JSON);
	    copy = self.copy();
	    //console.log(copy);
	    return JSON.stringify(copy);	    
	};


	
	//http://stackoverflow.com/questions/1082928/convert-json-to-html-tree

	//destination is the jquery object where we should append
	self.to_dom = function(destination) {
	    var child, f, li;

	    //TODO:
	    //if self.content is a string, add self.content as text
	    //otherwise, if an object, call object.render() for text
	    var div = $('<div/>', {'class':'node', 'text':self.content(), 'id':self.name()} );
	    var ul = $('<ul class="children"/>');

	    for (f = 0; f < self.children().length; f++) {
		li = $("<li/>");
		child = self.children()[f];
		child.to_dom(li);
		li.appendTo(ul);
	    }
	    ul.appendTo(div);
	    div.appendTo(destination);
	};

	//http://stackoverflow.com/questions/7993066/convert-dom-structrue-to-json
	//accept the root element to convert
	//probably best to leave data in the DOM as much as possible
	self.from_dom = function(root) {

	    var result = {};

	    $('> ul > li > span', root).each(function () {
		result[$(this).text()] = $(this).hasClass('title') ? helper($(this).parent()) : $(this).next('input').val();
	    });
	    
	    return result;
	    
	};
	

	//http://stackoverflow.com/questions/1650063/selecting-root-element-in-jquery
	//need to specify how high up the chain to go somehow...
	//self.root = function() {
	//    return $('.root');
	//};
	//might want to keep track of this in the nodes themself...
	//DOM goes too far... all the way up to HTML
	self.root = function() {
	    var root;
	    var parent = self.parent;
	    if (parent) {
		while (parent.parent) {
		    parent = parent.parent;
		}
		root = parent;
	    }
	    else {
		root = self;
	    }
	    return root;
	};

	// other items on the same level as this one
	self.neighbors = function() {
	    var current, neighbors = [];
	    if (self.parent) { 
		//maybe a way to use underscore to do this more clearly?
		for (var i = 0, len = self.parent.children.length; i < len; i++) {
		    current = self.parent.children[i];
		    if (current.name != self.name()) {
			neighbors.push(current);
		    };
		};
	    };
	    return neighbors;
	};


	//http://api.jquery.com/jQuery.contains/
	//similar to jquery contains for the DOM
	//self.contains = function(data) {
	//};

	//instead of 'contains', it might be more clear to have:
	//has_item and has_name (and has_branch?)
	//to differntiate the different ways to look for something

	//this is depth first...
	//breadth first seems better (more optimal for most cases), 
	//but might be difficult with this structure / recursion
	self.has_name = function(name) {
	    var result = false;
	    var temp;
	    if (self.name() == name) {
		result = self;
	    }
	    else {
		for (var i = 0; i < self.children().length; i++) {
		    temp = self.children()[i].has_name(name);
		    if (temp) {
			result = temp;
			break;
		    }
		}
	    }
	    return result;
	};

	self.has_item = function(item) {
	    var result = false;
	    var temp;
	    if ((self.name() == item.name) && (self.content() == item.content)) {
		result = self;
	    }
	    else {
		for (var i = 0; i < self.children().length; i++) {
		    temp = self.children()[i].has_item(item);
		    if (temp) {
			result = temp;
			break;
		    }
		}
	    }
	    return result;
	};



	//similar to XPath
	//how to get to the current node

	//if a path is sent in here, return the node at that path
	//(relative to self)
	self.path = function(path) {
	    var parts = path.split('/');
	    var cur_node = self;
	    var cur_part;
	    var cur_child;
	    var unknown_path = false;

	    for (var i = 0, len = parts.length; i < len; i++) {
		cur_part = parts[i];
		//console.log("looking for part:", cur_part, "(index: ", i, ") in: ", cur_node.name());

		//skip any empty parts:
		if (cur_part) {
		    var match_found = false;
		    for (var j = 0; j < cur_node.children().length; j++) {
			cur_child = cur_node.children()[j];
			if (cur_child.name() == cur_part) {
			    cur_node = cur_child;
			    match_found = true;
			};
		    }
		    //something didn't match... want to return an error here
		    if (!match_found) { 
			unknown_path = true;
			return false;
		    }
		}
	    };
	    return cur_node;

	}; 


	//custom methods for qtip project:

	//should set this externally
	self.max = ko.observable(0);

	self.available = ko.computed(function() {
	    return self.max() - self.children().length;
	});

	self.available_items = ko.computed(function() {
	    var options = [];
	    for (var i = 0, len = self.available(); i < len; i++) {
		options.push(i);
            }
	    return options
	});


	self.post = function(action, redirect) {
	    //var copy = ko.toJS(self);
	    //console.log(copy);
	    
	    var root = self.root();

	    //console.log("Posting: " + root.to_json());

	    //it is important to pass in an action string
	    if (!action) {
		console.log("MISSING ACTION!!");
		console.log(action);
	    }
	    
	    //console.log(root.to_json());
            $.ajax({
		url: 'json',
		type: 'POST',

		//this works better for observables: 
		//(plus JSON result is shorter)
		data: {
                    'json': root.to_json(),
                    'action': action,
		    
		},
		success: function(data, textStatus) {
		    if (redirect) {
			console.log(redirect);
			//window.location.href = redirect;
			//window.location.href = window.location.href + "thank_you";

		    }
		    /*
		    else {
			// data.form contains the HTML for the replacement form
			$("#myform").replaceWith(data.form);
		    }
		    */
		}
		
            });
	};

    };
    return(tree);
});



