<!DOCTYPE html>
<html>
  <head>
    <title>{{title or 'Q-TIP'}}</title>
  
    %# if you want to customize these on a page by page basis, 
    %# remove them here and pass them in from the calling page 
    % description="Q-method Testing and Inquiry Platform"
    % keywords="q_method q_process research"
    % author="Charles Brandt"
    
    <meta name="description" content="{{description}}" />
    <meta name="keywords" content="{{keywords}}" />
    <meta name="author" content="{{author}}" />
  
    <link rel="stylesheet" type="text/css" href="/css/admin.css" />    

    <style>
    </style>

    <script type="text/javascript">
    </script>

  </head>
  <body>


    <div class="page">
      
      %include navigation active=active
  
      <div id="result"> </div>
      
      <div class="content">
	%#this is utilized by rebase calls
	%#easier than passing in body from application.py
	%include
      </div><!-- END .content -->    

      %include footer
    
    </div><!-- END .page -->    



    <script>
      var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
      (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
      g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
      s.parentNode.insertBefore(g,s)}(document,'script'));
    </script>

  </body>
</html>

