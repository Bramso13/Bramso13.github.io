
//multipleSocket();
if(document.cookie === ""){
    document.cookie = "uuid="+window.crypto.randomUUID();
}

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
function mort(tueur){
    const connected = document.getElementById("connected")
    const titleFinMort = document.getElementById("titleFinMort")
    const titleFin = document.getElementById("titleFin")
    const cercleTranss = document.getElementById("cercleTrans")
    cercleTranss.classList.remove("bg-indigo-600")
    cercleTranss.classList.add("bg-red-600")
    titleFin.innerText = "Vous êtes morts."
    titleFinMort.innerText = "Tué par : "+tueur
    cercleTrans.classList.remove("hidden")
    connected.classList.add("hidden")
}
export function endGame(){
    const titleFin = document.getElementById("titleFin")
    const titleFinMort = document.getElementById("titleFinMort")
    const cercleTranss = document.getElementById("cercleTrans")
    cercleTranss.classList.remove("bg-red-600")
    cercleTranss.classList.add("bg-indigo-600")
    titleFin.innerText = "Partie Terminée."
    titleFinMort.innerText = ""
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
        var json = {speed,angle};
        console.log(JSON.stringify(json));
        window.socket.send(JSON.stringify(json));


        /* document.getElementById("x_coordinate").innerText =  x_relative;
         document.getElementById("y_coordinate").innerText =y_relative ;
         document.getElementById("speed").innerText = speed;
         document.getElementById("angle").innerText = angle_in_degrees;
         */

    }
}

const iput = document.getElementById('nom')
const btJoeur = document.getElementById('boutonJouer')

let socket;

export let nom = ""

iput.addEventListener('input', (e)=>{
    jdenticon.update('#svgIcon', e.target.value)
    nom = e.target.value
})
btJoeur.addEventListener('click', assignName)

function assignName(){
    var canv = document.createElement("canvas")
    var ctx = canv.getContext("2d");
    jdenticon.update("#iconJoueur", nom)
    document.getElementById('divChoixJoueur').classList.add('hidden')
    document.getElementById('notConnected').classList.remove('hidden')
    jdenticon.drawIcon(ctx, nom, 200)

    canv.toBlob((e)=>{
        e.arrayBuffer().then((e)=>{

            window.socket = new WebSocket('ws://192.168.0.2:2002/uid='+document.cookie.split("=")[1]+'&pseudo='+encodeURI(nom));

            window.socket.addEventListener('open', (event) => {
                console.log('Connected to server');


            });

            window.socket.addEventListener('message', (event) => {
                console.log(`Received message: ${event.data}`);
                const data = JSON.parse(event.data)
                switch (data.state){
                    case 0:
                        // Choix des joueurs


                        break;
                    case 1:
                        // Début du jeu
                        afficheTemps(data.temps)
                        affichePointDeVie(data.pv)
                        afficheKill(data.kills)
                        document.getElementById("notConnected").classList.add("hidden")
                        document.getElementById('connected').classList.remove('hidden')
                        break;
                    case 2:
                        // Mort
                        mort(data.tueur)
                        break;
                    case 3:
                        // fin du jeu
                        endGame()
                        break;
                    case 4:
                        // mise à jour kill ou pv
                        affichePointDeVie(data.pv)
                        afficheKill(data.kills)
                        break;
                    case 5:
                        // Bonus
                        eventBonus(data.nom)

                }

            });

            window.socket.addEventListener('close', (event) => {
                console.log('Disconnected from server');
                console.log("En attente...")

                setTimeout(()=>{
                    //location.reload();
                },5000);

            });
        })
    });


}

function attaqueMsg(){
    window.socket.send({
        action: "attaque"
    })
}
function defenceMsg(){
    window.socket.send({
        action: "defense"
    })
}

function eventBonus(){
    window.navigator.vibrate([200, 200, 200, 200, 200])
    let iI = 0
    let intE = setInterval(function(){
        iI+=1
        if(iI < 30){
            beep()
        }
        if(iI === 30){

            clearInterval(intE)

        }
    }, 500)
}
function beep() {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}