const user = {};
let message = {};


function login() {
    user.name = prompt("Digite seu nome:");
    while (!user.name) {
        user.name = prompt("Não deixe o espaço vazio:");
    }
    validation();
}

function validation() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(successValidation);
    promise.catch(errorValidation);
}

function successValidation(scc) {
    console.log(scc);
    alert("Você entrou na sala");
    getMessages();
    setInterval(checkStatus, 5000);
    setInterval(getMessages, 3000);
}

function errorValidation(err) {
    console.log(err);
    user.name = prompt("Esse nome já está sendo utilizado, escolha outro:");
    validation();

}

function checkStatus() {
    axios
        .post("https://mock-api.driven.com.br/api/v6/uol/status", user)
        .catch(errorStatus);

}

function errorStatus(err) {
    console.log(err);
    alert("Você foi desconectado.");
}

function getMessages() {
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then(successMessages)
        .catch(errorMessages);
}

function successMessages(scc) {
    const msg = scc.data;
    const chat = document.querySelector(".container");

    chat.innerHTML = "";
    for (let i = 0; i < msg.length; i++) {

        if (msg[i].type === "status") {
            chat.innerHTML += `
            <div data-test="message" class="text ${msg[i].type}">
                <span class="time">(${msg[i].time})</span>&nbsp;
                <span class="nome">${msg[i].from}</span>&nbsp;${msg[i].text}
            </div>
            `;
        } else if (msg[i].type === "message") {
            chat.innerHTML += `
            <div data-test="message" class="text ${msg[i].type}">
                <span class="time">(${msg[i].time})</span>&nbsp;
                <span class="nome">${msg[i].from}</span>&nbsp;para&nbsp;
                <span class="nome">${msg[i].to}:</span>&nbsp;${msg[i].text}
            </div>
            `;
        } else if (msg[i].type === "private_message" && (user.name === msg[i].from || user.name === msg[i].to)) {
            chat.innerHTML += `
            <div data-test="message" class="text ${msg[i].type}">
                <span class="time">(${msg[i].time})</span>&nbsp;
                <span class="nome">${msg[i].from}</span>&nbsp;reservadamente&nbsp;para&nbsp;
                <span class="nome">${msg[i].to}:</span>&nbsp;${msg[i].text}
            </div>
            `;
        }
    }
    const lastmsg = document.querySelector(".container .text:last-child");
    lastmsg.scrollIntoView();

}

function errorMessages(err) {
    console.log(err);
    alert("Não foi possível atualizar as mensagens do chat.");
}

function sendMessages() {
    const input = document.querySelector(".msg").value;
    if(input !== ""){
    message = {
        from: user.name,
        to: "Todos",
        text: input,
        type: "message"
    };
    postMessages();
    }
}

function postMessages() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message);
    promise.then(successPostMessages);
    promise.catch(errorPostMessages);
}

function successPostMessages(scc) {
    console.log(scc);
    getMessages();
    document.querySelector(".msg").value = "";
}

function errorPostMessages(err) {
    console.log(err);
    window.location.reload();
}



login();

