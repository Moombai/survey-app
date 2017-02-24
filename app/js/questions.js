//Ensure that users cannot move onto the next question without selecting an answer 
//Add a picture to the results page 
//Add a try again button?

//Ensure that session storage is clear on page load or refresh 
sessionStorage.clear();


//select HTML elements using JavaScript
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
	console.log("Dom is Ready!");
	var http = new XMLHttpRequest();
	http.open('GET', 'api.json');
	http.send();

	http.onload = function(){ 
	  var jsonData = JSON.parse(http.responseText);
	  //render survey interface on load
	  renderQuestionnaire(jsonData); 
	  prevButton.classList.add("u-hidden-visually");
	  resultButton.classList.add("u-hidden-visually");

	  //track questions page 
	  var currentPage = 0; 

		//next button event
		nextButton.addEventListener("click", function(){

			//add selection to session storage 
			whichInput(jsonData, currentPage); 

			currentPage ++; 
			prevButton.classList.remove("u-hidden-visually");
			
			if (currentPage >= jsonData.questions.length - 1) {
				console.log("the end");
				this.classList.toggle("u-hidden-visually");
				resultButton.classList.toggle("u-hidden-visually");
			}
			renderQuestionnaire(jsonData, currentPage);
		});

		//previous button event 
		prevButton.addEventListener("click", function(){
			currentPage --; 
			
			if (currentPage <= 0) {
				console.log("We can return no further!");
				this.classList.toggle("u-hidden-visually");
	
			} else if(currentPage < jsonData.questions.length) {
				nextButton.classList.remove("u-hidden-visually");
			}
			renderQuestionnaire(jsonData, currentPage);
		});

		resultButton.addEventListener("click", function(){
			whichInput(jsonData, currentPage);
			//process the results

			// retrieve session values before adding them to an array: 
			for (var i = 0; i < sessionStorage.length; i++){
			questionScores.push(parseInt(sessionStorage.getItem(sessionStorage.key([i]))));
			}

			//run array method to show most represented answer 
			var totalScore = questionScores.reduce(function(a,b){
				return a + b; 
			}, 0);

			console.log(totalScore);

			//render answer if sum is x return y if sum is a return b if sum is c return d blah blah
			renderResults(totalScore, jsonData);
			//hide prev button, hide result button 
			this.classList.toggle("u-hidden-visually");
			prevButton.classList.add("u-hidden-visually");

		})
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
function whichInput(data, page){
  var inputs = document.getElementsByTagName('input');
  var value = "";
  var index = page || 0;
  for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === 'radio' && inputs[i].checked) {
          // get value, set checked flag or do whatever you need to
        value = i + 1; 
        console.log(value);
        break;
      }
  }

  sessionStorage.setItem(data.questions[index].page, value);
  console.log(sessionStorage);
}

function renderResults(sum, data){
	//Add some content to say how the user scored 
	var text = '<p>';
	var image = '<img src=';

	if(sum <= 7) {
		text += "You are in terrible shape and need to make serious changes. Sort out your life, now!";
		image += data.images.slob;
	} else if (sum <= 14){
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
	//add a button to restart the quiz
}







