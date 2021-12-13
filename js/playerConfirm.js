export  const gameCharacterConfirmHTML = (playerOneCharacter,playerTwoCharacter) =>{
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
        
 };



   