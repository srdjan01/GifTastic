      var animals = [];

      // Function for dumping the JSON content for each button into the div
      function displayAnimalInfo() {


        // YOUR CODE GOES HERE!!! HINT: You will need to create a new div to hold the JSON.
        alert($(this).text());
        
      }

      // Function for displaying animal data
      function renderButtons() {

        // Deleting the buttons prior to adding new movies
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();

        // Looping through the array of animals
        for (var i = 0; i < animals.length; i++) {

          // Then dynamicaly generating buttons for each movie in the array
          // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          var a = $("<button>");
          // Adding a class of animal to our button
          a.addClass("animal");
          // Adding a data-attribute
          a.attr("data-name", animals[i]);
          // Providing the initial button text
          a.text(animals[i]);
          // Adding the button to the buttons-view div
          $("#buttons-view").append(a);
        }
      }

      // This function handles events where one button is clicked
      $("#add-animal").on("click", function(event) {
        event.preventDefault();

        // This line grabs the input from the textbox
        var animal = $("#animal-input").val().trim();

        // The animal from the textbox is then added to our array
        animals.push(animal);

        // Calling renderButtons which handles the processing of our movie array
        renderButtons();

      });

      // Generic function for displaying the animal Info
      $(document).on("click", ".movie", displayAnimalInfo);

      // Calling the renderButtons function to display the intial buttons
      renderButtons();