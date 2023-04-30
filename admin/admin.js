const connect = document.getElementById("connexion");
const disconnect = document.getElementById("disconnect");
const gestion = document.getElementById("gestion");
document.getElementById('connect').onclick = () => {
    const host = document.getElementsByName("host")[0].value;
    const port = document.getElementsByName("port")[0].value;
    const admin = document.getElementsByName("admin")[0].value;
    window.ws = new WebSocket(`ws://${host}:${port}/admin=${admin}&pseudo=gamer&uid=123456789`);
    //document.getElementById("state").innerHTML = "Connexion en cours...";
    //document.getElementById("state").style.color = "orange";
    window.ws.onopen = () => {
        //document.getElementById("state").innerHTML = "Connecté";
        //document.getElementById("state").style.color = "green";
        document.getElementById("start").onclick = () => {
            window.ws.send(JSON.stringify({
                admin : {
                    action: "start"
                }}));
        }
        gestion.classList.remove('hidden');
        connect.classList.add('hidden');
        disconnect.onclick = () => {window.ws.close();}
        window.ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const gestionDiv = document.getElementById('gestionDiv')
            while (gestionDiv.firstChild) {
                gestionDiv.removeChild(gestionDiv.lastChild);
            }
            let tab = [];
            Object.keys(data).forEach(function(key, index){

                tab.push({
                    uuid : key.split("/")[1],
                    pseudo : data[key]
                })
            });
            tab.map((value, index)=>{
                const test = '<div class="mt-8 space-y-6" id="valuePlayer">\n' +
                    '            <div class="-space-y-px rounded-md shadow-sm">\n' +
                    '                <div class="flex overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">\n' +
                    '                    <div class="flex justify-center gap-x-4 gap-y-2">\n' +
                    '                        <p class="text-sm leading-6 text-gray-900">\n' +
                    '                            <strong class="font-semibold" id="title">'+value.pseudo+'</strong><svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>'+value.uuid+'\n' +
                    '                        </p>\n' +
                    '                        <a onclick="supprimerJoueur('+value.uuid+')" class="flex-none ml-10 rounded-full bg-red-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">Supprimer <span aria-hidden="true">&rarr;</span></a>\n' +
                    '                    </div>\n' +
                    '\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '        </div>';
                const ddoc = document.createRange().createContextualFragment(test);
                gestionDiv.appendChild(ddoc)
            })
            tab = []


            if (data.error) {
                //document.getElementById("state").innerHTML = "Erreur : " + data.error;
                //document.getElementById("state").style.color = "red";
                setTimeout(() => {
                    //document.getElementById("state").innerHTML = "Connecté";
                    //document.getElementById("state").style.color = "green";
                }, 5000);
            }
        }
        window.ws.onclose = () => {
            //document.getElementById("state").innerHTML = "Hors connexion";
            //document.getElementById("state").style.color = "red";
            connect.classList.remove('hidden')
            gestion.classList.add('hidden')
        }
    }
}
const supprimerJoueur = (uuid) => {
    const msg = {
        admin : {
            action: "supprimer",
            uuid: uuid
        }};
    window.ws.send(JSON.stringify(msg));
}