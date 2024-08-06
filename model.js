import * as f from './functions.mjs';
import * as v from './vectors.mjs';

/// game state state functions

function remove_one_life(game_data){
    let lives_data = game_data.scoreboard_data.lives_data 
    lives_data.health = lives_data.health - 1  
    f.update_element_content( lives_data,lives_data.health + " lives")  
}

function score(game_data){
    let score_data = game_data.scoreboard_data.score_data
    let seconds = game_data.scoreboard_data.timer_data.time
    if (seconds != 0){
        let new_points = score_data.score + 1000/seconds
        score_data.score = new_points
        let formatted = Math.round(new_points)
        f.update_element_content(score_data,formatted + ' points') 
        return new_points
    }
}


function refresh_game(game_data){
    // reset bricks
    for (const brick_data of game_data.bricks_data.bricks){
        f.activate_entity(brick_data)
    }
    //reset life
    reset_life = (game_data)
    // reset paddle and ball position
    game_data.paddle_data.center.x = 250
    game_data.ball_data.center = v.vect(25,220)
    // reset timer
}


function desactive_paddle_for_a_while(paddle_data){
    paddle_data.active = false
    setTimeout(()=>{paddle_data.active =true;} , 500)
    paddle_data.element.style.backgroundColor = 'grey'
    setTimeout(()=>{ paddle_data.element.style.backgroundColor = 'red';} , 500)
}

function yellowishing(entity_data){
    let default_color = entity_data.element.style.backgroundColor
    entity_data.element.style.backgroundColor = 'yellow'
    setTimeout(()=>{ entity_data.element.style.backgroundColor = default_color;} , 2000)
}    

function pinkishing(entity_data){
    let default_color = entity_data.element.style.backgroundColor
    entity_data.element.style.backgroundColor = 'pink'
    setTimeout(()=>{ entity_data.element.style.backgroundColor = default_color;} , 2000)
}    

function orangishing(entity_data){
    let default_color = entity_data.element.style.backgroundColor
    entity_data.element.style.backgroundColor = 'orange'
    setTimeout(()=>{ entity_data.element.style.backgroundColor = default_color;} , 300)
}    

/// collision functions

const collision_left_wall = (x) => 
    ( x <= 0 ? true: false )

const collision_right_wall = (x,max_width) => 
    ( x >= max_width ? true : false )

const collision_top_wall = (y) =>
   (y <= 0 ? true : false) 

function collision_floor (game_data) {
    const radius = game_data.ball_data.radius
    const center = game_data.ball_data.center
    const height = game_data.room_data.size.h
    if (center.y+radius >= height) {
        game_data.ball_data.direction = v.flip_y(game_data.ball_data.direction)
        let penetration = v.vect(0 , center.y + radius-height)
        let reaction = v.mult(penetration,-2)
        let new_center = v.add(center, reaction) 
        game_data.ball_data.center = new_center
        orangishing(game_data.ball_data)
        remove_one_life(game_data)
    }
    return game_data
}

const collision_walls = (ball_data,room_data) => {
   const radius = ball_data.radius
   const center = ball_data.center
   const width = room_data.size.w
   const height = room_data.size.h
   let new_dir = ball_data.direction // {x,y}
   let penetration = v.zero
   if (collision_left_wall(center.x-radius)) {
        penetration = v.add(penetration,v.vect(center.x-radius , 0))
    	new_dir = v.flip_x(new_dir) 
   } 
   if (collision_top_wall(center.y-radius)){
        penetration = v.add(penetration,v.vect(0 , center.y-radius))
    	new_dir = v.flip_y(new_dir)
   } 
   if (collision_right_wall(center.x+radius,width)) {
        penetration = v.add(penetration,v.vect(radius+center.x -width, 0))
    	new_dir = v.flip_x(new_dir) 
   } 
    ball_data.direction = new_dir
    let reaction = v.mult(penetration,-2)
    let new_center = v.add(center, reaction) 
    ball_data.center = new_center
    return ball_data
}

