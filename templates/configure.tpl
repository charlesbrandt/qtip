
Existing Q-Methods:<br><br>
%for key in options.keys():
   <a href="/method/{{ key }}/">{{ options[key]['name'] }}</a><br>
%end

<br>
<br>
<a href='/configure/new'>[Create new Q-Method]</a><br>


%rebase layout title="Q-TIP: Configure", active="home"
