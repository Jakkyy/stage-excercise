<?php

    $registered_email = false;
    $current_data = file_get_contents('archivio.json');
    $array_data = json_decode($current_data, true);

    $utente = array(
        "nome" => $_POST["inputNome"],
        "cognome" => $_POST["inputCognome"],
        "email" => $_POST["inputEmail"],
        "password" => $_POST["inputPassword"],
        "username" => $_POST["inputUsername"],
    );

    if($array_data) {
        foreach ($array_data as $key => $value) {

            if($value["email"] == $_POST["inputEmail"]) {
                echo "0";
                return;
            } 

        }
    }


    $array_data[] = $utente;

    file_put_contents('archivio.json', json_encode($array_data, JSON_PRETTY_PRINT));

    echo "1";
    return;
?>