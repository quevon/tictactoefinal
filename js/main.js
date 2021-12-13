// import {gameCharacterConfirmHTML} from './playerConfirm.js';


// console.log(gameCharacterConfirmHTML);
// Global variables
const defConfig = {
    "playerCharDef": "def",
    "playerCharCust": "custom",
    "playerOneCharacter": "X",
    "playerTwoCharacter": "O",
    "playerOneColor": "#bec8c9",
    "playerTwoColor": "#b2a094",
    "defaultBkgd": "#252b31",
    "gameModePvp": "PvP",
    "gameModePvBot": "Bot"  
}

let playerCharacters  = defConfig.playerCharDef
let playerOneCharacter = defConfig.playerOneCharacter
let playerTwoCharacter =  defConfig.playerTwoCharacter
let playerOneColor = defConfig.playerOneColor
let playerTwoColor =  defConfig.playerTwoColor
let defaultBkgd  =  defConfig.defaultBkgd
let isPlaying = false
let hotFixNext = false

//Random Charachters
let randomCharac = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_+=[]{};<>,.?/|'";

//Bot Timeout in Seconds
//All are inclusive
let minTime = 2
let maxTime = 5

//Game Status
let alreadywin = false
let alreadytie = false

//Player Status
let input_total = 0
let current_playing = 1;
let previous_character
let current_character;

//Arrays
let game_history = []
let moves = []
let tempMoves = []
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

//Load first template on Load
document.addEventListener("DOMContentLoaded", gameModeFunc)

//Content Loaders
function gameModeFunc(){

    bodyContentReplace(gameModeHTML)

    document.getElementById("mode_pvp").addEventListener("click", function(){

        gameMode =  defConfig.gameModePvp
        document.title += " - " + gameMode

        characterCreationFunc()

    })

    document.getElementById("mode_pvbot").addEventListener("click", function(){

        gameMode =  defConfig.gameModePvBot
        document.title += " - " + gameMode

        characterCreationFunc()

    })
}


function characterCreationFunc(){

    bodyContentReplace(gameCharacterHTML)

    document.getElementById("game_title").textContent += " - " + gameMode

    let defCharacterSelection = document.getElementsByClassName("player_character")

       //Player default Selection
    for (let x = 0; x < defCharacterSelection.length; x++) {

    defCharacterSelection[x].addEventListener("click", function () {

        playerCharacters = defConfig.playerCharDef

        playerOneCharacter = defCharacterSelection[x].textContent.trim()

        playerOneSelected()

    })}

    document.getElementById("nav_custom_character").addEventListener("click", function(){

        customCharacFunc()

    })
}

function playerOneSelected(){

    if (playerOneCharacter == defConfig.playerOneCharacter){
        playerTwoCharacter = defConfig.playerTwoCharacter
    }else{
        playerTwoCharacter = defConfig.playerOneCharacter
    }

    playerOneColor = defConfig.playerOneColor
    playerTwoColor = defConfig.playerTwoColor

    playerConfirFunc()
}
//for custom character of player
function customCharacFunc(){

    bodyContentReplace(gameCustomCharactHTML)
    document.getElementById("character_custom_one").value = playerOneCharacter
    document.getElementById("character_custom_two").value = playerTwoCharacter
    document.getElementById("nav_input_custom_cancel").addEventListener("click", function(){
        if(isPlaying == false){
            characterCreationFunc()
        }else(
            showPreviousGameFunc(game_history.length - 1)
        )
    })
    document.getElementById("nav_input_custom_rdn").addEventListener("click", playerRandomizerFuc)
    document.getElementById("nav_input_custom_confirm").addEventListener("click", function(){
        let custom_one = document.getElementById("character_custom_one").value.trim()
        let custom_two = document.getElementById("character_custom_two").value.trim()
       
        if (custom_one == custom_two) {
            alert("Player character must not be the same!")
        }else if(custom_one == "" || custom_two == ""){ 
             alert("One or both character is empty!")
        }else {
            playerOneCharacter = custom_one
            playerTwoCharacter = custom_two
            playerCharacters = defConfig.playerCharCust
            playerConfirFunc()
        }
    })


}

