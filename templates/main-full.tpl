<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->

<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <title>{{title}}</title>

  <meta name="description" content="{{description}}" />
  <meta name="keywords" content="{{keywords}}" />
  <meta name="author" content="{{author}}" />
  
  %include head 

  <script type="application/javascript">  
  </script>

</head>
<body>
  <!-- Prompt IE 6 users to install Chrome Frame. -->
  <!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
  <div class="page">

  %include navigation

  <div id="result"> </div>

  {{! body }}
	
    <article class="main" role="main">
      
      <nav role="pagenav" id="sidebar">
	<ul class="nav nav-tabs nav-stacked">
	  <li><a href="#article-1" id="current">Article One</a></li>
	  <li><a href="#article-2">Article Two</a></li>
	  <li><a href="#article-3">Article Three</a></li>
	  <li><a href="#article-4">Article Four</a></li>
	  <li><a href="#article-5">Article Five</a></li>
	</ul>
      </nav>

      <div id="maincolumn">
	
	<h1>Simple Template (h1)</h1>
	<h2>Stuff 'n Things (h2)</h2>
	<h3>*2012.08.28 20:37:42 (h3)</h3>
	<h4>Hello World! (h4)</h4>

	<hr />
  
	<aside class="summary">
	  <p>This is a test file to see all of the different styling options currently configured. This is a paragraph (p). Some other styles that may show up are: <b>bold (b)</b>, <i>italics (i)</i>, <em>emphasized (em)</em>, <strike>struck-through</strike> or <strong>strengthened (strong)</strong>.</p>
	</aside>

	<p>Another paragraph. Next up are some lists...</p>

	<ul>
	  <li>Unordered List - First item.</li>
	  <li>Another item with <a href="" title="Test Link">a link.</a></li>
	  
	  <li><a href="" title="Test Link">Another item that is linked</a></li>
	  <li>Last item.</li>
	</ul>
  
	<ol>
	  <li>Ordered List - First item.</li>
	  <li>Another item with <a href="" title="Test Link">a link.</a></li>
	  <li><a href="" title="Test Link">Another item that is linked.</a></li>
	  <li>Last item.</li>
	</ol>
  
        <ul class="icons">
          <li><img src="img/icons/glyphicons_019_cogwheel.png" /></li>
          <li><img src="img/icons/glyphicons_030_pencil.png" /></li>
          <li><img src="img/icons/glyphicons_198_ok.png" /></li>
          <li><img src="img/icons/glyphicons_399_e-mail.png" /></li>
          <li><img src="img/icons/glyphicons_223_thin_right_arrow.png" /></li>
        </ul>

      </div><!-- END #maincolumn -->
      
    </article><!-- END .main -->

    <div class="swatches">
      
      <div class="colors">
	<ul>
	  <!--
	      To add more colors:
	      1. add an <li> here with a class of the color's name
	      2. add colors to the palette in _variables.scss
	      3. change $num-colors in _variables.scss
	    -->
	  <li class="primary">&nbsp;</li>
	  <li class="secondary">&nbsp;</li>
	  <li class="neutral">&nbsp;</li>
	</ul>
      </div><!-- END .colors -->
      
      <div class="details">
	<ul>
	  <li class="a">
	  </li>
	  <li class="b">
            <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Etiam porta sem malesuada magna mollis euismod. Maecenas sed diam eget risus varius blandit sit amet non.</p>
	  </li>
	  <li class="c">
	    <img src="img/main-image.jpg" alt="Rock!" />
	  </li>
	</ul>
      </div><!-- END .details -->
      
    </div><!-- END .swatches -->
    
    %include footer
    
  </div><!-- END .page -->    

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>

  <!-- these should all be minified and combined before a production release -->
  <script src="js/libs/util.js"></script>
  <script src="js/plugins.js"></script>
  <script src="js/script.js"></script>

  <script src="js/libs/bootstrap-button.js"></script>
  <script src="js/libs/bootstrap-collapse.js"></script>

  <script>
    var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
    s.parentNode.insertBefore(g,s)}(document,'script'));
  </script>
  <!--[if lt IE 7 ]>
    <script defer src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
    <script defer>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
  <![endif]-->
</body>
</html>
