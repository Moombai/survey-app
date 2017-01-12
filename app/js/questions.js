// request JSON data 
var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'api.json');

ourRequest.onload = function(){
  console.log(ourRequest.responseText);
}

ourRequest.send();