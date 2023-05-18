//localstorage
const tokens = JSON.parse(localStorage.getItem('token')) || []

//
document.querySelector('#login').addEventListener('click', async (e) => {
    e.preventDefault()

    const name = document.querySelector('#name').value
    const password = document.querySelector('#password').value

    const token = await login(name, password);

    if (token) {
        //salva o novo token
        localStorage.setItem("token", JSON.stringify(token.token))
        //
        alert('LOGIN FEITO COM SUCESSO')
        //
        limpaToken()
        //
        redirect(token.id)
    }

})

//LOGIN 
async function login(name, senha) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                senha: senha
            }),
        });

        if (response.ok) {
            const data = await response.json(); // Converter a resposta para JSON

            const token = data.token; // Extrair o token da mensagem
            const id = data.id

            return { token, id }
        } else {
            const errorData = await response.json(); // Converter a resposta de erro para JSON
            alert(errorData.msg);
        }
    } catch (error) {
        console.error('Erro ao atualizar:', error);
    }
}

//limpar O TOKEN LOCALSTORAGE

function limpaToken() {
    setTimeout(() => {
        localStorage.removeItem('token')
    }, 100000)
}

function redirect(id) {
    const token = localStorage.getItem('token').replace(/"/g, '');
    console.log(token);
    fetch('/user/' + id, {
        headers: {
            'authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            console.log(response);
            //window.location.href = '/user/' + id
        })
        .catch(error => {
            console.log('erro.. tente novamente' + error)
        });

}