function playerConfirFunc (){
 
    const gameCharacterConfirmHTML = 
                                `<div  class="main_board" id="confirm_grid">
                                    <div class="child_board" id="confirm_child"> 
                                        <p id="game_title">Player Character</p>   
                                        <p id="selected_one">Player One : ${playerOneCharacter}</p>
                                        <br>
                                        <p id="selected_two">Player Two : ${playerTwoCharacter}</p>
                                        <br>
                                        <ul class="concan">
                                            <li id="charac_cancel">
                                                CANCEL
                                            </li>
                                            <li  id="charac_confirm">
                                                CONFIRM
                                            </li>
                                        </ul>
                                    </div>
                               </div>`
     bodyContentReplace(gameCharacterConfirmHTML)

    document.getElementById("charac_cancel").addEventListener("click", function(){

        if (playerCharacters == defConfig.playerCharCust){

            customCharacFunc()

        }else{

            characterCreationFunc()
        }
    })

    document.getElementById("charac_confirm").addEventListener("click", function(){
       
        if(isPlaying == false){

            current_character = playerOneCharacter

            isPlaying = true
            
            mainBoardFunc()

        }else(

            showPreviousGameFunc(game_history.length - 1)
       
        )
    })
}
//mainboard
function mainBoardFunc(){

    bodyContentReplace(gameMainBoardHTML)

    if(!(alreadytie || alreadywin)){

        saveInputHistoryFunc()
    }

    startFadeIn(0);

    document.getElementById("nav_header").style.visibility = "hidden"
    document.getElementById("nav_footer").style.visibility = "hidden"

    let player_turn = document.getElementById("main_title_holder")
    let box_area = document.getElementsByClassName("box_area")
    let input_grid = document.getElementsByClassName("inner_area")

    player_turn.textContent = `${playerOneCharacter} is playing.`
    player_turn.style.color = playerOneColor

    for (let boxnum = 0; boxnum < box_area.length; boxnum++) {

        box_area[boxnum].addEventListener("click", function () {

            if (alreadywin || alreadytie){
    
                player_turn.textContent = `The game has already ended.`

            }else  if(current_character == playerTwoCharacter && 
                gameMode == defConfig.gameModePvBot){
               
                    player_turn.textContent = `The bot is playing.`

            }else {

                boardClickHandler(boxnum)
            }

        })
    }

    for (let boxnum = 0; boxnum < box_area.length; boxnum++) {

        box_area[boxnum].addEventListener("mouseover", function () {
          
                if (!(alreadywin || alreadytie || input_grid[boxnum].innerHTML != "") && 
                     !(current_character == playerTwoCharacter && 
                        gameMode == defConfig.gameModePvBot)) {

                    if (current_character == playerOneCharacter) {

                        box_area[boxnum].style.backgroundColor = playerOneColor
                        input_grid[boxnum].innerHTML = playerOneCharacter

                    } else {

                        box_area[boxnum].style.backgroundColor = playerTwoColor
                        input_grid[boxnum].innerHTML = playerTwoCharacter
                    }

                    box_area[boxnum].style.opacity = ".5"
                }
            
        })
    }

    for (let boxnum = 0; boxnum < box_area.length; boxnum++) {

        box_area[boxnum].addEventListener("mouseleave", function () {

            box_area[boxnum].style.opacity = "1"
         
                if (!(alreadywin || alreadytie) && !(current_character == playerTwoCharacter && 
                    gameMode == defConfig.gameModePvBot)){

                    let itemHoverChecker = tempMoves.find(item => item.board_loc == boxnum)

                    if (!itemHoverChecker) {

                        box_area[boxnum].style.backgroundColor = defaultBkgd
                        input_grid[boxnum].innerHTML = ""
                    }
                }
        })
    }

    //Upper Navigator
    document.getElementById("nav_game").addEventListener("click", function () {

        showGameHistoryFunc()

    })

    //Lower Navigator
    document.getElementById("nav_prev").addEventListener("click", function () {

        input_total--
        displayBoardHistoryFunc(input_total - 1 )
        showNavigatorsHandler()

    })

    document.getElementById("nav_reset").addEventListener("click", function () {
        
        gameResetFunc()

    })

    document.getElementById("nav_next").addEventListener("click", function () {

        displayBoardHistoryFunc(input_total)
        input_total++
        showNavigatorsHandler()
       
    })
}
//Game Bot
function gameBot(){

    let emptyBox = []
    let gridLoc 
    let input_grid = document.getElementsByClassName("inner_area")

    for (let index = 0; index < input_grid.length; index++) {
        
        if (input_grid[index].textContent == ""){
            
            emptyBox.push(index)
        }  
    }
    if (emptyBox != 0){
        gridLoc = emptyBox[Math.floor(Math.random() * emptyBox.length | 0)]

        document.getElementsByClassName("box_area")[gridLoc].style.backgroundColor = playerTwoColor
        document.getElementsByClassName("inner_area")[gridLoc].innerHTML = playerTwoCharacter

        boardClickHandler(gridLoc)
    }
}
//Helpers
function bodyContentReplace(htmlTemplate){

    document.body.innerHTML = ""
    document.body.innerHTML += htmlTemplate;

}

