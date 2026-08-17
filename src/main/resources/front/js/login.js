const formulario = document.querySelector("#formLogin");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Monta o objeto exatamente com as chaves esperadas pela entidade Usuario.java
    const usuario = {
        email: document.querySelector("#email").value,
        senhausuario: document.querySelector("#senha").value
    };

    try {
        const resposta = await fetch("http://localhost:8080/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario) // Envia o JSON no corpo da requisição
        });

        if (resposta.ok) {
            const usuarioLogado = await resposta.json();

            // Salva os dados na sessão
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

            alert(`Bem-vindo(a), ${usuarioLogado.nome}!`);
            window.location.href = "dashboard.html";
        } else {
            const erroText = await resposta.text();
            console.error("Erro do servidor:", erroText);
            alert("E-mail ou senha inválidos.");
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
    }
});