const nothing = ''
import * as v from './vectors.mjs';

export function standard_init_values(){
    const init_values = {
        room : {
            size : v.size(900,320),
        },
        bricks : {
            size : v.size(50,20) ,
            number_rows : 3  ,
            number_columns : 4  ,
        },
        ball : {
            radius : 20  ,
            center : v.vect(25,220),
            direction :   v.vect(-5,+1) ,
            speed:  5 , 
        },
        paddle : {
            size: v.size(40,20),
            center: v.vect(250,310),   // height should be < ball radius  
            speed :  9,
        },
        scoreboard : {
            lives : 3 ,
            score : 0  ,
            timer : 0  ,
            framerate : 0 ,
        },
        instructions : {
            text : ` use LEFT ARROW or RIGHT ARROW to move\n P for pause \n and R to reset the game`,
        },
        pause : true,
        won:false,
        lost:false,
    }
    return init_values
}        
