//Clear session store on page load or refresh
sessionStorage.clear();

var nextButton = document.getElementById("btn-next");
var prevButton = document.getElementById("btn-prev");
var resultButton = document.getElementById("btn-result");
var mainContentElement = document.getElementById("myForm");
var questionScores = [];

ready(runApplication);

//fire the javascript when the document has loaded 
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
  	console.log("Dom is loading");
    document.addEventListener('DOMContentLoaded', runApplication);
  }
}

function runApplication(){
	var http = new XMLHttpRequest();
	http.open('GET', 'api.json');
	http.send();

	http.onload = function(){ 
	  var jsonData = JSON.parse(http.responseText);
	  var currentPage = 0; 

	  renderQuestionnaire(jsonData);
	  buttonController(currentPage, jsonData);


		nextButton.addEventListener("click", function(){
			var inputSelection = getRadioInput(jsonData, currentPage); 
			if (inputSelection === true) {
				currentPage ++; 
				renderQuestionnaire(jsonData, currentPage);
				buttonController(currentPage, jsonData);
			} else {
				alert("Please make a selection!");
			}
		});

		prevButton.addEventListener("click", function(){
			currentPage --; 
			renderQuestionnaire(jsonData, currentPage);
			buttonController(currentPage, jsonData);
		});

		resultButton.addEventListener("click", function(){
			var inputSelection = getRadioInput(jsonData, currentPage); 
			if (inputSelection === true) {
				getRadioInput(jsonData, currentPage);
				renderResults(jsonData);
				this.classList.toggle("u-hidden-visually");
				prevButton.classList.add("u-hidden-visually");
			} else {
				alert("Please make a selection");
			}
		});
	}
}

//Render the survey interface   
function renderQuestionnaire(data, value){
	var htmlString = "";
	var index = value || 0;
	htmlString += '<h5 id="heading">' + data.questions[index].heading + '</h5>';

    for (i = 0; i < data.questions[index].choices.length ; i++) {
  	  htmlString += '<label class="block">';
  	  //value should be pulled from index object? It's static at the moment 
  	  htmlString += '<input type="radio" class="u-margin-right-tiny" name="radgroup">'; 
  	  htmlString += data.questions[index].choices[i].question;
      htmlString +=  '</label>'; 
    }
  mainContentElement.innerHTML = htmlString;
}

//Use JavaScript to add radio selection

//alert, no item selected if no element has been checked. 
function getRadioInput(data, page){
  var inputs = document.getElementsByTagName('input');
  var selected = false;
  var value = "";
  var index = page || 0;
  for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === 'radio' && inputs[i].checked) {
          // get value, set checked flag or do whatever you need to
        value = i + 1; 
        console.log(value);
        selected = true;
        break;
      }
  }
  sessionStorage.setItem(data.questions[index].page, value);
  return selected;
}



function renderResults(data){
	//add scores to array  
	for (var i = 0; i < sessionStorage.length; i++){
	questionScores.push(parseInt(sessionStorage.getItem(sessionStorage.key([i]))));
	}
	//run array method to show most represented answer 
	var totalScore = questionScores.reduce(function(a,b){
		return a + b; 
	}, 0);

	//render results 
	var text = '<p>';
	var image = '<img src=';

	if(totalScore <= 7) {
		text += "You are in terrible shape and need to make serious changes. Sort out your life, now!";
		image += data.images.slob;
	} else if (totalScore <= 14){
		text += "You're on the right track but could do more. Keep pushing!";
		image += data.images.middle;
	} else {
		text += "You really are in great shape, keep going!";
		image += data.images.healthy;
	}

	text += '</p>';
	image +='>'
	text += image;
	mainContentElement.innerHTML = text;
}

function buttonController(currentPage, data){
	if (currentPage === 0 ){
		prevButton.classList.add("u-hidden-visually");
		resultButton.classList.add("u-hidden-visually");

	} else if (currentPage === data.questions.length - 1) {
		resultButton.classList.remove("u-hidden-visually");
		prevButton.classList.remove("u-hidden-visually");
		nextButton.classList.add("u-hidden-visually");

	} else {
		resultButton.classList.add("u-hidden-visually");
		prevButton.classList.remove("u-hidden-visually");
		nextButton.classList.remove("u-hidden-visually");
	}
}





