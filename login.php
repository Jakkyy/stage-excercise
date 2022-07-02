<?php

    $current_data = file_get_contents('archivio.json');
    $array_data = json_decode($current_data, true);

    if(!$array_data) {
        //echo 0 --> nessun dato salvato
        echo "0;denied";
        return;
    }

    foreach ($array_data as $key => $value) {

        if($value["email"] == $_POST["inputEmail"]) {

            $psw =  base64_encode(strrev($_POST["inputPassword"]));
            
            if($psw == $value["password"]) {
                //echo 2 --> match trovato

                $utente = array(
                    "nome" => base64_encode(base64_encode($value["nome"])),
                    "email" => base64_encode(base64_encode($value["email"])),
                    "username" => base64_encode(base64_encode($value["username"])),
                );

                $str = json_encode($utente);
                echo "2;$str";
                return;
            } else {
                //echo 3 --> mail trovata ma non password
                echo "3;denied";
                return;
            }
        }
    }

    //echo 1 --> mail e psw non trovate
    echo "1;denied";
    return;
?>

