const nothing = ''
import * as f from './functions.mjs';
import * as v from './vectors.mjs';

// const full_width = 1000
// const full_height = 320

function size_entity(entity_data){
    const element = entity_data.element
    const w = entity_data.size.w
    const h = entity_data.size.h
    f.set_width_and_height(element,w,h)
}

// div that will hold everything related to the game
const create_zone = (width,height) => {	
	const zone = f.add_div_with_id(document.body,'zone',nothing)
        return zone
}
// make a triptic 
const split_in_three= (parent,left_id,middle_id,right_id) => {
    const left = f.add_div_with_id(parent,left_id,'')
    const middle = f.add_div_with_id(parent,middle_id,'')    
    const right = f.add_div_with_id(parent,right_id,'')    
    return [left,middle,right]
}

const size_zone = (game_data,width,height) => {
   const full_width = 720
	f.set_width_and_height(game_data.room_data.element,width,height)
	// f.set_width_and_height(game_data.scoreboard_data.element,width-full_width/2,height)
	// f.set_width_and_height(game_data.instructions_data.element,width-full_width/2,height)
}

function create_scoreboard_elements (scoreboard_data) {
    const scoreboard_div = scoreboard_data.element
    const score_element = f.add_div_with_id(scoreboard_div,'score',null)
    scoreboard_data.score_data.element = score_element
    const timer_element = f.add_div_with_id(scoreboard_div,'timer',null)
    scoreboard_data.timer_data.element = timer_element
    const lives_element = f.add_div_with_id(scoreboard_div,'lives',null) 
    scoreboard_data.lives_data.element = lives_element
    const fps_element = f.add_div_with_id(scoreboard_div,'fps',null)
    scoreboard_data.fps_data.element = fps_element
    // beware that scoreboard is not the div holding info, but an object holding its sub divs 
    return scoreboard_data
}


function style_ball_element(ball_element){
    ball_element.style.borderRadius = '50%' 
    ball_element.style.position = 'absolute'
}

function style_paddle_element(paddle_element){
    paddle_element.style.position = 'absolute'
}

const create_ball_element = (room,radius) => {
  let ball = f.add_div_with_id(room,'ball','')
  f.set_width_and_height(ball,radius*2,radius*2)
  return ball
} 

const create_paddle_element = (room,size) => {
   let paddle = f.add_div_with_id(room,'paddle','')
   f.set_width_and_height(paddle,size.w,size.h)
   paddle.style.position = 'absolute'
   return paddle
}


export function new_game_data(){
    let room_data = {
        element : null,
        size : v.null_size,
    }
    let ball_data = {
        element : null ,
        radius : null ,
        center : null ,
        size : v.null_size,
        direction : v.zero,
        speed : null,
    }
    let bricks_data = {
        bricks : [],
        size : null,
    }
    let paddle_data = {
        element : null ,
        size : v.null_size ,
        center : v.null_vect ,
        direction : v.zero ,
        speed : null,
        active : true,
    }        
    let controller_data = {
        left:null,
        right:null,
        pause:null,
    }
    let scoreboard_data = {
        element:null,
        lives_data : {
            element : null,
            health:null,
        },
        score_data : {
            element:null,
            score:null
        },
        timer_data : {
            element:null,
            time:null,
        },
        fps_data : {
            element:null,
            framerate:null,
        },
    }
    let instructions_data = {
        element:null,
        text:null,
    }

    let game_data = {
        room_data : room_data,
        ball_data : ball_data,
        bricks_data : bricks_data,
        paddle_data : paddle_data,
        scoreboard_data : scoreboard_data,
        instructions_data :instructions_data,
        controller_data : controller_data,
        pause : null,
        won: false,
        lost : false,
        max_fps : null,
        init_data : null,
    }
    return game_data
}

