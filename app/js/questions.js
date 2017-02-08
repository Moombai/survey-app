//select HTML elements using JavaScript
var next = document.getElementById("btn-next");
var prev = document.getElementById("btn-prev");
var form = document.getElementById("myForm");


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
	  //render survey interface on load
	  renderQuestionnaire(ourData); 
	  prev.classList.add("u-hidden-visually");

	  //track questions page 
	  var counter = 0; 

		//next button event
		next.addEventListener("click", function(){

			//add selection to session storage 
			whichInput(ourData, counter); 

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
				next.classList.remove("u-hidden-visually");
			}
			renderQuestionnaire(ourData, counter);
		});
	}
}

//Render the survey interface   
function renderQuestionnaire(data, value){
	var htmlString = "";
	var index = value || 0;


	htmlString += '<h5 id="heading">' + data[index].heading + '</h5>';

    for (i = 0; i < data[index].choices.length ; i++) {

  	  htmlString += '<label class="block">';
  	  //value should be pulled from index object? It's static at the moment 
  	  htmlString += '<input type="radio" class="u-margin-right-tiny" name="radgroup" value="B">'; 
  	  htmlString += data[index].choices[i].question;
      htmlString +=  '</label>'; 
    }

  form.innerHTML = htmlString;
 
}

//Use JavaScript to add radio selection

//alert, no item selected if no element has been checked. 
function whichInput(data, count){
  var inputs = document.getElementsByTagName('input');
  var value = "";
  var index = count || 0;
  for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === 'radio' && inputs[i].checked) {
          // get value, set checked flag or do whatever you need to
        value = i + 1; 
        console.log(value);
        break;
      }
  }

  sessionStorage.setItem(data[index].page, value);
  console.log(sessionStorage);
}

// retrieve session values before adding them to an array: 
// for (var i = 0; i < sessionStorage.length; i++){
// myArray.push(sessionStorage.getItem(sessionStorage.key(1)));
// }






