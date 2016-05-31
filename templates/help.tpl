<div id="help">
  <div id="description">
    <p>Q-TIP is a free online tool for quantitatively investigating people’s qualitative understanding of complex topics. It is based on Q-method, a social science research technique in which participants sort different statements about a topic by how much they agree with the statement. Q-TIP enables researchers to define shared viewpoints based on subjects’ responses to many questions about a single topic. A collection of useful resources on Q-method exists <a href="http://qmethod.org/howto">here</a>. </p>
      
    <p>
<h3>Frequently asked questions:</h3>

<div class="question">What is a Q study?</div>
<div class="answer"><p>A Q study consists of a set of statements that a researcher asks participants to sort into an array of columns based on how much they reflect the way participants think about a defined topic. For example, a Q-method study of patriotism in the US might include statements such as:</p>
	
  <ul>
    <li>“The bald eagle is an important symbol of American national identity,”</li>
    <li>“It should not be illegal to burn an American flag,” </li>
    <li>“Learning songs such as ‘America the Beautiful’ should be a mandatory part of elementary school education in the US.”</li>
  </ul>
 
  <p>The set of statements is a sample drawn from a larger “concourse” or suite of opinions that exist about the topic.</p>

  <p>Unlike a standard survey where each question can be answered independently of the other, Q-method forces participants to make choices among different statements – by sorting them into different columns – revealing how they rank and order their own beliefs about a topic. The aim of Q-method is to understand how suites of beliefs held by participants may correlate across the sample of concourse statements, rather than (as in traditional survey methods) to understand how single characteristics of participants may correlate across a population. This is useful in defining actual and nuanced similarities and differences between ostensibly different participants in debate over an issue (e.g. foresters and environmentalists). Q-TIP allows researchers to configure Q-sorts for any number of participants, to generate a small or large number of statements, and to specify different numbers of columns to sort statements into.</p>
  
  <p>A collection of useful resources on Q-method exists <a href="http://qmethod.org/howto">here</a>.</p>
</div>

<div class="question">How does a Q-TIP Q-sort work?</div>
<div class="answer">
  <ul>
    <li>Q-TIP will generate a unique URL for each participant, and researchers send each participant this link.</li> 
    <li>When a participant opens that page they see the "stack" of statements, much like the stack of cards in a real-life Q-sort, at the top of the web page.  They also see empty spaces in pre-set columns below. Their task is to click each statement and drag it to a spot.  </li>
    <li>The columns are laid out on an axis from "most describes how I feel" to "least describes how I feel.” The number of columns and the number of statement cards they can contain is customizable according to research needs. </li>
    <li>Participants can move statement cards between columns as long as there is space in the target column.  </li>
    <li>If the target column is full, the participant can move the statement card back to the stack and open up space in the desired column by moving its statement cards around. </li>
    <li>After they've placed all the statement cards from "least like I think" to "most like I think", they click "All Done!" and are taken to a page asking them to provide more input on the six statements they feel are most worth commenting on or explaining. </li>
    <li>Participants can always go back to the statement-ranking phase by clicking on "Change order". </li>
    <li>When they are done, they can click "Save Comments" and safely close their browser window. Their data (but not their identity) will be recorded in a spreadsheet accessible on your study’s configuration page. You can see a demo sort here [link to demo].</li>
  </ul>
</div>

<div class="question">How do I create a new study?</div>
<div class="answer">
  <ul>
    <li>Click <a href="/create">“create a new study”</a> (also on the homepage). You will need to provide some basic contact information. </li>
    <li>Once the new study has been created, you can specify the properties of the study on the method's detail configuration page.</li>
    <ul>
      <li>‘Columns' should contain a space-separated list of numbers, where each number sets the number of statements that each column will hold.  </li>
      <li>For example: 2 3 5 6 8 6 5 3 2 is a sort consisting of nine columns, in which the fifth column can hold eight statements.  </li>
      <li>'Statements' should contain the list of statements in the concourse, or all the statements you want respondents to sort. </li>
      <li>Each statement is on its own line, and must start with the statement number. (e.g. 1. The bald eagle is an important symbol of American national identity)  </li>
    </ul>
  </ul>
</div>

<div class="question">How do I create a new sort to send to a participant?</div>
<div class="answer">
  <ul>
    <li>Click “Create New Participant”. Q-TIP will generate  a unique link to a unique sort. </li>
    <li>You must email the link to your participant. </li>
    <li>Only someone with the sort-specific link will be able to access that sort.</li>
</div>

<div class="question">Is Q-TIP secure?</div>
<div class="answer"><p>Each study has its own unique URL (http://qsort.geography.wisc.edu/method/XXXXXX). There is no log-in mechanism. This means that the configuration page and participant sorts are only accessible to those who have the URL. Do not share your study’s URL with anyone outside of your research team. </p>
  <p>Each participant is sent their own unique URL, where they will sort your study’s statements. By keeping track of which URL is sent to which participant, you can link responses with participants.  This allows for safeguarding participants’ identities during the research, because their identity and their responses are not stored together. Participants will not enter ANY personal data online. When you see data saved from a given URL, you can connect that data with the participant by keeping a separate and secure file matching the two. A participants’ personal information is NEVER stored as part of this service. </p>
</div>

<div class="question">How do I collect the results?</div>
<div class="answer">Q-TIP allows three kinds of data to be collected. On the configuration page, you can download each participant’s layout, comments, and history in a spreadsheet (CSV) format.
  <ul>
    <li>The <i>layout</i> file indicates in which column each statement number was placed. </li>
    <li>The <i>comments</i> field is the collection of notes that participants make at the end of their sort concerning which statements were particularly provoking as well as which column they thought contained the statements they were most neutral about.  </li>
    <li>The <i>history</i> file is a record of each drag and drop of a statement a participant made. </li>
</div>
 
<div class="question">How do I analyze the results?</div>
<div class="answer">Q-method results are often analyzed using Principal Components Analysis, but Q-TIP does not provide an analysis tool. You should first download all of your participants’ layouts from the configuration page. Several statistics software packages designed specifically for Q-method are freely available on the web, most notably, <a href="http://schmolck.userweb.mwn.de/qmethod/">PQMethod. </a>
</div>

<div class="question">Can I tailor the comments section?</div>
<div class="answer">The comments section is not configurable at this time. 
</div>

<div class="question">Which browsers is Q-TIP currently compatible with?</div>
<div class="answer">Q-TIP is optimized for Google Chrome and Mozilla Firefox and is also compatible with Safari and Internet Explorer 9.0+
</div>

<div class="question">How do I delete a participant or sort?</div>
<div class="answer"><p>To prevent both accidental and unauthorized data loss, deleting data is not allowed through the application.</p></div>
  
<div class="question">The changes that I made to the method's statements are not showing up for an existing participant. Why is that?</div>
<div class="answer"><p>Once a participant starts a sort, the statements for that participant are locked.  A participant's sort is started after any statement is placed in a column. Generating a new participant should show the new statements. 
</p></div>

<div class="question">Something else isn't working. What do I do?</div>
<div class="answer">Unfortunately, we are unable to provide personalized help at this time. However, if you have found bugs in the program, please let us know and we will attempt to resolve the problem.
</div>

<div class="question">How do I contact you?</div>
<div class="answer">You can email <img src="/img/address.png" width="178">
</div>


    </p>
  </div>
</div>

%rebase layout title="Q-TIP: Help", active="help"
