


document.addEventListener('keypress', (e)=>{

    if(e.code === 'KeyD'){
        document.getElementById('notConnected').classList.add('hidden');
        document.getElementById('divChoixJoueur').classList.remove('hidden')
    }
})

const p = document.getElementById('pointDeVie');
const kills = document.getElementById('kill');
const temps = document.getElementById('temps');
const cercleTrans = document.getElementById('divCercleTrans');
affichePointDeVie(1);
afficheKill(0);
afficheTemps(0);

export function affichePointDeVie(points){
    if(points <= 0){
        mort()
    }
    p.innerText = points;
}
export function afficheKill(kill){

    kills.innerText = kill;
}
function mort(){
    const connected = document.getElementById("connected")
    const titleFin = document.getElementById("titleFin")
    const cercleTranss = document.getElementById("cercleTrans")
    cercleTranss.classList.remove("bg-indigo-600")
    cercleTranss.classList.add("bg-red-600")
    titleFin.innerText = "Vous êtes morts."
    cercleTrans.classList.remove("hidden")
    connected.classList.add("hidden")
}
export function endGame(){
    const titleFin = document.getElementById("titleFin")
    const cercleTranss = document.getElementById("cercleTrans")
    cercleTranss.classList.remove("bg-red-600")
    cercleTranss.classList.add("bg-indigo-600")
    titleFin.innerText = "Partie Terminée."
    const connected = document.getElementById("connected")
    cercleTrans.classList.remove("hidden")
    connected.classList.add("hidden")


}

export async function afficheTemps(tempss){
    if(tempss > 0){
        let t = tempss;
        var l = setInterval(()=>{
            t = t-1;

            temps.innerText = (Math.ceil(t/60) < 10 ? "0"+Math.ceil(t/60) : Math.ceil(t/60))-1  + ":" + (t%60 < 10 ? "0"+t%60 : t%60)
            if(t <= 0){
                clearInterval(l);
                console.log("end game")
                endGame()
            }
        }, 1000);
    }
}



function afficheChoix(){

}





var canvas, ctx;

window.addEventListener('load', () => {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resize();

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', Draw);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
    canvas.addEventListener('touchmove', Draw);
    window.addEventListener('resize', resize);

});




var width, height, radius, x_orig, y_orig;
function resize() {
    width = 500;
    radius = 70;
    height = radius * 6.5;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    background();
    joystick(width / 2, height / 3);
}

function background() {
    x_orig = width / 2;
    y_orig = height / 3;

    ctx.beginPath();
    ctx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
    ctx.fillStyle = '#ECE5E5';
    ctx.fill();
}

function joystick(width, height) {
    ctx.beginPath();
    ctx.arc(width, height, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgb(67, 147, 108)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(77,153,113)';
    ctx.lineWidth = 8;
    ctx.stroke();
}

let coord = { x: 0, y: 0 };
let paint = false;

function getPosition(event) {
    var mouse_x = event.clientX || event.touches[0].clientX;
    var mouse_y = event.clientY || event.touches[0].clientY;
    coord.x = mouse_x - canvas.offsetLeft +80 ;
    coord.y = mouse_y - canvas.offsetTop +80;
}

function is_it_in_the_circle() {
    var current_radius = Math.sqrt(Math.pow(coord.x - x_orig, 2) + Math.pow(coord.y - y_orig, 2));
    if (radius >= current_radius) return true
    else return false
}


function startDrawing(event) {
    paint = true;
    getPosition(event);
    if (is_it_in_the_circle()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        joystick(coord.x, coord.y);
        Draw();
    }
}


function stopDrawing() {
    paint = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    joystick(width / 2, height / 3);
    /* document.getElementById("x_coordinate").innerText = 0;
     document.getElementById("y_coordinate").innerText = 0;
     document.getElementById("speed").innerText = 0;
     document.getElementById("angle").innerText = 0;
 */
}

function Draw(event) {

    if (paint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        var angle_in_degrees,x, y, speed;
        var angle = Math.atan2((coord.y - y_orig), (coord.x - x_orig));

        if (Math.sign(angle) == -1) {
            angle_in_degrees = Math.round(-angle * 180 / Math.PI);
        }
        else {
            angle_in_degrees =Math.round( 360 - angle * 180 / Math.PI);
        }


        if (is_it_in_the_circle()) {
            joystick(coord.x, coord.y);
            x = coord.x;
            y = coord.y;
        }
        else {
            x = radius * Math.cos(angle) + x_orig;
            y = radius * Math.sin(angle) + y_orig;
            joystick(x, y);
        }


        getPosition(event);

        var speed =  Math.round(100 * Math.sqrt(Math.pow(x - x_orig, 2) + Math.pow(y - y_orig, 2)) / radius);

        var x_relative = Math.round(x - x_orig);
        var y_relative = Math.round(y - y_orig);

        /*console.log("x:"+x_relative);
        console.log(", y:"+y_relative);
        console.log(", speed:"+speed);
        console.log(", angle:"+angle_in_degrees);
        */
        var json = {x,y,speed,angle};
        console.log(json);


        /* document.getElementById("x_coordinate").innerText =  x_relative;
         document.getElementById("y_coordinate").innerText =y_relative ;
         document.getElementById("speed").innerText = speed;
         document.getElementById("angle").innerText = angle_in_degrees;
         */

    }
}