function boardClickHandler(boxAreaNum){

    switch (boxAreaNum) {
        case 0:
            inputChecker(boxAreaNum, 0, 0)
            break;
        case 1:
            inputChecker(boxAreaNum, 0, 1)
            break;
        case 2:
            inputChecker(boxAreaNum, 0, 2)
            break;
        case 3:
            inputChecker(boxAreaNum, 1, 0)
            break;
        case 4:
            inputChecker(boxAreaNum, 1, 1)
            break;
        case 5:
            inputChecker(boxAreaNum, 1, 2)
            break;
        case 6:
            inputChecker(boxAreaNum, 2, 0)
            break;
        case 7:
            inputChecker(boxAreaNum, 2, 1)
            break;
        case 8:
            inputChecker(boxAreaNum, 2, 2)
            break;
    }
}

function inputChecker(boxAreaNum, x, y) {

    let input_grid = document.getElementsByClassName("inner_area")
    let box_area = document.getElementsByClassName("box_area")
    let player_turn = document.getElementById("main_title_holder")

    let board_content = board[x][y]

    if (board_content == '') {
        
        input_grid[boxAreaNum].textContent = current_character
        board[x][y] = current_character
        tempMoves.push({ "board_loc": boxAreaNum, "character": current_character })
        
        if (current_playing == 1) {

            current_playing = 2
            previous_character = playerOneCharacter
            current_character = playerTwoCharacter
            box_area[boxAreaNum].style.backgroundColor = playerOneColor
            player_turn.textContent = `${current_character} is playing.`
            player_turn.style.color = playerTwoColor

        } else {
            current_playing = 1

            previous_character = playerTwoCharacter
            current_character = playerOneCharacter

            box_area[boxAreaNum].style.backgroundColor = playerTwoColor
            player_turn.textContent = `${current_character} is playing.`
            player_turn.style.color = playerOneColor
        }

        saveInputHistoryFunc()
    }

    if(current_character == playerTwoCharacter && gameMode == defConfig.gameModePvBot
        && !(alreadytie ||alreadywin)){
            setTimeout(() => {
                gameBot()
            }, Math.floor(Math.random() * (maxTime - minTime + 1) + minTime) * 1000);     
    }
}
function saveInputHistoryFunc(){

    let input_grid = document.getElementsByClassName("inner_area")

    moves[input_total] = []
    let rowOne  = []
    let rowTwo  = []
    let rowThree  = []
    
    for (let index = 0; index < 3; index++) {
            rowOne.push(input_grid[index].textContent)
    }

    for (let index = 3; index <6; index++) {
        rowTwo.push(input_grid[index].textContent)
    }


    for (let index = 6; index < 9; index++) {
        rowThree.push(input_grid[index].textContent)
    }

    moves[input_total].push(rowOne)
    moves[input_total].push(rowTwo)
    moves[input_total].push(rowThree)

    boardChecker(moves[input_total])

    input_total++

    if(!(alreadywin || alreadytie) &&input_total == input_grid.length){
        
        lastInputChecker()
    }
   
}
//checking if already win or tie
function boardChecker(tempboard) {

    let player_turn = document.getElementById("main_title_holder")
    let box_area = document.getElementsByClassName("box_area")

    //Check Horizontally and Vertically
    for (boardloc = 0; boardloc != 3; boardloc++) {
        if ((tempboard[boardloc][0] == tempboard[boardloc][1])
            && (tempboard[boardloc][1] == tempboard[boardloc][2])
            && tempboard[boardloc][0] != ''
            && tempboard[boardloc][1] != ''
            && tempboard[boardloc][2] != '') {

            gameEndFunc()
            return false
        }

        if ((tempboard[0][boardloc] == tempboard[1][boardloc])
            && (tempboard[1][boardloc] == tempboard[2][boardloc])
            && tempboard[0][boardloc] != ''
            && tempboard[1][boardloc] != ''
            && tempboard[2][boardloc] != '') {

            gameEndFunc()
            return false
        }
    }

    //Check Diagonally 
    if ((tempboard[0][0] == tempboard[1][1])
        && (tempboard[1][1] == tempboard[2][2])
        && tempboard[0][0] != ''
        && tempboard[1][1] != ''
        && tempboard[2][2] != '') {

        gameEndFunc()
        return false
    }

    //Check Diagonally 
    if ((tempboard[0][2] == tempboard[1][1])
        && (tempboard[1][1] == tempboard[2][0])
        && tempboard[0][2] != ''
        && tempboard[1][1] != ''
        && tempboard[2][0] != '') {

        gameEndFunc()
        return false
    }
    
    //Tie
    if (input_total  == box_area.length) {

        player_turn.style.color = "white"
        player_turn.textContent = "Tie"
        alreadytie = true
        pushToGameHistory("null")

        boardSidebarsFunc()

        showNavigatorsHandler()
    }
}
//if the game was ended
function gameEndFunc() {

    let player_turn = document.getElementById("main_title_holder")

    pushToGameHistory(previous_character)

    player_turn.textContent = `${previous_character} wins.`

    alreadywin = true

    showNavigatorsHandler()
    boardSidebarsFunc()

    if (previous_character == playerOneCharacter) {
        player_turn.style.color = playerOneColor
    } else {
        player_turn.style.color = playerTwoColor
    }

}


