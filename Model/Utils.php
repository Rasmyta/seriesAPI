<?php

namespace Series;

class Utils
{
    /**
     * Encuentra el max ID de la colección y lo incrementa en uno.
     */
    public static function getNewId($collection)
    {
        $document = $collection->findOne([], ['sort' => ['id' => -1]]);
        return isset($document['id']) ? $document['id'] + 1 : 1;
    }

    /**
     * Función para filtrar los valores recibidos de un formulario
     */
    public static function filtrado($datos)
    {
        $datos = trim($datos);
        $datos = stripslashes($datos);
        $datos = filter_var($datos, FILTER_SANITIZE_STRING);

        return $datos;
    }
}
