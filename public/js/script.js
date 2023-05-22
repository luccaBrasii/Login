import controller from './api.js'

const userName = document.querySelector('.userName')

controller.getUser()
    .then(function (user) {
        userName.innerHTML = user;
    })
    .catch(function (error) {
        console.error('Erro ao buscar usuário:', error);
    });


