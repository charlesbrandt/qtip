<div style="float:right">(Key: {{ key }} )<br></div>


<h3>Q-Method Details:</h3>

<h4 class="message" data-bind="visible: show_message(), text: message"></h4>

<ul class="details">
%for k in ['name', 'owner', 'email', 'phone', 'notes', 'columns', 'statements', ]:
   <li class="{{ k }}">
     <span class="col1">
       {{ k[:1].upper() + k[1:] }}:
     </span>
     <span class="col2">
     %if k == "statements":
       <div data-bind="foreach: statement_list(), visible: !editing_data()">
         <b data-bind="text: $data"></b><br>
       </div>

         <textarea rows="40" cols="80" data-bind="visible: editing_data, value: {{ k }}"></textarea>
       <p data-bind="visible: editing_data">'Statements' is the list of items to be sorted, where each statement is on its own line, and each line starts with the statement number.</p>
     %else:
       <b data-bind="visible: !editing_data(), text: {{ k }}">{{ details[k] }}</b>
       <input data-bind="visible: editing_data, value: {{ k }}" />   
     %end

       %if k == "columns":
       <p data-bind="visible: editing_data">'Columns' is a space separated list of numbers, where each number is the number of items a column can hold.<br><br>  For example:<br>
2 3 5 6 8 6 5 3 2<br>
         represents nine columns, and the fifth column can hold eight items in it. </p>
     %end

       
       &nbsp;
     </span>
   </li>
%end
</ul>

<ul style="clear: both"></ul>

<button type="button" data-bind="visible: !editing_data(), click: toggle_edit">Edit Details</button><br>
<button type="button" data-bind="visible: editing_data(), click: toggle_edit">Save Details</button><br>


<br>

<h3>Participants:</h3>
<form method="get" action="/method/{{key}}/new">
  <button type="submit">Create new participant</button>
</form>

<ul>
%#for subject in subjects:
%for i in range(len(subjects)):
%   subject = subjects[i]
%if i % 2:
   <li class="subject" style="background-color:#CCCCCC">
%else:
   <li class="subject">
%end
     <span class="subject_row"><a href="/s/{{ key }}/{{ subject }}/">{{ subject }}</a></span>
     <span class="subject_row">&nbsp;</span>
     <span class="subject_row"><a href="/layout/{{ key }}/{{ subject }}/">layout</a></span>
     <span class="subject_row"><a href="/comments/{{ key }}/{{ subject }}/">comments</a></span>
     <span class="subject_row"><a href="/history/{{ key }}/{{ subject }}/">history</a></span>
     <span class="subject_row">&nbsp;</span>
     <span class="subject_row"><a href="/details/{{ key }}/{{ subject }}/">details</a></span>
   </li>
%end
</ul>


    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="/js/libs/jquery-1.7.1.min.js"><\/script>')</script>
      
    <!-- these should all be minified and combined before a production release -->

    <script type="text/javascript">
      console.log("Starting here...");
    </script>

    <script type="text/javascript" src="/js/lib/require.js"></script>
    <script type="text/javascript">
      data = {{! details_json }};
      
      //this allows require.js to be in a different directory (lib)
      //than main custom code
      require.config({
		baseUrl: '/js',
		paths: {
		      'jquery'   : 'lib/jquery-1.7.1',
	              'lodash'   : 'lib/lodash',
	              'ko'       : 'lib/knockout-2.2.1',
                      'sortable' : 'lib/jquery.sortable.amd',
                      'moment'   : 'lib/moment.min'
		},
                options: {
                      'data': {{! details_json }}
                }
      });
      require(['method'], function(method) {});
    </script>


%rebase layout title="Q-TIP: Method: "+details['name'], active="home"