function quick_elimination(ball_data,bricks_data){
    // check if trajectory is in range of brick
    // ball vinicity
    const ball_center = ball_data.center
    const radius =  ball_data.radius
    const speed = ball_data.speed
    let ball_left = ball_center.x-(speed+radius)
    let ball_top = ball_center.y-(speed+radius)
    let ball_right = ball_center.x + (speed + radius) 
    let ball_bot = ball_center.y + (speed + radius) 
    let w = bricks_data.size.w   
    let h = bricks_data.size.h   
    let new_bricks_list = []
    for (const brick_data of bricks_data.bricks) {
        if (brick_data.active === false)
            {continue}
        const brick_left = brick_data.center.x-w/2
        const brick_top = brick_data.center.y-h/2
        const brick_right = brick_data.center.x+w/2
        const brick_bot = brick_data.center.y+h/2
        if (ball_right < brick_left)
            {continue}
        if (ball_left > brick_right)
            {continue}
        if (ball_top > brick_bot)
            {continue}
        if (ball_bot < brick_top)
            {continue}
        new_bricks_list.push(brick_data)
   }
    return new_bricks_list
}

function penetration_ball_brick_sides(ball_data,brick_data){
    const brick_direction = brick_data.direction || v.zero
    const brick_speed = brick_data.speed || 0
    const brick_trajectory = v.mult(brick_direction,brick_speed)
    const radius =  ball_data.radius
    const ball_center = ball_data.center
    const w = brick_data.size.w
    const h = brick_data.size.h
    // four corners brick left top right bot L T R B
    const LT = v.add(brick_data.center, {x:-w/2,y:-h/2})
    const LB = v.add(brick_data.center,{x:-w/2,y:h/2}) 
    const TR = v.add(brick_data.center,{x:+w/2,y:-h/2}) 
    const BR = v.add(brick_data.center,{x:w/2,y:h/2}) 
    let trajectory = v.mult(ball_data.direction,ball_data.speed)
    trajectory = v.add(trajectory,v.minus(brick_trajectory))
    const origin = v.add(ball_center,v.minus(trajectory))
    const brick_sides = [v.vect(LT.x,0),v.vect(0,LT.y),v.vect(TR.x,0),v.vect(0,BR.y)]   
    const sides_name =  ['left','top','right','bot']
    const edges = [[LB,LT],[LT,TR],[TR,BR],[BR,LB]]
    const normals = [v.vect(-1,0),v.vect(0,-1),v.vect(1,0),v.vect(0,1)]
    for (const i in brick_sides){
            let normal = normals[i]
            if (v.dot(trajectory,normal)<0){ // ball goint toward wall
                let center_to_brick = v.mult(normal,-radius)
                let ball_side = v.add(ball_center,center_to_brick)
                let edge = edges[i]
                let contact = v.intersection_segments(origin,ball_side,edge[0],edge[1]) 
                if (contact !== null) {
                    let corner_to_ball_side = v.add(ball_side ,v.minus(edge[0]))
                    let penetration = v.projection(corner_to_ball_side ,normal)
                    return penetration
                }
           }
    }
    return null
}

