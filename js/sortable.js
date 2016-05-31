define(['jquery', 'ko', 'moment'], function( $, ko, moment) {

    // function touchHandler(event) {
    // 	var touch = event.changedTouches[0];
	
    // 	var simulatedEvent = document.createEvent("MouseEvent");
    //     simulatedEvent.initMouseEvent({
    //         touchstart: "dragstart",
    //         touchmove: "mousemove",
    //         touchend: "drop"
    // 	}[event.type], true, true, window, 1,
    // 				      touch.screenX, touch.screenY,
    // 				      touch.clientX, touch.clientY, false,
    // 				      false, false, false, 0, null);
	
    // 	touch.target.dispatchEvent(simulatedEvent);
    // 	event.preventDefault();
    // }
    
    //aka set_bindings
    function set_sortables (element, valueAccessor, allBindingsAccessor) {
	//set_sortables: function(element, valueAccessor, allBindingsAccessor) {
	var self = this;
	
	var value = valueAccessor(), allBindings = allBindingsAccessor();
        // Grab some more data from another binding property
	
	//where to attach the event handlers
        var bind_to = allBindings.bind_to || document; // document is default duration unless otherwise specified

	//class name for li elements to trigger on
        var selector = allBindings.call_on;
	//TODO: could find a default value... children li class:
        //var selector = allBindings.call_on || 'document'; // document is default duration unless otherwise specified
	
	//console.log(bind_to, selector);
	
	//placeholder is what is shown as a placeholder:
	var placeholders = [];
	
	var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
	//placeholders = placeholders.add(placeholder);
	placeholders = placeholders.push(placeholder);
	
	var isHandle, index;
	self.dragging = null;
	
	var selected = $(self).data('selected');
	if (!selected) { 
	    selected = [];
	}
	

	//attach event handlers:
	//(what to do when a user triggers the specific event)
	
	//use unobtrusive event handling 
	//to attach bindings for all list items in this list:
	//knockoutjs.com/documentation/unobtrusive-event-handling.html

	//this is needed to allow drag and drop to work in IE 8
	//http://stackoverflow.com/questions/5500615/internet-explorer-9-drag-and-drop-dnd
	//https://blog.frogslayer.com/using-html5-drag-and-drop-in-ie8/
	$(bind_to).on("selectstart", selector, function(event) {
	     this.dragDrop();
	     return false;
	});

	
	//attempt at touch events:
	//http://stackoverflow.com/questions/5186441/javascript-drag-and-drop-for-touch-devices
	//$(bind_to).on("touchstart", selector, touchHandler);	
	
	//$(bind_to).delegate(selector, "dragstart", function(event) {
	$(bind_to).on("dragstart", selector, function(event) {
	    //console.log("dragstart!!");
	    //console.log(this);
	    
	    //this.style.opacity = '0.4';

	    self.dt = event.originalEvent.dataTransfer;
	    self.dt.effectAllowed = 'move';
	    //console.log(this.innerHTML);
	    //console.log(self.dt);
	    //'text/html' messes up IE
	    //self.dt.setData('text/html', this.innerHTML);
	    //'Text' seems acceptable to other browsers
	    self.dt.setData('Text', this.innerHTML);
	    //console.log(self.dt);
	    
	    $(this).addClass('sortable-dragging');

	    //self.dragging = $(this);
	    self.dragging = this;

	    index = $(this).index();
	    //console.log(index);
	    
	});

	//this is needed to make drop work
	//$(bind_to).delegate(selector, "dragover dragenter", function(event) {
	$(bind_to).on("dragover dragenter", selector, function(event) {
	    
	    //console.log("dragover!!");
	    event.preventDefault();
	    event.originalEvent.dataTransfer.dropEffect = 'move';
	    return false;
	    
	});	
	

	//this is duplicated in dropable binding below..
	//must make changes in both places

	//$(bind_to).delegate(selector, "drop", function(event) {
	$(bind_to).on("drop", selector, function(event) {
	    //event.preventDefault();
	    //event.originalEvent.dataTransfer.dropEffect = 'move';
	    
	    //handle drop (trigger dragend)
	    //console.log("drop!!");
	    //console.log(self.dragging);
	    //console.log($(this))
	    
	    //console.log($(this).index(), $(self.dragging).index());
	    
	    //if we allow moving from one location to another
	    //index could be the same if it's not the same list
	    //skipping this check... can always move after a drop:
	    //if ($(this).index() != $(self.dragging).index()) {

	    //get the tree bound to the element being dragged via ko:
	    var drag_ko = ko.dataFor(self.dragging);
	    var drop_ko = ko.dataFor(this);
	    //dragging can also be a temporary element 
	    //w/ no parent associated with ko ... skip those
	    if (drag_ko && drop_ko) {
		//console.log(drag_ko.name());
		//console.log(drop_ko.name());
		var drag_parent = drag_ko.parent;
		var drop_parent = drop_ko.parent;
		var destination = $(this).index();
		//console.log(drag_parent.available());
		if (drop_parent.available()) {
		    drag_parent.remove(drag_ko);
		    //parent.insert(destination, drag_ko);
		    drop_parent.insert(drag_ko, destination);
		    //var response = prompt("Please explain:","");
		    var response = '';
		    //var action = "Moved: \"" + drag_ko.content() + "\" from: " + drag_parent.name() + " to: " + drop_parent.name() + " and responded: " + response;
		    var action = "\"" + drag_ko.content() + "\"," + drag_parent.name() + "," + drop_parent.name() + "," + response;
		    //console.log(action);
		    drop_parent.post(action, false);

		}
		else {
		    alert('Sorry! That column is full.')
		}

		//console.log(drag_parent.to_json());
		//console.log(drop_parent.to_json());

	    }

	    //console.log(ko.dataFor(this).name());
	    //console.log(ko.dataFor(self.dragging).name());
	    event.stopPropagation();
	    //placeholders.filter(':visible').after(self.dragging);
	    //self.dragging.trigger('dragend');
	    return false;
	    
	});
	
	//TODO
	//eventually could work on multiple selection, if needed
	
	//$(bind_to).delegate(selector, "click", function(event) {
	$(bind_to).on("click", selector, function(event) {
	    //console.log("click event: " );
	    if (event.ctrlKey) {
		//selected.push($(this)[0]);
		selected.push(event.target);
		$(self).data('selected', selected);
		//console.log(selected);
	    }
	    else if (event.shiftKey) {
		//add all items between this and previous selection
		//selected.add($(this));
		//$(this).data('selected', selected);
	    }
	    
	    
	});	
	
	    //this is called after drop??
	    /*
	    $(bind_to).delegate(selector, "dragend", function(event) {
		if (!self.dragging) {
		    return;
		}

		//console.log("dragend!!");
		console.log(this);

		self.dragging.removeClass('sortable-dragging').show();
		//placeholders.detach();
		if (index != self.dragging.index()) {
		    self.dragging.parent().trigger('sortupdate', {item: self.dragging});
		}
		self.dragging = null;
		
	    });
	    */

	    /*
	    $(bind_to).delegate(selector, "dragstart", function(event) {
		console.log("dragstart!!");

	    });
	    */

    };
    


    ko.bindingHandlers.sortable = {
	init: function(element, valueAccessor, allBindingsAccessor) {
	    //console.log("sortable: init() called");
	    set_sortables(element, valueAccessor, allBindingsAccessor);
	},
	update: function(element, valueAccessor, allBindingsAccessor) {
	    //console.log("sortable: update() called");
	    //set_sortables(element, valueAccessor, allBindingsAccessor);
            //var value = valueAccessor();
	}
    };


    function set_dropables (element, valueAccessor, allBindingsAccessor) {

	//not sure where self.draggable gets set...
	//must be on the set_sortable call?
	//it is set though

	//set_sortables: function(element, valueAccessor, allBindingsAccessor) {
	var self = this;
	
	var allBindings = allBindingsAccessor();

	//this value gets updated for all subsequent calls to set_dropables
	//only end up with the last value passed in getting stored 
	//for subsequent calls
	//this is why we use ko.dataFor() calls below
	self.value = valueAccessor();

	//console.log(self.value.name());
        // Grab some more data from another binding property
	
	//where to attach the event handlers
        var bind_to = allBindings.bind_to || document; // document is default duration unless otherwise specified

	//class name for li elements to trigger on
        var selector = allBindings.call_on;
	//TODO: could find a default value... children li class:
        //var selector = allBindings.call_on || 'document'; // document is default duration unless otherwise specified
	
	//console.log(bind_to, selector);

	//this is needed to enable drop
	//$(bind_to).delegate(selector, "dragover dragenter", function(event) {
	$(bind_to).on("dragover dragenter", selector, function(event) {
	    
	    //console.log("dragover!!");
	    event.preventDefault();
	    event.originalEvent.dataTransfer.dropEffect = 'move';
	    return false;
	    
	});
	
	//$(bind_to).delegate(selector, "drop", function(event) {
	$(bind_to).on("drop", selector, function(event) {
	    //event.preventDefault();
	    //event.originalEvent.dataTransfer.dropEffect = 'move';
	    
	    //handle drop (trigger dragend)
	    //console.log("droppable drop!!");
	    //console.log(self.dragging);
	    //console.log($(this).index(), $(self.dragging).index());
	    
	    //if we allow moving from one location to another
	    //index could be the same if it's not the same list
	    //skipping this check... can always move after a drop:
	    //if ($(this).index() != $(self.dragging).index()) {

	    //get the tree bound to the element being dragged via ko:
	    var drag_ko = ko.dataFor(self.dragging);
	    //console.log(drag_ko.name());
	    var drop_ko = ko.dataFor(this);
	    //var drop_ko = self.value;
	    //console.log(drop_ko.name());
	    //dragging can also be a temporary element 
	    //w/ no parent associated with ko ... skip those
	    if (drag_ko && drop_ko) {
		var drag_parent = drag_ko.parent;
		var destination = $(this).index();
		//console.log(drag_parent.available());
		if (drop_ko.available()) {
		    drag_parent.remove(drag_ko);
		    //parent.insert(destination, drag_ko);
		    //drop_parent.insert(drag_ko, destination);
		    drop_ko.insert(drag_ko, destination);
		    //var response = prompt("Please explain:","");
		    var response = '';
		    //var action = "Moved: " + drag_ko.name() + " from: " + drag_parent.name() + " to: " + drop_ko.name();
		    //var action = "Moved: \"" + drag_ko.content() + "\" from: " + drag_parent.name() + " to: " + drop_ko.name() + " and responded: " + response;
		    var action = "\"" + drag_ko.content() + "\"," + drag_parent.name() + "," + drop_ko.name() + "," + response;
		    //console.log(action);
		    drop_ko.post(action, false);

		}
		else {
		    alert('Sorry! That column is full.')
		}


		//console.log(drag_parent.to_json());
		//console.log(drop_parent.to_json());

	    }

	    //console.log(ko.dataFor(this).name());
	    //console.log(ko.dataFor(self.dragging).name());
	    event.stopPropagation();
	    //placeholders.filter(':visible').after(self.dragging);
	    //self.dragging.trigger('dragend');
	    return false;
	    
	});
	
    };
    


    ko.bindingHandlers.dropable = {
	init: function(element, valueAccessor, allBindingsAccessor) {
	    //console.log("dropable: init() called");
	    set_dropables(element, valueAccessor, allBindingsAccessor);
	},
	update: function(element, valueAccessor, allBindingsAccessor) {
	    //console.log("dropable: update() called");
	    //set_dropables(element, valueAccessor, allBindingsAccessor);
            //var value = valueAccessor();
	}
    };


    //special case for available 
    //having a hard time getting access to that value

    function set_stackables (element, valueAccessor, allBindingsAccessor) {

	//not sure where self.draggable gets set...
	//must be on the set_sortable call?
	//it is set though

	//set_sortables: function(element, valueAccessor, allBindingsAccessor) {
	var self = this;
	
	var allBindings = allBindingsAccessor();

	//this value gets updated for all subsequent calls to set_stackables
	//only end up with the last value passed in getting stored 
	//for subsequent calls
	//this is why we use ko.dataFor() calls below
	self.value = valueAccessor();

	//console.log(self.value.name());
        // Grab some more data from another binding property
	
	//where to attach the event handlers
        var bind_to = allBindings.bind_to || document; // document is default duration unless otherwise specified

	//class name for li elements to trigger on
        var selector = allBindings.call_on;
	//TODO: could find a default value... children li class:
        //var selector = allBindings.call_on || 'document'; // document is default duration unless otherwise specified
	
	//console.log(bind_to, selector);

	//this is needed to enable drop
	//$(bind_to).delegate(selector, "dragover dragenter", function(event) {
	$(bind_to).on("dragover dragenter", selector, function(event) {
	    
	    //console.log("dragover!!");
	    event.preventDefault();
	    event.originalEvent.dataTransfer.dropEffect = 'move';
	    return false;
	    
	});
	
	//$(bind_to).delegate(selector, "drop", function(event) {
	$(bind_to).on("drop", selector, function(event) {
	    //event.preventDefault();
	    //event.originalEvent.dataTransfer.dropEffect = 'move';
	    
	    //handle drop (trigger dragend)
	    //console.log("stackable drop!!");
	    //console.log(self.dragging);
	    //console.log($(this).index(), $(self.dragging).index());
	    
	    //if we allow moving from one location to another
	    //index could be the same if it's not the same list
	    //skipping this check... can always move after a drop:
	    //if ($(this).index() != $(self.dragging).index()) {

	    //get the tree bound to the element being dragged via ko:
	    var drag_ko = ko.dataFor(self.dragging);
	    //console.log(drag_ko.name());
	    var drop_ko = ko.dataFor(this);
	    //var drop_ko = self.value;
	    //console.log(drop_ko.available.name());
	    //dragging can also be a temporary element 
	    //w/ no parent associated with ko ... skip those
	    if (drag_ko && drop_ko) {
		var drag_parent = drag_ko.parent;
		var destination = $(this).index();
		//console.log(drag_parent.available());

		drag_parent.remove(drag_ko);
		//parent.insert(destination, drag_ko);
		//drop_parent.insert(drag_ko, destination);
		drop_ko.available.insert(drag_ko, destination);
		//var response = prompt("Please explain:","");
		var response = '';
		//var action = "Moved: " + drag_ko.name() + " from: " + drag_parent.name() + " to: " + drop_ko.name();
		//var action = "Moved: \"" + drag_ko.content() + "\" from: " + drag_parent.name() + " to: " + drop_ko.name() + " and responded: " + response;
		var action = "\"" + drag_ko.content() + "\"," + drag_parent.name() + "," + drop_ko.available.name() + "," + response;
		//console.log(action);
		drop_ko.available.post(action, false);

		//console.log(drag_parent.to_json());
		//console.log(drop_parent.to_json());

	    }

	    //console.log(ko.dataFor(this).name());
	    //console.log(ko.dataFor(self.dragging).name());
	    event.stopPropagation();
	    //placeholders.filter(':visible').after(self.dragging);
	    //self.dragging.trigger('dragend');
	    return false;
	    
	});
	
    };
    


    ko.bindingHandlers.stackable = {
	init: function(element, valueAccessor, allBindingsAccessor) {
	    //console.log("stackable: init() called");
	    set_stackables(element, valueAccessor, allBindingsAccessor);
	},
	update: function(element, valueAccessor, allBindingsAccessor) {
	    //console.log("stackable: update() called");
	    //set_stackables(element, valueAccessor, allBindingsAccessor);
            //var value = valueAccessor();
	}
    };

})