export function initiate_tree(game_data,init_values){
    // room
    game_data.room_data.size = init_values.room.size
    // bricks
    const brick_size = init_values.bricks.size
    const width =  brick_size.w
    const height = brick_size.h
    const n_row = init_values.bricks.number_rows 
    const n_col = init_values.bricks.number_columns 
    const full_width = init_values.room.size.w
    const gap_h = ( full_width -  (n_col * width) ) / ( n_col+1   )
    const gap_v = 20
    game_data.bricks_data.size = brick_size
    let i = 0
    for (let i_row = 0; i_row < n_row; i_row++) {
        for (let i_col = 0; i_col < n_col; i_col++) {
            const center = v.vect ( gap_h + width*0.5 + i_col*(gap_h + width) ,
                                    gap_v + width*0.5 + i_row*(gap_v + height)  ) 
            if (typeof game_data.bricks_data.bricks[i] == 'undefined'){
                const new_brick_data = {
                    element : {},
                    size : brick_size,
                    center : center,
                    active : true,
                }
                game_data.bricks_data.bricks.push(new_brick_data)
            } else {
               game_data.bricks_data.bricks[i].center = center 
               game_data.bricks_data.bricks[i].active = true 
               game_data.bricks_data.bricks[i].element.style.display = '' 
               game_data.bricks_data.bricks[i].size = brick_size 
            }
            i = i +1
        }
    }
    // ball
    const ball_radius =  init_values.ball.radius  
    game_data.ball_data.radius = ball_radius
    game_data.ball_data.size = v.size(ball_radius*2,ball_radius*2)
    game_data.ball_data.center = init_values.ball.center
    game_data.ball_data.direction = init_values.ball.direction
    game_data.ball_data.speed = init_values.ball.speed
    // paddle 
    game_data.paddle_data.size = init_values.paddle.size
    game_data.paddle_data.speed = init_values.paddle.speed
    game_data.paddle_data.center = init_values.paddle.center
    // scoreboard 
    game_data.scoreboard_data.lives_data.health = init_values.scoreboard.lives
    game_data.scoreboard_data.score_data.score = init_values.scoreboard.score
    game_data.scoreboard_data.timer_data.time = init_values.scoreboard.timer
    game_data.scoreboard_data.fps_data.framerate = init_values.scoreboard.framerate
    // instructions 
    game_data.instructions_data.text = init_values.instructions.text
    // pause win loose state at beginning 
    game_data.pause = init_values.pause
    game_data.won = init_values.won
    game_data.lost = init_values.lost
    // store init value in the game_data for reset purpose
    game_data.init_data = init_values
    
}
export function create_elements (game_data){
     const zone_element = f.add_div_with_id(document.body,'zone',nothing)   // create main "zone" div in body
    // split it in left, right pane and room/game-area 
	// screen divided into 3 parts ,  left pane is score board
	// board is middle game area, right is instructions and hints 
	// Data-wise, most entity_data are children of game_data but for display reasons
	// but gameplay "elements" are chidren of room_element  
	// this is where logical data_tree and dom tree diverge 
    const [scoreboard_element,room_element,instructions_element] = split_in_three(zone_element,'scoreboard','room','instructions')
    game_data.scoreboard_data.element = scoreboard_element
    game_data.scoreboard_data.element.className = "scoreboard";
    game_data.instructions_data.element = instructions_element
    game_data.instructions_data.element.className = "instructions";
    game_data.room_data.element = room_element
    game_data.room_data.element.className = "room";

    // scoreboard
    create_scoreboard_elements (game_data.scoreboard_data)   
    // bricks
    for (const i in game_data.bricks_data.bricks){
        const brick_data = game_data.bricks_data.bricks[i]
	brick_data.element = f.add_div_with_id(game_data.room_data.element,i,'')
        brick_data.element.className = "brick";
    }
    // ball
    game_data.ball_data.element = f.add_div_with_id(room_element,'ball')
    game_data.ball_data.element.className = "ball";
    // paddle
    game_data.paddle_data.element = f.add_div_with_id(room_element,'paddle')
    game_data.paddle_data.element.className = "paddle";

    return game_data
}
// now we reset/update position and sizes of each element acccording its data

export function size_elements(game_data){
    // zone
    let gd = game_data    
    const room_size = gd.room_data.size 
    size_zone(gd,room_size.w,room_size.h)
    //bricks 
    for (const i in gd.bricks_data.bricks){
        const brick_data = gd.bricks_data.bricks[i]
        size_entity(brick_data)
    }
    // ball
    size_entity(gd.ball_data)
    // paddle
    size_entity(gd.paddle_data)
    return gd
}

export function update_positions(game_data){
    // bricks
    for (const i in game_data.bricks_data.bricks){
        const brick_data = game_data.bricks_data.bricks[i]
	f.update_entity_position(brick_data)
    }
    // ball
    f.update_entity_position(game_data.ball_data) 
    // paddle
    f.update_entity_position(game_data.paddle_data) 
}

export function update_content(game_data){
    //scoreboard
    let sb = game_data.scoreboard_data
    f.update_element_content(sb.lives_data,sb.lives_data.health +' lives')
    f.update_element_content(sb.timer_data,sb.timer_data.time+ ' s')
    f.update_element_content(sb.fps_data,sb.fps_data.framerate+' fps')
    f.update_element_content(sb.score_data,sb.score_data.score+ ' points')
    // instructions
    let instru = game_data.instructions_data
    f.update_element_content(instru,instru.text)
}






