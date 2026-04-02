let sala_msg = document.getElementById("conversa_room");
let sala_principal = document.getElementById("sala_principal");
let sala_login = document.getElementById("login");
let chat = document.getElementById("chat");
let enviar = document.getElementById("enviar");
let salvar_user = document.getElementById("salvar_user");
let nome_user = document.getElementById("nome_user");
let idade_user = document.getElementById("idade_user");
let skins_possiveis = ["skin_padrao.png","skin_negro","menina.png","menina_negra.png"]
let user = {
    nome:"",idade:0,skin:"",status:false
    };
//funcão de pegar o usuario,la ele kkkk.
function getUser(){
    if(localStorage.length !== 0){
        let dadosSalvos = localStorage.getItem('keyUser');
        if(!dadosSalvos){
            return null;
        }
        return JSON.parse(dadosSalvos);
    
}
}
//o o usuario foi redefinido pela funcao.
let usuario_encontrado = getUser();
if(usuario_encontrado){
    user = usuario_encontrado;
}
//função de leitura do banco de dados.
async function leitura_data(){
    try{
        let resposta = await fetch("data.json");
        if(!resposta.ok){
            throw new Error("não foi possivel carregar os dados")
        }
        let dados = await resposta.json();
        return dados;
    }
    catch(erro){
        console.log(erro);
    }
}
//leitura de dados.
async function looping_mensagens(){
    let dados = await leitura_data();
    
    // Verificação de segurança: se não houver dados ou mensagens, não faz nada
    if(dados && dados.mensagem && Array.isArray(dados.mensagem)){
        sala_msg.innerHTML = ""; // Limpa a sala para não duplicar
        
        dados.mensagem.forEach(function(msg){
            // Criamos uma DIV para envelopar cada bloco de mensagem (importante para o CSS)
            let wrapper = document.createElement("div");
            wrapper.className = "msg-wrapper"; 
            wrapper.style.marginBottom = "15px"; // Espaço entre as mensagens

            // 1. Imagem da Skin
            let img_skin = document.createElement("img");
            // Se a skin não existir no JSON, ele usa a padrão
            img_skin.src = msg.skin ? msg.skin : "sikin_padrao.png";
            img_skin.className = "chat-avatar";
            
            // 2. Tag do Nome
            let span = document.createElement('span');
            span.className = "user-tag";
            span.textContent = msg.nome + ": ";

            // 3. Texto da Mensagem
            let div_msg = document.createElement("div");
            div_msg.className = "message";
            div_msg.textContent = msg.text;

            // --- ORDEM DO DESENHO ---
            wrapper.appendChild(img_skin);
            wrapper.appendChild(span);
            wrapper.appendChild(div_msg);
            
            // Joga o envelope completo na sala de chat
            sala_msg.appendChild(wrapper);
        });
        
        // Scroll automático para o final
        sala_msg.scrollTop = sala_msg.scrollHeight;
    } else {
        console.log("Nenhuma mensagem encontrada no JSON ou formato inválido.");
    }
}

//evento do botão principal de login.
salvar_user.addEventListener("click",function(){
    let nome_usuario = nome_user.value;
    let idade_usuario = idade_user.value;
    let skin_selecionada = document.querySelector('input[name="selecionar"]:checked').value;
    if(nome_usuario !== "" && idade_usuario !== ""){
        let falso_user = {
    nome:"",idade:0,skin:"",status:false
    };
        sala_login.style.display ='none';
        sala_principal.style.display ='block';
        falso_user.nome = nome_usuario;
        falso_user.idade = idade_usuario;
        falso_user.status = true;
        falso_user.skin = skin_selecionada;
        localStorage.setItem('keyUser',JSON.stringify(falso_user));
        user = falso_user;
    }
    else{
        
        
    }
})
//o processo de enviar as mensagens para o data bank.
enviar.addEventListener("click",function(e){
    e.preventDefault();
    let text_mensagem = chat.value;
    let nome_user = user.nome;
    let skin_user = user.skin;
    let mensagem ={text:text_mensagem,nome:nome_user,skin:skin_user}
    if(mensagem!==""){
        
fetch('server.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'valorJS=' + encodeURIComponent(JSON.stringify(mensagem))
})
.then(response => response.text())
.then(data => console.log(data));

        
        chat.value = "";
    }
    
});

if(user.status !== false){
    sala_login.style.display ='none';
    sala_principal.style.display ='block';
    setInterval(looping_mensagens,3000);
}

