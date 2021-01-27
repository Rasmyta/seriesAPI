<?php

namespace Series;

use MongoDB\Client;
use \Exception;

require '../vendor/autoload.php';

class ConexionDB
{

    private static $conexion;

    public static function conectar($database, $host = "mongodb://localhost:27017", $user = "admin", $password = "admin")
    {
        try {
            //CONEXIÓN A MONGODB CLOUD ATLAS
            $host = "mongodb+srv://rasma:rasma@entorno-servidor.ekmvw.mongodb.net/seriesAPI?retryWrites=true&w=majority&ssl=true";
            // $host = getenv('SERIES_MONGODB_URI');
            self::$conexion = (new Client($host))->$database;
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        return self::$conexion;
    }

    public static function desconectar()
    {
        self::$conexion = null;
    }
}

