function connexion(){


    const passwd = document.getElementById('password').value;
    if(passwd === "magicMdp"){
        location.assign('gestion.html')
    }
}