<div id="description">

  <h3>Create a new Q-Method</h3>
  
  <p>Please tell us the title of your Q-Method and a few brief contact details so we may keep you up to date about the Q-TIP service:</p>
  
  <form name="create_method" method="post">

    <ul class="details">
      %for field in fields:
      <li class="{{ field[0] }}">
        <span class="col1">
      {{ field[1] }}
        </span>
        <span class="col2">
          <input type="text" name="{{ field[0] }}" value="{{ field[2] }}" placeholder=""/>
          %if len(field) > 3:
          <b class="error">* Required: {{ field[3] }}</b>
          %end
        </span>
        
      </li>
      %end
    </ul>
    
    <p><input type="submit" value="Create"></p>
    
  </form>
</div>

%rebase layout title="Q-TIP: Create New Method", active="home"
