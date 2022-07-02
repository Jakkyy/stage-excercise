<?php
    $input = file_get_contents('php://input');


    $file = file_get_contents('archivio.json');
    $data = json_decode($file, true);

    foreach ($data as $key => $value) {
        if($value["email"] == $input) {

            $user_data = array(
                "cognome" => $value["cognome"],
                "password" => $value["password"],
            );

            echo json_encode($user_data);
            return;
        }
    }

    echo 1;
    return
?>