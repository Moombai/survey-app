var quizMaster = (function quizModule() {
    "use strict";

    //Clear session store on page load or refresh
    sessionStorage.clear();

    var nextButton = document.getElementById("btn-next");
    var prevButton = document.getElementById("btn-prev");
    var resultButton = document.getElementById("btn-result");
    var restartButton = document.getElementById("btn-restart");
    var mainContentElement = document.getElementById("myForm");
    var quizBackground = document.querySelector(".survey-container");
    var currentPage = 0;
    var questionScores = [];

    var defaults = {
        theme: "theme-one",
        backButton: true,
        restartButton: true,
        questionCount: false,
        font: "default",
        fadeIn: true,
        json: './mock.json'
    }

    function init(updates) {
        updateDefaults(updates);
        makeAJAXCall("GET", defaults.json, runApplication);
    }

    //Run application 
    function runApplication(data) {
        var jsonData = JSON.parse(data);

        renderQuestionnaire(jsonData);
        buttonController(jsonData);
        // Split out into a bind events method
        bindEvents(jsonData);
    }

    function makeAJAXCall(methodType, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(methodType, url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseText);
            }
        }
        xhr.send();
    }

    function bindEvents(data) {
        nextButton.addEventListener("click", function() {
            var inputSelection = getRadioInput(data, currentPage);
            if (inputSelection === true) {
                currentPage++;
                renderQuestionnaire(data, currentPage);
                buttonController(data);
            } else {
                alert("Please make a selection!");
            }
        });

        prevButton.addEventListener("click", function() {
            currentPage--;
            renderQuestionnaire(data, currentPage);
            buttonController(data);
        });

        resultButton.addEventListener("click", function() {
            var inputSelection = getRadioInput(data, currentPage);
            if (inputSelection === true) {
                renderResults(data);
                this.classList.toggle("u-hidden-visually");
                prevButton.classList.add("u-hidden-visually");

                if (defaults.restartButton === true) {
                    restartButton.classList.remove("u-hidden-visually");
                }
            } else {
                alert("Please make a selection!");
            }
        });

        restartButton.addEventListener("click", function() {
            return window.location.reload();
        });
    }

    function renderQuestionnaire(data) {
        var htmlString = "";
        htmlString += '<h1 id="h1" class="title">' + data.title + '</h1>';

        //Add fadeIn class if true
        defaults.fadeIn === true ? htmlString += '<div class="fader">' : htmlString += '<div>';
        //Check for defaults value
        if (defaults.questionCount === true) {
            htmlString += '<p>Question ' + (currentPage + 1) + ' of ' + data.questions.length + '</p>';
        }

        htmlString += '<h5 id="heading">' + data.questions[currentPage].heading + '</h5>';

        for (var i = 0; i < data.questions[currentPage].choices.length; i++) {
            htmlString += '<label class="block">';
            htmlString += '<input type="radio" class="u-margin-right-tiny" name="radgroup">';
            htmlString += data.questions[currentPage].choices[i].question;
            htmlString += '</label>';
        }
        htmlString += '</div>';
        mainContentElement.innerHTML = htmlString;
    }

    function updateDefaults(args) {
        for (var prop in args) {
            if (args.hasOwnProperty(prop)) {
                defaults[prop] = args[prop];
            }
        }
        //Break the default into it's own function and add the function here 
        quizBackground.classList.add(defaults.theme);
        //Apply font based on user options
        if (defaults.font === "trebuchet") {
            document.body.classList.add("trebuchet");
        } else if (defaults.font === "lucida") {
            document.body.classList.add("lucida");
        }
        //Display back button if true
        if (!defaults.backButton) {
            prevButton.classList.add("hidden");
        }
    }

    //alert, no item selected if no element has been checked. 
    function getRadioInput(data, page) {
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

    function renderResults(data) {
        //add scores to array  
        for (var i = 0; i < sessionStorage.length; i++) {
            questionScores.push(parseInt(sessionStorage.getItem(sessionStorage.key([i]))));
        }
        //run array method to show most represented answer 
        var totalScore = questionScores.reduce(function(a, b) {
            return a + b;
        }, 0);

        //render results 
        var text = '<h1 id="h1" class="title">' + data.title + '</h1><p>';
        var image = '<img src=';

        //from JSON

        // Refactor data so that closer to
        // data.result.healthy.image
        // data.result.healthy.feedback
        if (totalScore <= 7) {
            text += data.feedback.poor;
            image += data.images.poor;
        } else if (totalScore <= 14) {
            text += data.feedback.average;
            image += data.images.average;
        } else {
            text += data.feedback.good;
            image += data.images.good;
        }

        text += '</p>';

        image += '>';
        text += image;
        mainContentElement.innerHTML = text;
    }

    //Controller decides if buttons are displayed 
    function buttonController(data) {
        if (currentPage === 0) {
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
        init: init
    };
})();