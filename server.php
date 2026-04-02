<?php
if (isset($_POST["valorJS"])) {
    // Recebe a string JSON e transforma em array do PHP
    $nova_msg_objeto = json_decode($_POST["valorJS"], true); 
    $arquivo = "data.json";

    $json_antigo = file_get_contents($arquivo);
    $dados = json_decode($json_antigo, true);

    $dados['mensagem'][] = $nova_msg_objeto; // Salva o objeto certinho

    file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT));
}
?>