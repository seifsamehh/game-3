$(document).ready(function(){

    // winning combinations
    var winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [2, 5, 8],
        [1, 4, 7]
    ];

    var playerToken;
    var cpuToken;

    var playerShots = []; // holds all shots played by the user
    var cpuShots = []; // holds all shots played by the computer
    var allShots = []; // holds all the shots played in any single game

    var currentShot; // the current shot, regardless of player

    var playerTurn; // controls whether it is the player's turn or computer's turn
    var winner; // set to true if there is a winner then the game ends
    var inPlay; // determines whether the game is in play

    window.setTimeout(function(){
        init();
    }, 1000);

    // event handler for user to take their turn on a cell
    $('.cell').on('click', function(){
        if(playerTurn && inPlay){    

            // get id of selected cell, check if available, and if so mark the cell and pass id to an array of shots played
            currentShot = $(this).attr('id');
            if(allShots.indexOf(currentShot) === -1){
                this.innerHTML = playerToken;
                allShots.push(currentShot);
                playerShots.push(currentShot);
                        
                // check against shots played against winning combinations, but only after 3 shots are taken
                if(playerShots.length >= 3){
                    // check if there's a winner
                    checkWinCombos(playerShots);

                    // if there's a winner then end game and show modal
                    if(winner){
                        window.setTimeout(function(){
                            $('.modal').removeClass('removePopup');
                            $('.modal').css('background-color','#2ecc71');
                            $('.resultText').text('Win!');
                        }, 250);
                    } 
                }
            playerTurn = false;
            checkDraw();
            window.setTimeout(function(){
              cpuPlay();
            }, 500);
            }
        };
    });

    $('.replay-btn').on('click', function(){
        //remove modal
        $('.modal').addClass('removePopup');
        //clear game board
        $('.cell').text('');
        //reset game variables
        init()
        //pick tokens

    });

    function chooseToken(){
        // make the new game modal pop up
        $('.tokens').removeClass('removePopup');
        // set event handler for token choice buttons - pick token, remove modal, then play
        $('.token').on('click', function(){
            playerToken = $(this).attr('id');
            if(playerToken === 'X'){
                cpuToken = 'O';
            } else {
                cpuToken = 'X';
            }
            inPlay = true;
            playerTurn = true;
            $('.tokens').addClass('removePopup');
        });       
    }

    function init(){
        winner = false;
        playerShots = [];
        cpuShots = []; 
        allShots = [];
        chooseToken();
    }

    function checkWinCombos(arr){
        var tempArr = arr.map(Number); // converts all numbers in shots array from string types to number types
        winCombos.forEach(function(element){
            if(tempArr.indexOf(element[0]) >= 0 && tempArr.indexOf(element[1]) >= 0 && tempArr.indexOf(element[2]) >= 0){
                winner = true;
                inPlay = false;
            }
        });   
    };

    function checkDraw(){
        if(allShots.length === 9 && !winner){
            inPlay = false;
            window.setTimeout(function(){
                $('.modal').removeClass('removePopup');
                $('.modal').css('background-color','#0b8ca5');
                $('.resultText').text('Draw');
            }, 250);
        }
    }

    function cpuPlay(){
        if(!playerTurn && inPlay){
            // code for taking the computer's turn
            // simple random choice algorithm for now...
            function random(){
                var possibleShot = Math.floor(Math.random() * 9);
                if(!allShots.includes(String(possibleShot))){
                    currentShot = possibleShot;
                } else {
                    random();
                }  
            };

            random();

            if(allShots.indexOf(String(currentShot)) === -1){
                $('#'+currentShot).text(cpuToken);
                allShots.push(String(currentShot));
                cpuShots.push(String(currentShot));
                
                if(cpuShots.length >= 3){
                    checkWinCombos(cpuShots);
                    if(winner){
                        window.setTimeout(function(){
                            $('.modal').removeClass('removePopup');
                            $('.modal').css('background-color','#c0392b');
                            $('.resultText').text('Lose...');
                        }, 250);
                    } 
                }
            checkDraw();
            playerTurn = true;
            }
        }
    }
});