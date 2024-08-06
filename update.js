import * as f from './functions.mjs';
import * as v from './vectors.mjs';

let esc = 'Escape'; // code is same as key
let pause_key = 'KeyP'; // 'p' key on keyboard
let restart_key = 'KeyR'; // 'p' key on keyboard
let left_arrow = 'ArrowLeft'; // key 37 // this is key code for <=
let right_arrow = 'ArrowRight'; // 39 // this is key code for =>

export function pausing(game_data) {
    function detect_pause(event) {
        let direction_paddle = v.zero
        if (event.code == pause_key) {
            game_data.pause = true;
        }
    }
    window.addEventListener('keydown',detect_pause)
}

export function if_restart_pressed(game_data,what_to_do) {
    function detect_pause(event) {
        let direction_paddle = v.zero
        if (event.code == restart_key) {
            what_to_do(game_data)
        }
    }
    window.addEventListener('keydown',detect_pause)
}

export function controller(game_data) {
    function handle_key_pressed(event) {
        if (event.code == left_arrow) {
            game_data.controller_data.left = true
            game_data.pause = false;
        }
        if (event.code == right_arrow ) {
            game_data.controller_data.right = true
            game_data.pause = false;
        }
    }
    function handle_key_released(event) {
        if (event.code == left_arrow) {
            game_data.controller_data.left = false
        }
        if (event.code == right_arrow) {
            game_data.controller_data.right = false
        }
    }
    window.addEventListener('keydown',handle_key_pressed)
    window.addEventListener('keyup',handle_key_released)
}

export function inputs (game_data){
    controller_update(game_data)
    pausing(game_data)
}
