const formulario = document.querySelector("#formCadastro");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const usuario = {
        nome: document.querySelector("#nome").value,
        usuario: document.querySelector("#usuario").value,
        login: document.querySelector("#login").value,
        senhausuario: document.querySelector("#senha").value,
        email: document.querySelector("#email").value,
        contaAtiva: true
    };

    try {
        // Rota corrigida de '/cadastrousuarios' para '/usuarios'
        const resposta = await fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (resposta.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";
        } else {
            const erroText = await resposta.text();
            console.error("Erro do servidor:", erroText);
            alert("Erro ao cadastrar usuário! Verifique os dados inseridos.");
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});