function showNavigatorsHandler() {

    visVisble("nav_header")
    visVisble("nav_footer")

    let nav_prev = document.getElementById("nav_prev")
    let nav_next = document.getElementById("nav_next")

    if(input_total != 1 ){
        nav_prev.disabled = false
        nav_prev.style.visibility = "visible"
    }else{
        nav_prev.disabled = true
        nav_prev.style.visibility = "hidden"
    }
    if(input_total == moves.length){
        nav_next.disabled = true
        nav_next.style.visibility = "hidden"
    }else {
        nav_next.disabled = false
        nav_next.style.visibility = "visible"
    }   
    if (!hotFixNext){
        hotFixNext = true
        nav_next.disabled = true
        nav_next.style.visibility = "hidden"
    }
}
function  lastInputChecker(){
    let input_grid = document.getElementsByClassName("inner_area")

    moves[input_total] = []
    let rowOne  = []
    let rowTwo  = []
    let rowThree  = []

    previous_character = current_character

    for (let index = 0; index < 3; index++) {
        if (input_grid[index].textContent == ""){
            lastCharacter(index)
            rowOne.push(input_grid[index].textContent = current_character)
        }else{
            rowOne.push(input_grid[index].textContent)
        }
    }
    for (let index = 3; index <6; index++) {
        if (input_grid[index].textContent == ""){
            lastCharacter(index)
            rowTwo.push(input_grid[index].textContent = current_character)
        }else{
            rowTwo.push(input_grid[index].textContent)
        }
    }
    for (let index = 6; index < 9; index++) {
        if (input_grid[index].textContent == ""){
            lastCharacter(index)
            rowThree.push(input_grid[index].textContent = current_character)
        }else{
            rowThree.push(input_grid[index].textContent)
        }
    }

    moves[input_total].push(rowOne)
    moves[input_total].push(rowTwo)
    moves[input_total].push(rowThree)

    boardChecker(moves[input_total])

    input_total++
}

