function getUser() {
    return fetch('http://localhost:3000/game', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            return json.user;
        })
        .catch(function (error) {
            console.error('Erro ao buscar usuário:', error);
        });
}

function alertHola(){
    alert('ola mundo')
}

export default {getUser, alertHola}