function penetration_ball_brick_corners(ball_data,brick_data){
    const brick_direction = brick_data.direction || v.zero
    const brick_speed = brick_data.speed || 0
    const brick_trajectory = v.mult(brick_direction,brick_speed)
    const radius =  ball_data.radius
    const ball_center = ball_data.center
    const w = brick_data.size.w
    const h = brick_data.size.h
    // four corners brick left top right bot L T R B
    const LT = v.add(brick_data.center, {x:-w/2,y:-h/2})
    const LB = v.add(brick_data.center,{x:-w/2,y:h/2}) 
    const TR = v.add(brick_data.center,{x:+w/2,y:-h/2}) 
    const BR = v.add(brick_data.center,{x:w/2,y:h/2}) 
    let trajectory = v.mult(ball_data.direction,ball_data.speed)
    trajectory = v.add(trajectory,v.minus(brick_trajectory))
    const origin = v.add(ball_center,v.minus(trajectory))
    const corners = [LT,TR,BR,LB]      
    const normals = [v.vect(-1,-1),v.vect(1,-1),v.vect(1,1),v.vect(-1,1)]
    for (const i in corners){
            let normal = normals[i]
            if (v.dot(trajectory,normal)<0){ // ball going toward corner
                let corner = corners[i]
                // we calculate first intersection between ball center trajectory and circle cornered at corner with ball radius
                let center_at_contact = v.intersection_segment_circle(origin,ball_center,corner,radius) 
                if (center_at_contact !== null) {
                    let contact_to_center = v.add(ball_center,v.minus(center_at_contact))
                    let impact = v.add(center_at_contact,v.minus(corner))
                    let penetration = v.projection(contact_to_center,impact)
                    // check if penetration orientation compatible with corner impact from outside
                    if (0 < v.dot(penetration,{x:normal.x,y:0}) ||  0 < v.dot(penetration,{x:0,y:normal.y}) ){
                        return null
                    }
                    return penetration
                }
            }
    }
    return null
}

function collision_bricks(game_data){ 
    const ball_data = game_data.ball_data
    const bricks_data = game_data.bricks_data
    let new_bricks_list = quick_elimination(ball_data,bricks_data)
    let new_direction = ball_data.direction
    let reaction = v.zero
    if (new_bricks_list.length > 0){
        for (const i in new_bricks_list){
            const brick_data = new_bricks_list[i]
            let penetration = penetration_ball_brick_sides(ball_data,brick_data)
            if (penetration !== null){ // if we actually find a contact point
                // change ball direction
                new_direction = v.reflection(ball_data.direction,penetration)
                // apply reaction from collision
                const rejection = v.mult(penetration,-2) 
                reaction = v.add(reaction,rejection)
               	// kill the brick
                f.desactivate_entity(brick_data)
                score(game_data)
            }
       } // testing brick corners	
        for (const brick_data of new_bricks_list){
            let penetration = penetration_ball_brick_corners(ball_data,brick_data)
            if (penetration !== null){ // if we actually find a contact point
                // change ball direction
                new_direction = v.reflection(ball_data.direction,penetration)
                // apply reaction from collision
                const rejection = v.mult(penetration,-2) 
                reaction = v.add(reaction,rejection)
               	// kill the brick
                f.desactivate_entity(brick_data)
                // function score()
                score(game_data)
            }
        }	
    }
    ball_data.center = v.add(ball_data.center,reaction)
    ball_data.direction = new_direction
    return ball_data
    // do something wth reaction
}
function collision_paddle(ball_data,paddle_data){ 
    if (paddle_data.active == false){
        return
    }
    const radius = ball_data.radius
    const width = paddle_data.size.w
    const ball_speed = ball_data.speed
    const paddle_speed = paddle_data.speed
    const ball_center = ball_data.center
    const ball_left = ball_center.x-(ball_speed+radius)
    const ball_top = ball_center.y-(ball_speed+radius)
    const ball_right = ball_center.x + (ball_speed + radius) 
    const ball_bot = ball_center.y + (ball_speed + radius) 
    const paddle_right = paddle_data.center.x + width/2
    const paddle_left = paddle_data.center.x - width/2
    const paddle_top = paddle_data.center.y - paddle_data.size.h * 0.5
    //check if paddle in range of the ball
    // easy elimination check if ball in range of paddle
    if (ball_bot + ball_speed < paddle_top )
        {return}
    if (paddle_right + paddle_speed < ball_left - ball_speed) 
        {return}
    if (ball_right + ball_speed < paddle_left - paddle_speed) 
        {return}
    let new_direction = ball_data.direction
    let reaction = v.zero
    let penetration = penetration_ball_brick_sides(ball_data,paddle_data)
    if (penetration !== null){ // if we actually find a contact point
        // change ball direction
        new_direction = v.reflection(ball_data.direction,penetration)
        // apply reaction from collision
        const rejection = v.mult(penetration,-2) 
        reaction = v.add(reaction,rejection)
        desactive_paddle_for_a_while(paddle_data)
    }
     // testing paddle corners	
    penetration = penetration_ball_brick_corners(ball_data,paddle_data)
    if (penetration !== null){ // if we actually find a contact point
        // change ball direction
        const paddle_trajectory = v.mult(paddle_data.direction,paddle_data.speed)
        const ball_trajectory = v.mult(ball_data.direction,ball_data.speed)
        let trajectory = v.add(ball_trajectory,v.minus(paddle_trajectory))
        new_direction = v.reflection(trajectory,penetration)
        // apply reaction from collision
        const rejection = v.mult(penetration,-2) 
        reaction = v.add(reaction,rejection)
        desactive_paddle_for_a_while(paddle_data)
    }
    ball_data.center = v.add(ball_data.center,reaction)
    ball_data.direction = new_direction
/*    if (penetration !== null) {
        let reaction_on_paddle = v.mult(penetration,2)
        reaction_on_paddle.y = 0
        paddle_data.center = v.add(paddle_data.center,v.mult(reaction_on_paddle,5))
        //paddle_data.direction = v.flip_x(paddle_data.direction)
        paddle_data.direction = v.zero
    }
*/}