function lastCharacter (boxAreaNum){
    let box_area = document.getElementsByClassName("box_area")
    let input_grid = document.getElementsByClassName("inner_area")
    if (current_character == playerOneCharacter) {
        input_grid[boxAreaNum].textContent = playerOneCharacter
        box_area[boxAreaNum].style.backgroundColor = playerOneColor
    } else {
        input_grid[boxAreaNum].textContent = playerTwoCharacter
        box_area[boxAreaNum].style.backgroundColor = playerOneCharacter
    }
    tempMoves.push({ "board_loc": boxAreaNum, "character": current_character })
}

async function boardSidebarsFunc() {
    let sidebarone = document.getElementById("listbars_one")
    let sidebartwo = document.getElementById("listbars_two")

    sidebarone.innerHTML = ""
    sidebartwo.innerHTML = ""

    for (item in game_history) {
        let newLiOne = document.createElement('li')
        let newLiTwo = document.createElement('li')

        if (game_history[item]["win"] == game_history[item]["pone"]) {
            newLiOne.appendChild(document.createTextNode("Win"))
            newLiTwo.appendChild(document.createTextNode("Loss"))
        } else if (game_history[item]["win"]  == game_history[item]["ptwo"]) {
            newLiOne.appendChild(document.createTextNode("Loss"))
            newLiTwo.appendChild(document.createTextNode("Win"))
        } else {
            newLiOne.appendChild(document.createTextNode("Tie"))
            newLiTwo.appendChild(document.createTextNode("Tie"))
        }
        newLiOne.setAttribute("class", "sidebars")
        newLiTwo.setAttribute("class", "sidebars")

        sidebarone.appendChild(newLiOne)
        sidebartwo.appendChild(newLiTwo)
    }
}
function showGameHistoryFunc() {
    bodyContentReplace(gameHistoryHTML)
    let history_list = document.getElementById("game_history")
    history_list.innerHTML = ""

    for (item in game_history) {
        let newList = document.createElement("li")
        let newButton = document.createElement("button")
        let newP = document.createElement("p")

        newP.textContent = `Game ${parseInt(item) + 1}`

        newButton.textContent = "Review"
        newButton.className = "review_button"

        newList.className = "history_list"

        newList.appendChild(newP)
        newList.appendChild(newButton)

        history_list.appendChild(newList)
    }
    document.getElementById("history_close").addEventListener("click", function(){
        showPreviousGameFunc(game_history.length - 1)
    })
    let getReviewButtons = document.getElementsByClassName("review_button")
    //getReviewButtons listeners
    for (let boxnum = 0; boxnum < getReviewButtons.length; boxnum++) {
        getReviewButtons[boxnum].addEventListener("click", function () {

            showPreviousGameFunc(boxnum)

        })
    }
}
//Board Manipulators
function gameResetFunc(){

    let player_turn = document.getElementById("main_title_holder")
    let nav_prev = document.getElementById("nav_prev")
    let nav_next = document.getElementById("nav_next")

    visHidden("nav_header")
    visHidden("nav_footer")

    nav_prev.disabled = true
    nav_prev.style.visibility = "hidden"

    nav_next.disabled = true
    nav_next.style.visibility = "hidden"

    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]

    alreadywin = false
    alreadytie = false
    hotFixNext = false

    moves = []
    tempMoves = []

    current_playing = 1
    current_character = undefined
    current_character = playerOneCharacter
    
    input_total = 0

    player_turn.textContent = `${playerOneCharacter} is playing.`
    player_turn.style.color = playerOneColor

    restoreBoardFunc()
    saveInputHistoryFunc()
    boardSidebarsFunc()
}

