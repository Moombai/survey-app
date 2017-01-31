//fire the javascript when the document has loaded 
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
  	console.log("Dom is loading");
    document.addEventListener('DOMContentLoaded', weAreReady);
  }
}

ready(weAreReady);

function weAreReady(){
	console.log("Dom is Ready!");
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'api.json');

	xhr.onload = function(){
	  var ourData = xhr.responseText;
	  renderQuestionnaire(ourData); // Run function on the data object after successful JSON call 
	}

	xhr.send();
}

//Render the survey interface from scratch  
function renderQuestionnaire(data){
	var parsed = JSON.parse(data);
	var htmlString = "";

	htmlString += '<h5 id="heading">' + parsed[0].heading + '</h5>';

  for (i = 0; i < parsed[1].choices.length ; i++) {

  	htmlString += '<label class="block">'; 
  	htmlString += '<input type="radio" class="u-margin-right-tiny" name="radgroup" value="B">';
  	htmlString += parsed[0].choices[i].question;
    htmlString +=  '</label>'; 
  }

  form.insertAdjacentHTML('beforeend', htmlString);
}



//add event listeners for button elements 
var next = document.getElementById("btn-next");
var prev = document.getElementById("btn-prev");
var head = document.getElementById("heading");
var question = document.getElementById("question");
var form = document.getElementById("myForm");
var title = document.getElementById("h1");


//create a function that will show the next qustion on next button click


// next.addEventListener("click", getMyData);




