$(document).ready(function(){

    var game = document.getElementById("game");
    console.log(game);

    var wordArray = ["horse", "frog", "cat", "monkey", "dinosaur", "rabbit"];
    var imageArray = ["assets/images/horse.jpg", "assets/images/frog.jpg", "assets/images/kitty.jpg", 
    "assets/images/monkey.jpg", "assets/images/dino.jpg", "rabbit.jpg"];

    var UserGuess = 
    {
        guess: "",
        guessString: "",
        displayArray: [],
        lastWordLength: 0,
        count: 0
    }

    // set up, clear counts
    var wins = 0;
    var losses = 0;
    var currentGame = 0;
    var letters = "abcdefghijklmnopqrstuvwxyz";

    resetGame(UserGuess, wordArray, currentGame);

    document.onkeyup = function(event) 
    {
        var play = event.key;
        UserGuess.guess = play.toLowerCase();
        console.log(play);

        console.log("Word we're guessing", wordArray[currentGame]);

        // Only take characters
        if (letters.indexOf(UserGuess.guess) > -1)
        {
            // Main game logic
            if (playTheGame(UserGuess, wordArray[currentGame]))
            {
                // Won
                wins++;

                console.log("You win!!");
                // Show animal picture
                document.getElementsByTagName("IMG")[0].setAttribute("src", imageArray[currentGame]);
                // Show winner 
                document.getElementsByTagName("H2")[0].setAttribute("class", "seeit"); 

                currentGame++;   // Increase the current game counter

                resetGame(UserGuess, wordArray, currentGame);

                console.log("New game display array after reset = ", UserGuess.displayArray);
                console.log("New guess string", UserGuess.guessString);
            }
            else // Didn't win this time
            {
                // Check guesses - I give them 7
                if (UserGuess.count <= 6)
                {
                    // Not out of guesses
                    console.log("Still can play");
                }
                else
                {   // Out of guesses
                    console.log(UserGuess.count);
                    console.log("game over");

                    losses++;

                    // They lost, so Need to display the whole word and convert dashes back to real word
                    convertToArray(UserGuess, wordArray[currentGame], false);

                    console.log("Lost word display", UserGuess.displayArray);

                    displayIt(UserGuess, wins, losses);

                    console.log("You lose!!")
                    // Show loser text
                    document.getElementsByTagName("H3")[0].setAttribute("class", "seeit");

                    currentGame++;   // Increase the current game counter

                    // Reset the game
                    resetGame(UserGuess, wordArray, currentGame);
                }
            }

            // Check if there's amy more words to guess
            if (currentGame >= wordArray.length)
            {
                // No more words to guess
                displayIt(UserGuess, wins, losses);
                document.getElementsByTagName("IMG")[0].setAttribute("src", "assets/images/over.jpg");
            }
        }
    }

    function playTheGame(UserGuess, word, guessString)
    {
        var arrayElement;

        console.log(word);
        console.log(UserGuess.guess);

        UserGuess.guess = UserGuess.guess.toLowerCase();  // Change to lower case
        console.log(UserGuess.guess);
        console.log(word);

        // If they won or lost last time, this will clear the winner/loser tag
        // This is very hacky, but works
        document.getElementsByTagName("H2")[0].setAttribute("class", "hideit");
        document.getElementsByTagName("H3")[0].setAttribute("class", "hideit");

        // Find guess letter in the word array
        arrayElement = word.indexOf(UserGuess.guess);
        console.log(arrayElement);

        if (arrayElement != -1)   // Guess is good!
        {
            if (UserGuess.displayArray.indexOf(UserGuess.guess) == -1)
            {   
                // Haven't guessed this before.  Stuff into the display
                console.log("Good guess");

                // Loops through to get all occurences of the letter in the word
                while (arrayElement > -1) {  
                    UserGuess.displayArray[arrayElement++] = UserGuess.guess;
                    arrayElement = word.indexOf(UserGuess.guess, arrayElement);
                }

                console.log(UserGuess.displayArray);
            }

            // If there are no more dashes in the display array, then they won
            if (UserGuess.displayArray.indexOf("_") == -1)
            {
                console.log("Won the game");

                //Won the game
                displayIt(UserGuess, wins, losses);
                return true;
            }
        }
        else  // Guess is bad
        {
            // Check if we've guessed this letter before
            if (UserGuess.guessString.indexOf(UserGuess.guess) == -1)
            {   
                // Haven't guessed this before, so add it to the letters guessed string
                UserGuess.guessString = UserGuess.guessString + " " + UserGuess.guess;
                UserGuess.count++;
                console.log(UserGuess.guessString);
            }
        }

        displayIt(UserGuess, wins, losses);

        console.log("Guesses: ", UserGuess.guessString);
        console.log("Tries: ", UserGuess.count);

    }

    function convertToArray(UserGuess, word, conversionFlag)
    {
        // Conversion flag - if true, then convert to dashes since it's a reset
        // If false, then convert to word to display so they can see the word they missed

        console.log("Converting this word", word);

        // Make an array of chars
        for (var i = 0; i < word.length; i++)
        {
            if (conversionFlag)
            {
                UserGuess.displayArray[i] = "_";
            }
            else
            {
                console.log("Converting this char: ", word.charAt(i));
                UserGuess.displayArray[i] = word.charAt(i);
            }
        }
    }

    function resetGame(userGuess, wordArray, games)
    {
        userGuess.count = 0;
        userGuess.guess = "";
        userGuess.guessString = "";

        console.log("Total number of games: ", wordArray.length);
        console.log("This game: ", games);

        // Check if out of words
        if (games >= wordArray.length)
        {
            return false;   // No more words
        }

        // This figures out if the last guessed word is longer than the current word
        // We'll need to clean out the display array if the last word was longer
        let extraSpace = UserGuess.lastWordLength - wordArray[games].length;

        console.log("Extra space: ", extraSpace);

        if (extraSpace > 0)  // Fill with extra spaces if last word was long
        {
            for (var i = wordArray[games].length; i < wordArray[games].length + extraSpace; i++)
            {
                UserGuess.displayArray[i] = " ";
            }
        }

        // Make a display word with dashes
        convertToArray(userGuess, wordArray[games], true);
        UserGuess.lastWordLength = wordArray[games].length;

        console.log("New word:", wordArray[games]);
        console.log("New word display: ", userGuess.displayArray);

    }

    function displayIt(userGuess, wins, losses)
    {
        var displayIt;

        // This converts array comma delimination to spaces for display to user
        displayIt = UserGuess.displayArray.join(" ");

        document.getElementById("wordToGuess").innerHTML = displayIt;

        game.innerHTML = `
            <div>You entered: ${UserGuess.guess}</div>
            <div>Guesses: ${UserGuess.guessString}</div>
            <div>Guesses: ${UserGuess.count}</div>
        `
        gamestats.innerHTML = `
            <div>Wins: ${wins}</div>
            <div>Losses: ${losses}</div>
        `
    }
});