function showPreviousGameFunc(gameId) {
    alreadywin = true
    alreadytie = true

    mainBoardFunc()

    let player_turn = document.getElementById("main_title_holder")

    moves = game_history[gameId]["moves"]
    input_total = moves.length

    if (game_history[gameId]["win"] == game_history[gameId]["pone"]){
        player_turn.textContent = `${game_history[gameId]["win"]} wins.`
        player_turn.style.color = playerOneColor
    }else if (game_history[gameId]["win"] == game_history[gameId]["ptwo"]){
        player_turn.textContent = `${game_history[gameId]["win"]} wins.`
        player_turn.style.color = playerTwoColor

    }else{
        input_total = moves.length
        player_turn.textContent = `Tie`
        player_turn.style.color = "white"
    }

    displayBoardHistoryFunc(moves.length - 1)

    showNavigatorsHandler()

    boardSidebarsFunc()
}

function displayBoardHistoryFunc(moveNum){

    let input_grid = document.getElementsByClassName("inner_area")
    let box_area = document.getElementsByClassName("box_area")

    let displayMoves = moves[moveNum]
    let boxAreaNum = 0

    displayMoves.forEach(rows => {

        rows.forEach(element => {

            if (element == playerOneCharacter) {
                input_grid[boxAreaNum].textContent = playerOneCharacter
                box_area[boxAreaNum].style.backgroundColor = playerOneColor
                boxAreaNum++
            } else if (element == playerTwoCharacter){
                input_grid[boxAreaNum].textContent = playerTwoCharacter
                box_area[boxAreaNum].style.backgroundColor = playerTwoColor
                boxAreaNum++

            }else{

                box_area[boxAreaNum].style.backgroundColor = defaultBkgd
                input_grid[boxAreaNum].textContent = ""
                boxAreaNum++
            }
        });
    });
    
}

function restoreBoardFunc(){
    let box_area = document.getElementsByClassName("box_area")
    let input_grid = document.getElementsByClassName("inner_area")

    for (let boxnum = 0; boxnum != box_area.length; boxnum++) {
        box_area[boxnum].style.backgroundColor = defaultBkgd
        input_grid[boxnum].innerHTML = ""
    }

}

function playerRandomizerFuc(){

    let rndOne = chracterRandomizer(1).trim()
    let rndTwo = chracterRandomizer(1).trim()

    if (rndOne == rndTwo){   
        playerRandomizerFuc()
    }else{
        document.getElementById("character_custom_one").value = rndOne
        document.getElementById("character_custom_two").value = rndTwo
    }
}
  
