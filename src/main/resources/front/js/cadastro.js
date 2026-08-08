const formulario = document.querySelector("#formCadastro");


formulario.addEventListener("submit", async (evento)=>{

    evento.preventDefault();


    const usuario = {

        nome: document.querySelector("#nome").value,

        senha: document.querySelector("#senha").value

    };


    const resposta = await fetch(
        "http://localhost:8080/usuarios",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(usuario)
        }
    );


    if(resposta.ok){

        alert("Usuário cadastrado com sucesso!");

        window.location.href="login.html";

    }else{

        alert("Erro ao cadastrar usuário");

    }


});