/// movement functions 

function inertia (ball_data){
   ball_data.direction = v.normalize(ball_data.direction)
   ball_data.center = v.move( ball_data.center,ball_data.direction,ball_data.speed )
   return ball_data 
}

export function move_ball (game_data)  {
// take all argument needed
    let ball_data = game_data.ball_data
    let room_data = game_data.room_data
    let bricks_data = game_data.bricks_data
    let paddle_data = game_data.paddle_data
    let penetration = v.zero
    inertia(ball_data)
// determine ball new position
    function collisions_ball_with_everything(ball_data){
        let ball_data_center_before = ball_data.center
        do {
            ball_data_center_before = ball_data.center
            ball_data = collision_walls( ball_data,room_data )
            collision_bricks (game_data) // should be returning ball_data but it was bugged
            collision_floor(game_data)
            collision_paddle(ball_data,paddle_data)
        }
        while ( (ball_data_center_before.x !== ball_data.center.x) || (ball_data_center_before.y !== ball_data.center.y ) )
    }
    // ball_data = 
    collisions_ball_with_everything(ball_data)
    // apply all changes to element for display
    f.update_entity_position(ball_data)
    // prepare data to send back 
    let new_game_data = game_data
    // game_data.ball_data = ball_data
    return new_game_data
}

export function move_paddle (game_data) {
    update_paddle_direction(game_data) 
    const direction = game_data.paddle_data.direction
    const speed = game_data.paddle_data.speed
    const movement = v.mult(direction,speed)
    const half_width = 0.5*game_data.paddle_data.size.w
    game_data.paddle_data.center = v.add(game_data.paddle_data.center , movement)
    if (game_data.paddle_data.center.x - half_width < 0){
        game_data.paddle_data.center.x = half_width
    }
    let max_width = game_data.room_data.size.w
    if ( game_data.paddle_data.center.x + half_width > max_width){
        game_data.paddle_data.center.x = max_width-half_width
    }
    f.update_entity_position(game_data.paddle_data)
    return game_data
}

export function paddle_control_update (game_data) {
    const loop = () => {
        paddle_control_update(game_data)
    }
    let controller = game_data.controller_data
    let paddle_direction = v.zero
    if (controller.left == true){ 
        paddle_direction= v.add(paddle_direction,v.left)
    }
    if (controller.right == true){ 
        paddle_direction= v.add(paddle_direction,v.right)
    }
    game_data.paddle_data.direction = paddle_direction
    let max_fps = game_data.max_fps
    setTimeout(()=>{requestAnimationFrame(loop);},1000/max_fps)
}
export function update_paddle_direction (game_data) {
    let controller = game_data.controller_data
    let paddle_direction = v.zero
    if (controller.left == true){ 
        paddle_direction= v.add(paddle_direction,v.left)
    }
    if (controller.right == true){ 
        paddle_direction= v.add(paddle_direction,v.right)
    }
    game_data.paddle_data.direction = paddle_direction
}

