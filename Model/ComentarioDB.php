<?php

namespace Series;

include_once "ConexionDB.php";
include_once "Utils.php";

use Series\ConexionDB;
use Series\Utils;
use Exception;

class ComentarioDB
{

    /**
     * Obtiene todos los comentarios de una serie y los devuelven en un array codificado.
     */
    public static function getComentarios($id_serie)
    {
        try {
            $collection = ConexionDB::conectar("seriesAPI")->comentarios;
            $cursor = $collection->find(['id_serie' => $id_serie]);
            $result = [];

            foreach ($cursor as $document) {
                $result[] = $document;
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        ConexionDB::desconectar();
        return json_encode($result);
    }

    /**
     * Añade un nuevo comentario a una serie. Devuelve el 1 si se ha insertado correctamente.
     */
    public static function newComentario($post)
    {
        array_pop($post); //Quitamos 'action'
        try {
            $collection = ConexionDB::conectar("seriesAPI")->comentarios;
            // Filtramos lo que obtenemos por POST
            $post_limpio = [];
            $post_limpio['id'] = Utils::getNewId($collection);
            foreach ($post as $key => $value) {
                $post_limpio[$key] = Utils::filtrado($value);
            }
            $post_limpio['nota'] = (int)$post_limpio['nota'];

            $result = $collection->insertOne($post_limpio);
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        ConexionDB::desconectar();
        return $result->getInsertedCount();
    }
}
