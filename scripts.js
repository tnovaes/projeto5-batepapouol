let user = {};

function validation(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user);
    promise.then(success);
    promise.catch(errorValidation);
}

function success(succ){
    console.log(succ);
    alert("Você entrou na sala");
    setInterval(checkStatus, 5000);
}

function errorValidation(err){
    console.log(err);
    user.name = prompt("Esse nome já está sendo utilizado, escolha outro:");
    validation();

}

function login(){
    user.name = prompt("Digite seu nome:");
    validation();
}

function checkStatus(){
    axios
    .post("https://mock-api.driven.com.br/api/v6/uol/status", user)
    .catch(errorStatus);

}

function errorStatus(err){
    //saiu da sala
}

login();
checkStatus();