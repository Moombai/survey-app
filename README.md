# Survey-App
A native JavaScript Questionnaire designed to be flexible enough to plug into any existing web page. It comes with a number of options which can be used to change the look and feel of the application.  

## Built With:
* [Javascript](http://api.jquery.com/) for AJAX calls and DOM manipulation  
* [Gulp](http://gulpjs.com/) to build develop environment and production
* [Inuit](https://github.com/inuitcss) for basic styling and responsive width
* [Sass](http://sass-lang.com/) as a pre-processor for the CSS.

## Requirements
- NodeJS and NPM are needed to build and run this project 

## Installation 
- Navigate to your directory of choice 
- In the terminal enter: `git clone https://github.com/Moombai/survey-app.git`
- Run **npm install** 

The development environment can be built with the default gulp task. Gulp will compile any Sass, open in the browser and watch for any changes to html/css/javascript.

To create a production folder with minfied JavaScript and CSS run:  
```
gulp build 
```
## Usage 
To initialize the questionnaire call `quizMaster.init()` in the **index.js** file:  
```
quizMaster.init({
    //Options here 
});
```
## Options
The questionnaire can be initialized without any arguments however the following options are provided:

- **theme** (String) Default "theme-one"; - A second theme is provided as "theme-two"
- **backButton** (Boolean) Default: true; - Indicate whether a back button is required 
- **restartButton** (Boolean) Default: true; - If true a restart button will display at the end of the quiz
- **questionCount** (Boolean) Default: false;- A question counter will display if required  
- **font** (String) Default: "trebuchet";- "lucida" font can be provided as an alternative 
- **fadeIn** (Boolean) Default: true;- Questions will fade in if true 

### Example 
```
quizMaster.init({
	theme: "theme-two",
	backButton: true,
	font: "trebuchet",
	fadeIn: true
});
```