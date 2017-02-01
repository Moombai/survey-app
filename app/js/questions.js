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
	var http = new XMLHttpRequest();
	http.open('GET', 'api.json');
	http.send();

	http.onload = function(){
	  var ourData = JSON.parse(http.responseText);
	  renderQuestionnaire(ourData); // Run function on the data object after successful JSON call 
	  prev.classList.add("u-hidden-visually");


	  var counter = 0; 

		//create a function that will show the next question on next button click
		next.addEventListener("click", function(){
			counter ++; 
			prev.classList.remove("u-hidden-visually");
			
			if (counter >= ourData.length - 1) {
				console.log("the end");
				this.classList.toggle("u-hidden-visually");
			}
			renderQuestionnaire(ourData, counter);
		});

		//previous button event 
		prev.addEventListener("click", function(){
			counter --; 
			
			if (counter <= 0) {
				console.log("We can return no further!");
				this.classList.toggle("u-hidden-visually");
	
			} else if(counter < ourData.length) {
				console.log("remove hidden");
				next.classList.remove("u-hidden-visually");
			}
			renderQuestionnaire(ourData, counter);
		});
	}
}

//Render the survey interface from scratch  
function renderQuestionnaire(data, value){
	var htmlString = "";
	var index = value || 0;


	htmlString += '<h5 id="heading">' + data[index].heading + '</h5>';

  for (i = 0; i < data[index].choices.length ; i++) {

  	htmlString += '<label class="block">'; 
  	htmlString += '<input type="radio" class="u-margin-right-tiny" name="radgroup" value="B">';
  	htmlString += data[index].choices[i].question;
    htmlString +=  '</label>'; 
  }

  form.innerHTML = htmlString;
 
}


//add event listeners for button elements 
var next = document.getElementById("btn-next");
var prev = document.getElementById("btn-prev");

var form = document.getElementById("myForm");
var title = document.getElementById("h1");



// next.addEventListener("click", getMyData);




