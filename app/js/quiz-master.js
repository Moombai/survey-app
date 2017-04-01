var quizMaster = (function quizModule(){
	"use strict";

	//Clear session store on page load or refresh
	sessionStorage.clear();

	var nextButton = document.getElementById("btn-next");
	var prevButton = document.getElementById("btn-prev");
	var resultButton = document.getElementById("btn-result");
	var restartButton = document.getElementById("btn-restart");
	var mainContentElement = document.getElementById("myForm");
	var quizBackground = document.querySelector(".survey-container");

	var questionScores = [];

	var defaults = {
		theme: "theme-one",
		backButton: true,
		restartButton: true,
		questionCount: false,
		font: "default",
		fadeIn: true,
		json: './api.json'
	}

	//Override defaults with user options
	function runApplication(args){
	    for(var prop in args) {
	        if(args.hasOwnProperty(prop)){
	            defaults[prop] = args[prop];
	        }
	    }

	    //Apply theme based on user options
	    quizBackground.classList.add(defaults.theme);
	    //Apply font based on user options
	    if (defaults.font === "trebuchet") {
	    	document.body.classList.add("trebuchet");
	    } else if (defaults.font === "lucida") {
	    	document.body.classList.add("lucida");
	    }
	    //Display back button if true
	    if ( ! defaults.backButton ) {
	      prevButton.classList.add("hidden");	
	    }

		var http = new XMLHttpRequest();
		http.open('GET', defaults.json, true);
		http.send();

		http.onload = function(){ 
		  var jsonData = JSON.parse(http.responseText);
		  var currentPage = 0; 

		  renderQuestionnaire(jsonData, currentPage);
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
					renderResults(jsonData);
					this.classList.toggle("u-hidden-visually");
					prevButton.classList.add("u-hidden-visually");

					if (defaults.restartButton === true) {
						restartButton.classList.remove("u-hidden-visually");
					}
				} else {
					alert("Please make a selection!");
				}
			});

			restartButton.addEventListener("click", function(){
				return window.location.reload();
			})
		}
	}
 
	function renderQuestionnaire(data, value){
		var htmlString = "";
		var index = value || 0;
		htmlString += '<h1 id="h1" class="title">' + data.title + '</h1>';
		
		//Add fadeIn class if true
		defaults.fadeIn === true ? htmlString += '<div class="fader">' : htmlString += '<div>';
		//Check for defaults value
		if (defaults.questionCount === true) {
			htmlString += '<p>Question ' + (value + 1) + ' of ' + data.questions.length +  '</p>';
		}

		htmlString += '<h5 id="heading">' + data.questions[index].heading + '</h5>';

	    for (var i = 0; i < data.questions[index].choices.length ; i++) {
	  	  htmlString += '<label class="block">';
	  	  htmlString += '<input type="radio" class="u-margin-right-tiny" name="radgroup">'; 
	  	  htmlString += data.questions[index].choices[i].question;
	      htmlString +=  '</label>'; 
	    }
	    htmlString += '</div>';
	  mainContentElement.innerHTML = htmlString;
	}


	//alert, no item selected if no element has been checked. 
	function getRadioInput(data, page){
	  var inputs = document.getElementsByName('radgroup');
	  var selected = false;
	  var value = "";
	  var index = page || 0;
	  for (var i = 0; i < inputs.length; i++) {
	      if (inputs[i].type === 'radio' && inputs[i].checked) {
	          // get value, set checked flag or do whatever you need to
	        value = i + 1; 
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
		var text = '<h1 id="h1" class="title">' + data.title + '</h1><p>';
		var image = '<img src=';

		//from JSON
		if(totalScore <= 7) {
			text += data.feedback[0];
			image += data.images.slob;
		} else if (totalScore <= 14){
			text += data.feedback[1];
			image += data.images.middle;
		} else {
			text += data.feedback[2];
			image += data.images.healthy;
		}

		text += '</p>';

		image +='>';
		text += image;
		mainContentElement.innerHTML = text;
	}

	//Controller decides if buttons are displayed 
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

	return {
		init: runApplication
	}
})();



