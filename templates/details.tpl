<div id="messages">
</div>

<h3>{{method_details['name']}}</h3>

<h4>Participant ID: {{skey}}</h4>

Created: {{ subject_details['created'] }}<br>
<br>
Started: {{ subject_details['started'] }}<br>
<br>
Last Update: {{ subject_details['last_update'] }}<br>
<br>

<h4>History:</h4>
{{! html }}
<br>

%rebase layout title=method_details['name'], active="home"
