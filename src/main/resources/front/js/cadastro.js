const formulario = document.querySelector("#formCadastro");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Certifique-se de que os nomes das CHAVES à esquerda batem com o Java
    const usuarioParaCadastrar = {
        nome: document.querySelector("#nome").value,
        usuario: document.querySelector("#usuario").value,      // Envia para o campo 'usuario' do Java
        login: document.querySelector("#login").value,
        email: document.querySelector("#email").value,
        senhausuario: document.querySelector("#senha").value,   // Envia para o campo 'senhausuario' do Java
        contaAtiva: true
    };

    try {
        const resposta = await fetch("http://localhost:8080/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarioParaCadastrar)
        });

        if (resposta.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";
        } else {
            const erroMsg = await resposta.text();
            console.error("Erro do servidor:", erroMsg);
            alert("Erro ao cadastrar: " + erroMsg);
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});