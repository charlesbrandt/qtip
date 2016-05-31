define(['module', 'jquery', 'ko', 'sortable', 'tree', 'moment'], function(module, $, ko, sortable, tree, moment) {

  function appViewModel() {
    var self = this;
    
    // main place to keep track of where statements are:
    self.root = new tree('root');
    
    self.make_responses = function() {
      console.log("make_responses called");
      //a place to keep track of user responses at end of experiment
      self.responses = new tree('responses');
      
      var cur_response;
      for (var i = 1; i <= 6; i++) {
	//name = "response" + i;
	//using name to store the statement number picked for response
	name = "";
	cur_response = new tree(name);
	//console.log("adding column: " + name);
	self.responses.append(cur_response);
      }
      
      self.root.append(self.responses);
    }
    
    
    
    //subject is a global variable that gets set in the template
    //when the html page is generated
    if ( ! subject.columns) {
      self.columns = method.columns.split(/[ ,]+/);
    }
    else {
      self.columns = subject.columns.split(/[ ,]+/);
    }
    
    //console.log(self.columns.length);
    //console.log(self.columns);
    
    //console.log(subject.json);
    
    //tree based approach
    if (!subject.json) {
      self.available = new tree('available');
      var cur_statement;
      var statement_list = method.statements.split(/\n/);
      for (var i = 1; i <= statement_list.length; i++) {
	name = "statement" + i;
	cur_statement = new tree(name);
	cur_statement.content(statement_list[i-1]);
	self.available.append(cur_statement);	
      }
      
      self.root.append(self.available);
      
      self.placed = new tree('placed');
      //add a sub tree for each column:
      var name;
      var cur_col;
      for (var i = 1; i <= self.columns.length; i++) {
	name = "column" + i;
	cur_col = new tree(name);
	//console.log("adding column: " + name);
	self.placed.append(cur_col);
      }
      
      self.root.append(self.placed);
      
      self.make_responses();
      
      neutral = new tree('neutral');
      self.root.append(neutral);
      
      //not sure that this is needed here...
      //after the first move triggers a post
      //python server can take care of noting when it was started/modded
      //var modified = new tree('modified');
      //modified.content('false');
      //self.root.append(modified);
      //console.log(self.root.to_json());
      
    }
    else {
      self.root.from_json(subject.json);
      self.available = self.root.has_name('available');
      //console.log(self.available);
      self.placed = self.root.has_name('placed');
      //console.log(self.placed);
      self.responses = self.root.has_name('responses');
      if (! self.responses) {
	self.make_responses();
	console.log('RESPONSES RECREATED');
      }
      
      self.neutral = self.root.has_name('neutral');
      if (! self.neutral) {
	neutral = new tree('neutral');
	self.root.append(neutral);
	console.log('NEUTRAL RECREATED');
	self.neutral = self.root.has_name('neutral');
      }
      
    }
    
    //console.log("RESPONSES!!!");
    //console.log(self.responses);
    //console.log(self.neutral);
    
    //console.log(self.responses);
    
    //console.log(self.available);
    //console.log(self.available.length);
    
    var column_sum = 0;
    var cur_max;
    for (var i = 0; i < self.columns.length; i++) {
      cur_max = parseInt(self.columns[i]);
      column_sum += cur_max;
      //console.log(self.placed);
      //console.log(self.placed.children());
      //console.log(self.placed.children()[i]);
      //console.log(cur_max);
      //console.log(self.placed.children()[i].children().length);
      self.placed.children()[i].max(cur_max);
      //var copy = ko.toJS(self);
      //console.log(copy);
      
    }
    
    //make sure available bin always accepts a drop
    self.available.available = ko.computed(function() {
      return true;
    });
    
    self.position = ko.observable(0);
    
    self.pos_total = ko.computed(function() {
      var avail = self.available.children().length;
      var readable = self.position() + 1;
      return readable + "/" + avail;
    });
    
    self.complete = function() {
      //take care of when the survey is complete
      //console.log(window.location.href);
      var redirect = window.location.href + "thank_you";
      self.responses.post('response update', redirect);
      //don't do this here... it could interrupt the ajax post call
      //in which case it looks like comments are not saved
      //window.location.href = window.location.href + "thank_you";
      
      //in case redirect does not happen
      //(haven't seen it personally, but it has been reported)
      //this should update the comments section with a message
      self.finished(true);
      console.log("FINISHED");
      console.log(self.finished());
    };
    
    self.next = function() {
      var avail = self.available.children().length;
      var incremented = self.position() + 1
      if (incremented < avail) {
	self.position(incremented);
      }
      else {
	self.position(0);
      }
    };
    
    self.previous = function() {
      var avail = self.available.children().length;
      var decremented = self.position() - 1
      if (decremented < 0) {
	if (avail) {
	  self.position(avail-1);
	}
	else {
	  self.position(0);
	}
      }
      else {
	self.position(decremented);
      }
    };
    
    self.cur_card = ko.computed(function() {
      //console.log(self.position());
      //console.log(self.available.children());
      var avail = self.available.children().length;
      if (avail && (self.position() < avail)) {
	return self.available.children()[self.position()];
      }
      else {
	if (avail) {
	  //update position so we have a valid card
	  //this may happen if last card was removed
	  self.previous();
	  return self.available.children()[self.position()];
	}
	else {
	  return '';
	}
      }
    });
    //console.log(self.cur_card().name());
    
    self.done = ko.observable(false);
    
    //for when we're *really* done, comments and all
    self.finished = ko.observable(false);	
    
    self.done_not_finished = ko.computed(function() {
      if (self.done() && ! self.finished()) {
	return true;
      }
      else {
	return false;
      }
      
    });
    
    
    
    self.toggle_done = function() {
      if (self.done()) {
	self.done(false);
      }
      else {
	self.done(true);
      }
    };
    
    
    //console.log(column_sum)
    
    //could raise an error here if self.available.length != column_sum
    
    
  };
  
  //ko.applyBindings(new appViewModel());
  //http://stackoverflow.com/questions/8649690/is-there-a-way-to-set-the-page-title-by-data-binding-using-knockout-js
  //using this so page title can be bound as well:
  ko.applyBindings(new appViewModel(), document.getElementById("htmlTop"));
  
  //do this later, so templates have been applied to DOM
  
  // init();
  
  console.log("made it here!!");
  
  /*
   */
  
})

