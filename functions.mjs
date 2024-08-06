// this module gather all functions that deal with dom element manipulation

const nothing = ''

function pix (numb) {
	return numb+'px'
}

export function unpix (text) {
	return text.slice(0,-2)
}
export class Vector extends Array{
}
export const point = (x,y) => {
    if (x && y) return new Array(x,y)
    if (!x && !y) new Array(0,0)
    throw("wring inputs")
}
Vector.prototype.add = function(another_point) {
    return add(this,another_point)    
}
export const add = (a_point,another_point) => {
    a_point[0] += another_point[0]
    a_point[1] += another_point[1]
    return a_point    
}
Vector.prototype.less = function(another_point) {
    return less(this,another_point)    
}
export const less = (a_point,another_point) => {
    a_point[0] -= another_point[0]
    a_point[1] -= another_point[1]
    return a_point    
}
Vector.prototype.minus = function() {
    return minus(this)    
}
export const minus = (a_point)=>{ 
    a_point[0] *= -1 
    a_point[1] *= -1
    return a_point
}

export function add_div_with_id(parent, name, content='') {
    const new_div = document.createElement('div');
    new_div.setAttribute('id', name);
    const new_node_content = document.createTextNode(content);
    new_div.appendChild(new_node_content);
    new_div.innerHTML = content
    parent.appendChild(new_div);
    return new_div
}

export function translate_to(element,left,top){
    const translation = pix(left)+' '+pix(top)
    element.style.translate = translation
    return element
}
export function update_entity_position(entity_data){
    const center = entity_data.center
    const size = entity_data.size
    const left = center.x-size.w*0.5
    const top = center.y-size.h*0.5
    translate_to(entity_data.element,left,top)    
    return entity_data
}

export function set_width_and_height(elem,width,height) {
    elem.style.width = pix(width)
    elem.style.height = pix(height)
}
export function get_width_and_height(elem) {
    let w = unpix(elem.style.width)
    let h = unpix(elem.style.height)
    return {w:w,h:h}
}
export function set_position(elem,center) {
    const size = elem.size
    elem.style.left = pix(center.x-size.w*0.5)
    elem.style.top = pix(center.y-size.h*0.5)
    return position
}
export function get_dom_position(element) {
    const x = Number(unpix(element.style.left))
    const y = Number(unpix(element.style.top))
    return {x:x,y:y}	
}

export function get_transl_position(element) {
    const rect = element.getBoundingClientRect()
    const x = rect.x
    const y = rect.y
    return {x:x,y:y}	
}

export function desactivate_entity(entity_data){
    entity_data.active = false
    entity_data.element.style.display = 'none'
}
export function activate_entity(entity_data){
    entity_data.active = true
    entity_data.element.style.display = ''
}

export function update_element_content(entity_data,new_content){
    entity_data.element.textContent=new_content; 
}

export function zero_if_nan(whatever){
    if (isNaN(whatever)){
        return 0
    }
    return whatever
}