/// game loop functions


export function framerate (game_data,time_stamp) {
    const closure = (time_stamp) =>{
	framerate(game_data,time_stamp)
    }
    if (game_data.pause === false && game_data.lost === false && game_data.won === false){
        let last_frame_time = f.zero_if_nan(game_data.scoreboard_data.fps_data.last_frame_time)
        let now = performance.now()
        let elapsed_time = now - last_frame_time
        let raw_fps =1000/(elapsed_time) 
        let last_framerate = f.zero_if_nan(game_data.scoreboard_data.fps_data.framerate)
        let updated_framerate = (last_framerate * 4 / 5) + (raw_fps / 5)
        let formatted_framerate =  Math.round( updated_framerate ) + ' fps'
	// update the framerate indicator
	f.update_element_content(game_data.scoreboard_data.fps_data ,formatted_framerate )
        game_data.scoreboard_data.fps_data.last_frame_time = time_stamp
        game_data.scoreboard_data.fps_data.framerate = updated_framerate
    }
    let max_fps= game_data.max_fps
    setTimeout(()=>{
	requestAnimationFrame(closure);}
        ,1000/max_fps)
}

export function timer (game_data,time_stamp) {
    const closure = (time_stamp) =>{
	timer(game_data,time_stamp)
    }
    if (game_data.pause === false && game_data.lost === false && game_data.won === false){
        // grab timer
        const timer_data = game_data.scoreboard_data.timer_data
        let new_time = timer_data.time + 1
        timer_data.time = new_time
        let formatted_time = Math.round ( new_time/60) 
        f.update_element_content(timer_data,formatted_time+ ' s')
    }
    let max_fps= game_data.max_fps
    setTimeout(()=>{
	requestAnimationFrame(closure);}
        ,1000/max_fps)
}

	// that game loop is based on browser refresh rate with a limiter
export function move_stuff (game_data,last_frame_time) {
    const closure = (time) =>{
	move_stuff(game_data,time)
    }
    if (game_data.pause === false && game_data.lost === false && game_data.won === false){
        game_data = move_ball(game_data)
        move_paddle(game_data) 
    }
    let fps = game_data.max_fps
    setTimeout(()=>{
	requestAnimationFrame(closure);}
        ,1000/fps)
}


export function is_win (game_data,last_frame_time) {
    const closure = (time) =>{
	is_win(game_data,time)
    }
    let won = null
    if (game_data.pause === false && game_data.lost === false && game_data.won === false){
    won = true
        for (const brick_data of game_data.bricks_data.bricks){
            if (brick_data.active === true){
                won = false
            }
        }// game is over if you reach that point
    }
    if (won === true){
        game_data.pause = true
        game_data.won = true
        const win_message = `congratulation, you won.\n you can restart by pressing R  \n or you can simply send the validation code to gameline`
        f.update_element_content(game_data.instructions_data,win_message)
        pinkishing(game_data.instructions_data)
    }
    let fps = game_data.max_fps
    setTimeout(()=>{
	requestAnimationFrame(closure);}
        ,1000/fps)
}

export function is_lost (game_data,last_frame_time) {
    const closure = (time) =>{
	is_lost(game_data,time)
    }
    if (game_data.pause === false && game_data.lost === false && game_data.won === false){
        if (game_data.scoreboard_data.lives_data.health <= 0){
            game_data.pause = true
            game_data.lost = true
            const lost_message = `well, you lost.\n you can restart by pressing R  \n or you can give up and send the validation code to gameline \n no one will never knows`
            f.update_element_content(game_data.instructions_data,lost_message)
            yellowishing(game_data.instructions_data)
        }
    }
    let fps = game_data.max_fps
    setTimeout(()=>{
	requestAnimationFrame(closure);}
        ,1000/fps)
}

