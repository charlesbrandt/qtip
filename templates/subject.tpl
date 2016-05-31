<div id="messages">
</div>

<div data-bind="ifnot: done()">
  <div id="static-top-half">
    <div id="question">
      {{method_details['name']}}
    </div>
    <div id="instructions">
      Click-and-drag to move statements back and forth between the stack and the blanks in the columns below until all blanks are occupied.
    </div>

    <div id="statements">
      <ul id="card_area">
	<li class="card_row" style="width:15%;">
	  <span class="helper" data-bind="click: previous()"><img class="card_arrow" src="/img/left-sq.png" alt="Previous"></span>
	</li>  
	<li class="card_row" style="width:65%;">
	  <div data-bind="if: cur_card()">
	    <div class="wrapper" data-bind="with: cur_card()">
	      
	      <div id="card" draggable="true" data-bind="sortable: null, bind_to: '#card_area', call_on: '#card'"><p data-bind="text: content"></p></div>

	    </div>

	    <div class="position" data-bind="text: pos_total"></div>
	  </div>

	  <div class="empty_stack" data-bind="ifnot: cur_card()">
	    <div class="wrapper" data-bind="stackable: available, bind_to: '#statements', call_on: '.empty_stack'">
	      <div id="empty">
		<p>Card stack empty.</p>
		<p>To rearrange cards, drag them here to make space.</p>
	      </div>
	      <div><button data-bind="click: toggle_done">All done!</button></div>
	    </div>
	  </div>
	  
	</li>
	
	<li class="card_row" style="width:15%;">
	  <span class="helper" data-bind="click: next()"><img class="card_arrow" src="/img/right-sq.png" alt="Next">
	  </span>
	</li>
      </ul>
    </div>

    <div id="labels">
      <span class="padl">&nbsp;</span>
      <span class="label" style="text-align:left;">least like how I think</span>
      <span class="label" style="text-align:right;">most like how I think</span>
      <span class="padr">&nbsp;</span>
    </div>

  </div>
     
</div>

<div data-bind="if: finished()">
  <div id="relative-top-half">
    <h1>You have finished the survey.</h1>
    <h1>Thank you for participating. We value your input.</h1>
  </div>
</div>

<div data-bind="if: done_not_finished()">
  <div id="relative-top-half">
    <div id="question">
      {{method_details['name']}}
    </div>

    <div id="responses">
      <div><button data-bind="click: complete">Save comments</button> &nbsp;&nbsp;&nbsp; <button data-bind="click: toggle_done">Change order</button> </div>
      <p>Please pick 6 statements that you feel most worth commenting on, either
	because you feel most strongly about them or because they were
	particularly difficult to place.  Provide their numbers below and provide
	commentary about your placement of them relative to other statements.</p>
      <ul class="header">
	<li class="question">
	  <span class="col1">
	    Statement <br>number:
	  </span>
	  <span class="col2">
	    Commentary:
	  </span>
	</li>
      </ul>
      <ul class="questions" data-bind="foreach: responses.children">
	<li class="question">
	  <span class="col1">
	    <input size="2" data-bind="value: name" />
	  </span>
	  <span class="col2">
	    <textarea rows="2" cols="60" data-bind="value: content"></textarea>
	    &nbsp;
	  </span>
	</li>
      </ul>
      
    <div class="neutral">
      Which column below contains the statements that you feel most neutral about?<br>
      <input size="2"data-bind="value: neutral.content" />
    </div>
    
    <div><button data-bind="click: complete">Save comments</button></div>
    </div>
  </div>
  
  <div id="labels">
    <span class="padl">&nbsp;</span>
    <span class="label" style="text-align:left;">least like how I think</span>
    <span class="label" style="text-align:right;">most like how I think</span>
    <span class="padr">&nbsp;</span>
  </div>
  
</div>

<div data-bind="ifnot: finished()">

<div id="columns" data-bind="style: { marginTop: done() ? '0px' : '320px' }">
  <ul id="columns_list" data-bind="foreach: placed.children">
    <li class="column" style="width:{{width}}%;" data-bind="attr: { id: name }, dropable: $data, bind_to: '#columns', call_on: '#' + name()">
      <div class="column_header" data-bind="text: $index()+1"> </div>
      <div class="column_area">
      <ul class="sortable" data-bind="foreach: children, sortable: null, bind_to: '#' + name(), call_on: '.statement'">
	<li class="statement" draggable="true" data-bind="text: content">
	</li>
      </ul>
      <ul class="sortable" data-bind="foreach: available_items">
	<li class="placeholder"> &nbsp;
	</li>
      </ul>
      </div>
      
    </li>
  </ul>
</div>

</div>

    <script type="text/javascript" src="/js/lib/jquery-1.11.0.min.js"></script>
      
    <!-- these should all be minified and combined before a production release -->

    <script type="text/javascript" src="/js/lib/require.js"></script>
    <script type="text/javascript">
      method = {{! method_json }};
      subject = {{! subject_json }};
      
      //this allows require.js to be in a different directory (lib)
      //than main custom code
      require.config({
		baseUrl: '/js',
		paths: {
		      //'jquery'   : 'lib/jquery-1.7.1',
		      'jquery'   : 'lib/jquery-1.11.0.min',
	              'lodash'   : 'lib/lodash.compat.min',
                      //'ko'       : 'lib/knockout-2.2.1',
	              'ko'       : 'lib/knockout-3.0.0',
                      'moment'   : 'lib/moment.min'
		},
      });
      require(['subject'], function(subject) {});
    </script>


%rebase minimal title=method_details['name'], active="home"
