import * as init from './init.js'; // things related to level creation and initialization
import * as std from './level_values.js'; // constant defining level design
import * as mod from './model.js'; // logical intra game loop stuff 
import * as ud from './update.js'; // bind key control to game event

// create game data and dom elements
let game_data = initiate_whole_game()
game_data.max_fps = 70 // testing

// add controls event listener (pause on p and move paddle with arrows)
controls(game_data)
// start the game loop
the_loop(game_data)

// whatever would make the loop stop
check_outcome(game_data)



function initiate_whole_game(){
    	// game creation
    // make a dats entity tree structure
    const game_data = init.new_game_data()
    // get parameters defining game and level
    const init_values = std.standard_init_values()
    // now we can use both to have an complete tree
    init.initiate_tree(game_data,init_values)
    // let's create dom element
    init.create_elements(game_data)
    // update sizec of elements
    init.size_elements(game_data)
    // update the position of each elements
    init.update_positions(game_data)
    // initiate element content
    init.update_content(game_data)
    return game_data
}

function controls(game_data){
    ud.pausing(game_data)
    ud.controller(game_data)
    ud.if_restart_pressed(game_data,reset_game)
}
// all stuff that are called every frame
function the_loop(game_data){
   // movement and collisions
   mod.move_stuff(game_data) 
   // timer update
   mod.timer(game_data)
   // framerate update
   mod.framerate(game_data)
}

function check_outcome(game_data){
    // did lost ?
    mod.is_lost(game_data)
    mod.is_win(game_data) // will pause game
}

function reset_game(game_data) {
    init.initiate_tree(game_data,game_data.init_data)
    init.update_positions(game_data)
    init.update_content(game_data)
}
