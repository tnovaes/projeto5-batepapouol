let user = {};

function login(){
    user.name = prompt("Digite seu nome:");
    while(!user.name){
        user.name = prompt("Não deixe o espaço vazio:")
    }
    validation();
}

function validation(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(successValidation);
    promise.catch(errorValidation);
}

function successValidation(succ){
    console.log(succ);
    alert("Você entrou na sala");
    getMessages();
    setInterval(checkStatus, 5000);
    setInterval(getMessages, 3000);
}

function errorValidation(err){
    console.log(err);
    user.name = prompt("Esse nome já está sendo utilizado, escolha outro:");
    validation();

}

function checkStatus(){
    axios
    .post("https://mock-api.driven.com.br/api/v6/uol/status", user)
    .catch(errorStatus);

}

function errorStatus(err){
    console.log(err);
}

function getMessages(){
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    .then(successMessages)
    .catch(errorMessages);
}

function successMessages(succ){
    const msg = succ.data;
    let timeline = document.querySelector(".container");
    
    timeline.innerHTML = "";
    for(let i = 0; i < msg.length; i++){

        if(msg[i].type === "status"){  
            timeline.innerHTML += `
            <div data-test="message" class="text status">
                <span class="time">(${msg[i].time})</span>&nbsp;<span class="nome">${msg[i].from}</span>&nbsp;${msg[i].text}
            </div>
            `
        } else if(msg[i].type === "message"){
            timeline.innerHTML += `
            <div data-test="message" class="text message">
                <span class="time">(${msg[i].time})</span>&nbsp;<span class="nome">${msg[i].from}</span>&nbsp;para&nbsp;<span class="nome">${msg[i].to}:</span>&nbsp;${msg[i].text}
            </div>
            `
        } else if(msg[i].type === "private_message" && (user.name === msg[i].from || user.name === msg[i].to)){
            timeline.innerHTML += `
            <div data-test="message" class="text private">
                <span class="time">(${msg[i].time})</span>&nbsp;<span class="nome">${msg[i].from}</span>&nbsp;para&nbsp;<span class="nome">${msg[i].to}:</span>&nbsp;${msg[i].text}
            </div>
            `
        }
    }
    const lastmsg = document.querySelector(".container .text:last-child")
    lastmsg.scrollIntoView();

}

function errorMessages(err){
    console.log(err);
}

login();

