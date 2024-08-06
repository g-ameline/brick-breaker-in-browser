// this module is all about vector operation
// rely on object {x : x_number , y : y_number}
// some unused functions are in draft stage

export function vect(x,y){return {x:Number(x),y:Number(y)}}
export function size(w,h){return {w:Number(w),h:Number(h)}}

export const null_size = size(null,null)
export const null_vect = vect(null,null)
export const zero = vect(0,0)
export const left = vect(-1,0)
export const right = vect(1,0)
export const top = vect(0,-1)
export const bop = vect(0,1)

export function length (v){
    return Math.sqrt(v.x*v.x+v.y*v.y)
}

export function normalize (v) {
    let l = length(v)
    return vect (v.x/l , v.y/l)
}

export function flip_x (v) {
    return vect (-v.x , v.y)
}
export function flip_y (v) {
    return vect (v.x , -v.y)
}

export function force_down (v){
	return vect(v.x , Math.abs(v.y) )
}

export function flip (v){
	return vect(-v.x , -v.y)
}

export function orientation (angle) {
   let x = Math.cos(angle)
   let y = Math.sin(angle)
   return vect(x,y)
}

export function move(position,direction,distance) {
     let new_x = position.x + (direction.x*distance)
     let new_y = position.y + (direction.y*distance)
     return vect(new_x,new_y) 
}


export function va_and_vb_to_vab (v_a,v_b) {
   return vect(v_b.x-v_a.x , v_b.y-v_a.y)
}

export function add (v_a,v_b) {
   return vect(v_a.x+v_b.x , v_a.y+v_b.y)
}
export function minus (v) {
   return vect(-v.x , -v.y)
}
export function mult (v,k) {
   return vect( v.x*k , v.y*k)
}

export function cross(v_a,v_b){
    return (v_a.x * v_b.y - v_b.x * v_a*y)
}

export function dot(v_a,v_b){
    return (v_a.x * v_b.x + v_a.y * v_b.y)
}

export function is_clockwise(v_a,v_b){
    if (cross(v_a,v_b)>0)  
        {return true}
    return false
}

export function is_inside(v_a,v_b,v_c){
    if (is_clockwise(v_a,v_b) == is_clockwise(v_b,v_c))
        {return true}
    return false
}

export function intersection_segments(A,B,C,D){
    // if AB intersect CD then we output coordinate
    // algo from wikipedia
    const denominator = ( (A.x - B.x)*(C.y-D.y)-(A.y-B.y)*(C.x-D.x) ) 
    if (denominator === 0){
        return null
    }
    const t = ((A.x - C.x)*(C.y-D.y)-(A.y-C.y)*(C.x-D.x)) / denominator
    const u = ((A.x - C.x)*(A.y-B.y)-(A.y-C.y)*(A.x-B.x)) / denominator
    // assuming the above do fail then the two line intersect 
    // then we still need to check that intersection belong to both segment
    if (t < 0 || 1 < t || u < 0 || 1 < u){
        return null
    }
    const AB = add(B,minus(A))
    const intersection = add(A,mult(AB,t))
    return intersection
}
// only keep first intersection from segment AB
export function intersection_segment_circle(O,E,C,R){
    // ray AB, circle of center C and radius R
    const OE = add(E,minus(O))
    const u = normalize(OE)
    const OC = add(C,minus(O))
    const CM = rejection(OC,u)// M is middle point in circle on ray OE
    const length_CM = length(CM)
    if (length_CM >= R){ // de we even intersect ?
            return null
    }   
    const OM = projection(OC,u)
    const length_MP = Math.sqrt(R*R-length_CM*length_CM) 
    const MP = mult(u,-length_MP)
    const OP = add(OM,MP)
    if (length(OP)>=length(OE)){
        return null
    }
    const P = add(O,OP)
    return P
}

export function reflection(incident,normal){
    // normalized the noraml i not already
    normal = normalize(normal)
    const incident_projected_on_normal = projection(incident,normal)
    const repulsion = mult(incident_projected_on_normal,-2) 
    const reflected = add(incident ,repulsion )
    return reflected 
} 

export function projection(projected,base){
    base = normalize(base)
    const multiplier = dot(base,projected)
    return mult(base,multiplier) 
}

export function rejection(rejected,base){
    base = normalize(base)
    const projected = projection(rejected,base)
    return add(rejected,minus(projected))
}

export function impact_circle_line(circle_trajectory,radius,line_face){}

export function point_into_rectangle(point,top_left_corner,w,h){
    if (point.x < top_left_corner.x) 
    	{return false}
    if (point.x > top_left_corner.x+w) 
    	{return false}
    if (point.y < top_left_corner.y) 
    	{return false}
    if (point.y > top_left_corner.y + h) 
    	{return false}
    return true
}