//Helpers
function chracterRandomizer(length) {
    let result
    const charactersLength = randomCharac.length
    for ( let i = 0; i < length; i++ ) {
        result += randomCharac.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result;
}

function pushToGameHistory(winCharacter){

    game_history.push({"moves": moves, 
                        "win": winCharacter, 
                        "pone": playerOneCharacter, 
                        "ptwo": playerTwoCharacter })

}

function visVisble(name) {
    let elementId = document.getElementById(name);
    elementId.style.visibility = "visible"
}

function visHidden(name) {
    let elementId = document.getElementById(name);
    elementId.style.visibility = "hidden"
}

function startFadeIn(index){
    let box_area = document.getElementsByClassName("box_area")
    if(index < box_area.length){
        setTimeout(function(){
            box_area[index].style.visibility = "visible"
            index++;
        startFadeIn(index);
        }, 150);
    }
}

//HTML Templates
const gameModeHTML = 
                    `<div  class='main_board' id='welcome_grid'>
                        <div class='child_board' id='welcome_child'>
                            <p id='game_title'>Tic Tac Toe</p>
                            <p><typewritten-text letter-interval='80'>Choose your Game Mode</typewritten-text></p>
                            <div id='game_mode'> 
                                <ul> 
                                    <li id='mode_pvp'> Human VS. Human </li>
                                    <li id='mode_pvbot'> Human VS. A.I.</li>
                                </ul>
                            </div>
                        </div>
                    </div>`;

const gameCharacterHTML = 
                        `<div  class='main_board' id='welcome_grid'>
                            <div class='child_board' id='welcome_child'>
                                <p id='game_title'>Tic Tac Toe</p>
                                <p class='player_title'>Player 1</p>
                                <p><typewritten-text letter-interval='80'>Choose your character</typewritten-text></p>
                                <div id='player_choose'>
                                    <ul>
                                        <li class='player_character' id='character_x'>X</li>
                                        <li  class='player_character' id='character_o'>O</li>
                                    </ul>
                                </div>
                                <p id='nav_custom_character'>Custom Character</p>
                            </div>
                        </div>`

const gameCustomCharactHTML = ` <div  class="main_board" id="custom_grid">
                                    <div class="child_board" id="custom_child ">
                                        <p id="game_title">Tic Tac Toe</p>
                                        <p><typewritten-text letter-interval="80">Customize your character.</typewritten-text></p>
                                            <div id="player_choose">
                                                    <form id="form" onsubmit="return false">
                                                        <ul>
                                                            <li class="player_character_custom" id="">
                                                            <label for="character_custom_one">Player One</label>
                                                            <input type="text" name="player_one_in" maxlength="1" id="character_custom_one" required>
                                                            </li>
                                                            <li  class="player_character_custom"  >
                                                            <label for="character_custom_two">Player Two</label>
                                                            <input type="text" name="player_two_in" maxlength="1"  id="character_custom_two" required>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div id="nav_input_custom_buttons">
                                                        <button type="reset" id="nav_input_custom_cancel">Cancel</button>
                                                        <button id="nav_input_custom_rdn" >Randomizer</button>
                                                        <button  type="submit" id="nav_input_custom_confirm">Confirm</button>
                                                    </div>
                                                </form>
                                            </div>
                                    </div> 
                                </div>`;

const gameMainBoardHTML = `<div id="main_grid">
                            <input class="restart" type="button" value="Restart" onClick="document.location.reload(true)">
                            <div id="nav_header">
                                <button class="nav-buttons" id="nav_game">History</button>
                            </div>
                            <div id="main_title">
                                <p id="main_title_holder">Placeholder</p>
                            </div>
                            <div class="side_bars" id="playerone">
                                <h3>Player 1</h3>
                                <ul id="listbars_one">
                                 </ul>
                            </div>
                            <div id="board">
                                <div class="box_area"><p class="inner_area"></p></div>
                                <div class="box_area"><p class="inner_area"></p></div>
                                <div class="box_area"><p class="inner_area"></p></div>

                                <div class="box_area"><p class="inner_area"></p></div>
                                <div class="box_area"><p class="inner_area"></p></div>
                                <div class="box_area"><p class="inner_area"></p></div>

                                <div class="box_area"><p class="inner_area"></p></div>
                                <div class="box_area"><p class="inner_area"></p></div>
                                <div class="box_area"><p class="inner_area"></p></div>
                            </div>
                                <div class="side_bars" id="playertwo">
                                <h3>Player 2</h3>
                                <ul id="listbars_two">
                                </ul>
                            </div>

                            <div id="nav_footer">
                                <button class="nav-buttons" id="nav_prev">Previous</button>
                                <button class="nav-buttons" id="nav_reset">Reset</button>
                                <button class="nav-buttons" id="nav_next">Next</button>
                            </div>
                        </div>`

const gameHistoryHTML = `<div  class="main_board" id="history_grid">
                            <div class="child_board" id="history_child">
                            <div id="button_div">
                                <h3>Game History</h3> <button id="history_close">X</button>
                            </div>
                                <ul id="game_history">
                                </ul>
                            </div>
                        </div> `