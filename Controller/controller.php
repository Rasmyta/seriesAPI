<?php

    include_once "../Model/ComentarioDB.php";
    use Series\ComentarioDB;

    if(isset($_POST['action'])){

        if($_POST['action'] == "newComentario"){
            echo ComentarioDB::newComentario($_POST);
        }

        if($_POST['action'] == "verComentarios"){
            echo ComentarioDB::getComentarios($_POST['id_serie']);
        }
    }