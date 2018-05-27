$(document).ready(function(){

    var game = document.getElementById("game");
    console.log(game);

    var wordArray = ["cat", "frog", "horse", "dinosaur", "seahorse"];

    var UserGuess = 
    {
        guess: "",
        guessString: "",
        displayArray: [],
        count: 0
    }

    // set up, clear counts
    var wins = 0;
    var losses = 0;
    var currentGame = 0;

    resetGame(UserGuess, wordArray, currentGame);

    document.onkeyup = function(event) 
    {
        var play = event.key;
        UserGuess.guess = play.toLowerCase();
        console.log(play);

        console.log("Word we're guessing", wordArray[currentGame]);

        if (playTheGame(UserGuess, wordArray[currentGame]))
        {
            // Won
            wins++;

            console.log("You win!!");
            document.getElementsByTagName("H2")[0].setAttribute("class", "seeit");

            currentGame++;   // Increase the current game counter

            // No more words to guess, so game is over
            if (resetGame(UserGuess, wordArray, currentGame) == false)
                    console.log("No more words - Game over");

            console.log("New game display array after reset = ", UserGuess.displayArray);
            console.log("New guess string", UserGuess.guessString);
        }
        else // Didn't win this time
        {
            // Check guesses
            if (UserGuess.count <= 4)
            {
                // Not out of guesses
                console.log("Still can play");
            }
            else
            {   // Out of guesses
                console.log(UserGuess.count);
                console.log("game over");
                losses++;

                // Need to display the whole word, so convert it back
                convertToArray(UserGuess, wordArray[currentGame], false);

                console.log("Lost word display", UserGuess.displayArray);

                displayIt(UserGuess, wins, losses);

                console.log("You lose!!")
                document.getElementsByTagName("H3")[0].setAttribute("class", "seeit");

                currentGame++;   // Increase the current game counter

                // No more words to guess, so game is over
                if (resetGame(UserGuess, wordArray, currentGame) == false)
                        console.log("No more words - Game over");
            }
        }


    }

    function playTheGame(UserGuess, word, guessString)
    {
        var arrayElement;
        // var winner = false;

        console.log(word);
        console.log(UserGuess.guess);

        UserGuess.guess = UserGuess.guess.toLowerCase();  // Change to lower case
        console.log(UserGuess.guess);
        console.log(word);

        // If they won or lost last time, this will clear the winner/loser tag
        // This is very hacky, but works
        document.getElementsByTagName("H2")[0].setAttribute("class", "hideit");
        document.getElementsByTagName("H3")[0].setAttribute("class", "hideit");

        // Find it in the word array
        arrayElement = word.indexOf(UserGuess.guess);
        console.log(arrayElement);

        if (arrayElement != -1)   // Guess is good!
        {
            if (UserGuess.displayArray.indexOf(UserGuess.guess) == -1)
            {   
                // Haven't guessed this before
                console.log("Good guess");
                UserGuess.displayArray[arrayElement] = UserGuess.guess;
                console.log(UserGuess.displayArray);
            }

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
            // Guessed before?
            if (UserGuess.guessString.indexOf(UserGuess.guess) == -1)
            {   
                // Haven't guessed this before
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
        // Conversion flag - if true, then convert to dashes, if false, then convert to word

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

        // Check if out of word
        if (games >= wordArray.length)
        {
            return false;   // No more words
        }
        convertToArray(userGuess, wordArray[games], true);
        console.log("New word:", wordArray[games]);
        console.log("New word display: ", userGuess.displayArray);


    }

    function displayIt(userGuess, wins, losses)
    {
        var displayIt;

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
