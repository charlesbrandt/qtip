define(['module', 'jquery', 'ko', 'moment'], function(module, $, ko, moment) {
  
  function appViewModel() {
    var self = this;

    // place to store message
    self.message = ko.observable();
    self.show_message = ko.observable(false);

    //console.log(module.config().data);
    
    self.name = ko.observable(data.name);
    self.owner = ko.observable(data.owner);
    self.email = ko.observable(data.email);
    self.phone = ko.observable(data.phone);
    self.notes = ko.observable(data.notes);
    self.statements = ko.observable(data.statements);
    self.columns = ko.observable(data.columns);
    
    
    self.editing_data = ko.observable(false);
    self.toggle_edit = function() { 
      if (self.editing_data()) {
	self.editing_data(false);
      }
      else {
	self.editing_data(true);
      }
    }
    
    self.statement_list = ko.computed( function() {
      return self.statements().split(/\n/);
    });

    console.log(self.statement_list());
    
    //should be ok to do initial post now
    ko.computed(function() {
      //var copy = ko.toJS(self);
      //console.log(copy);
      
      // first go through the statement list and get rid of any blank lines
      // or maybe do this on statement submission,
      // that way we can also check column lengths

      var column_list = self.columns().split(' ');
      //console.log(column_list);
      var column_total = 0
      for (var i = 0; i < column_list.length; i++) {
        column_total += parseInt(column_list[i]);
      }
      //console.log(column_total);

                                
      var pruned_list = []
      var statement_lines = self.statements().split(/\n/);
      for (var i = 0; i < statement_lines.length; i++) {
        if (statement_lines[i]) {
          pruned_list.push(statement_lines[i]);
        }
      }
      //console.log(statement_lines);
      //console.log(pruned_list);
      //console.log(pruned_list.length);
      var new_data = pruned_list.join('\n');
      self.statements(new_data);
      //console.log(self.statements());

      if ((pruned_list.length == 2) && (column_total == 40)) {
        // this is what the default data is set to...
        // no need to show a message immediately
        self.show_message(false);
        self.message = ko.observable('');
      }
      else if (pruned_list.length < column_total) {
        self.message("Warning: Fewer statements (" + pruned_list.length + ") than total column items (" + column_total + ")"); 
        self.show_message(true);
      }

      else if (pruned_list.length > column_total) {
        self.message("ERROR: More statements (" + pruned_list.length + ") than total column items (" + column_total + ")"); 
        self.show_message(true);
      }
      else {
        // must be equal... all is good!
        self.show_message(false);
        self.message = ko.observable('');
      }

      console.log(self.show_message());
      
      $.ajax({
	url: 'json',
	type: 'POST',
        
	//this works better for observables: 
	//(plus JSON result is shorter)
	data: {
          'name': self.name(),
          'owner': self.owner(),
          'email': self.email(),
          'phone': self.phone(),
          'statements': self.statements(),
          'columns': self.columns(),
          'notes': self.notes(),
	  
	}
        
	//data: ko.toJS(self),
	//data: copy,
      });
    });
    
  };
  
  //ko.applyBindings(new appViewModel());
  //http://stackoverflow.com/questions/8649690/is-there-a-way-to-set-the-page-title-by-data-binding-using-knockout-js
  //using this so page title can be bound as well:
  ko.applyBindings(new appViewModel(), document.getElementById("htmlTop"));
  
  //do this later, so templates have been applied to DOM
  
  //console.log("made it here!!");
  
  /*
   */
  
})

