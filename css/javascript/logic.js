
// Main Array and assigned value inside array 
var gif = {

    topicArray: ["monkey", "elephants", "bird", "lion", "ziraffe", "cat"],
        // Displays image state
        imgState: "still",
        //Array to hold new topics
        newTopicArray: [],
        //Function to populates Array default and creates buttons on page load.  
        generateDefaultButtons: function(items, action) {
            //Clears Data
            if (action == "rerender") {
                $("div#button-area").empty();
            }
            console.log("");
            console.log("var items inside of generateDefaultButtons(): " + items);
            console.log("");
            //get the parent element which will house the buttons
            var parent = $("div#button-area");
            //loop through array of topics and generate the default button list
            //gif.topicArray.forEach(function(item, index, arr) {
                items.forEach(function(item, index, arr) {
                //create button inside of li
                // var  = $('<li><button class="btn btn-default" data-topic="' + item + '">' + item + '&raquo; </button></li>');
                var div = $('<button class="button" data-topic="' + item + '"> ' + item + ' &raquo; </button>');
                //append li to parent
                parent.append(div);
            });
            },
        //function to generate new button
        generateNewButton: function(topic) {
            //FIRST CHECK TO SEE IF TOPIC ALREADY EXISTS.  IF SO DENY ADDITION
            if (gif.topicArray.indexOf(topic) !== -1) {
                alert("That topic alredy exists. Add something new instead.")
                return false;
            }
            //Push new topic onto main array, and temp array (will be used later for removing new topics)
            gif.topicArray.push(topic);
            gif.newTopicArray.push(topic);
            // Save the session storage
            sessionStorage.setItem("topicArray", gif.topicArray);

            //get the parent element which button will be prepeneded to 
            var parent = $("div#button-area");
            //create the new element button
            var div = $('<button class="button-area" data-topic="' + topic + '">' + topic + '&raquo; </button>')
                //Add button to the bottom of the list
                parent.prepend(div);
            },
        //function to generate gif content when the user clicks on a topic button
        generateGifs: function(topic) {

            // Get the parent element which content will be prepended to
            var parent = $("div#gif-content");
            // Make sure that the topic string is encoded properly (+ for spaces)
            var topic = encodeURIComponent(topic).replace(/%20/g, '+');

            // Establish query URL, metting GIPHY API requirements
            var queryUrl = "https://api.giphy.com/v1/gifs/search?q=funny+best+" + topic + "&api_key=dc6zaTOxFJmzC&limit=10";
            console.log("");
            console.log("queryUrl: " + queryUrl);
            console.log("");
            // AJAX call to get data
            $.ajax({
                url: queryUrl,
                method: "GET"
            }).done(function(returnData) {
                console.log("");
                console.log(returnData);
                console.log("");
                var stuff = "";

                // Loop through returnData.  Note:  is an object.  Must reference 'data' to access the array
                returnData.data.forEach(function(item, index, arr) {
                    // Make sure that there is text for rating.  If not, will throw off layout rows. Make all ratings upper-case for good presentation
                    var rating = (arr[index].rating == "") ? "N/A" : arr[index].rating.toUpperCase();

                    // Add all html into var stuff
                    stuff += '<div class="col-xs-6 col-sm-6 col-md-4 col-lg-3 placeholder">' +
                    '<img src="' + arr[index].images.fixed_height_still.url + '" data-still="' + arr[index].images.fixed_height_still.url + '" data-animate="' + arr[index].images.fixed_height.url + '" width="auto" height="200" class="img-responsive" alt="Generic placeholder thumbnail">' +
                    '<h4>Rating</h4>' +
                    '<span class="rating">' + rating + '</span>' +
                    '</div>';
                });

                // Throw stuff into main img container
                $('div#gif-content').html(stuff);
            })
        },

        changeImgUrl: function(img) {
            var url = (gif.imgState == "still") ? img.data("animate") : img.data("still");
            img.attr("src", url);
            //change the state to the alternative option, so that the next src will switch
            gif.imgState = (gif.imgState == "still") ? "animate" : "still";

        },


        clearStorage: function() {
            // First, check to see if storage is empty
            if (localStorage.getItem("topicArray") == null) {
                alert("There is no session data to clear out!");
            } else {
                localStorage.clear("topicArray");
                console.log("");
                console.log("localStorage was cleared!");
                console.log("");
                // Remove new items from original topic array
                gif.restoreTopicArray();
                // Return true so that generateDefaultButtons will only run after topicArray clearing has completed (else dupe error may trigger)
                return true;
            }
        },

        // Remove items in newTopicArray from original topicArray for restoring original topics list after "Clear Data" button is clicked by user
        restoreTopicArray: function() {
            // Run through each item in newTopicArray, removing matches found in topicArray (every item will match ALWAYS)
            gif.newTopicArray.forEach(function(item, index, arr) {
                var index = gif.topicArray.indexOf(item);
                if (index != -1) {
                    gif.topicArray.splice(index, 1);
                }
            });
            console.log("");
            console.log("topicArray after splice: " + gif.topicArray);
            console.log("");
        }
    }
    
    // Methods function calls
   $(document).ready(function() {

    // Generate the default buttons on page load. Check session storage first, and generate from there if != null
    var items = localStorage.getItem("topicArray");
    if (items != null) {
        console.log("localStorage topicArray != null!");
        items = JSON.parse(items);
        var action = null;
        gif.generateDefaultButtons(items, action);
    } else {
        console.log("localStorage topicArray == null!");
        var items = gif.topicArray;
        var action = null;
        gif.generateDefaultButtons(items, action);
    }

    // When the user clicks on the search icon, generate a new button
    $('#gifAddBtn').on('click', function(e) {
        // Get the input text. Trim out any white space
        var text = $('input.input-generate').val().trim();
        console.log("Input text: " + text);

        // Make sure the user enter input something
        if (text == "") {
            alert("You must enter a topic before continuing!");
            return false;
        }

        // Generate a new button with the user's input, and add topic to default and new topic arrays
        gif.generateNewButton(text);

        // Save entire topicArray to local storage
        localStorage.setItem("topicArray", JSON.stringify(gif.topicArray));
        console.log("localStorage topicArray: " + JSON.stringify(localStorage.getItem("topicArray")));
    });

    // When the user clicks on a topic button, generate the gifs
    $('#button-area').on('click', 'button', function(e) {
        console.log("Button was clicked!");

        // Get the data attribute of the button clicked
        var topic = $(this).data("topic");
        console.log("data-topic: " + topic);

        // Run the function to generate GIFs
        gif.generateGifs(topic);
    });

    // When the user clicks on an img, make it animate, or still
        $('div.main').on('click', 'img', function(e) {
            console.log("You clicked an img!");
            var img = $(e.target);
            gif.changeImgUrl(img);
            console.log("this: " + JSON.stringify(img));
        });

    // When user clicks on "Clear Data" button, clear the localStorage topic array if it exists
    $('button.clear-btn').on('click', function() {
        // Set action so that default button generation correctly empties out the buttons on the side panel
        var action = "rerender";
        // Wait until clearStorage returns true, and then generate the default buttons again
        if (gif.clearStorage()) {
            // Clears out the new topicArray items so that the error "Topic already exists" does not show
            gif.generateDefaultButtons(gif.topicArray, action);
        }
    });
});