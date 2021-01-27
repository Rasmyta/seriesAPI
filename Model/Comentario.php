<?php

namespace Series;

class Comentario
{

    private $id; 
    private $nombre;
    private $nota;
    private $comentario;
    private $id_serie;

    public function __construct($id, $nombre, $nota, $comentario, $id_serie)
    {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->nota = $nota;
        $this->comentario = $comentario;
        $this->id_serie = $id_serie;
    }

    /**
     * Get the value of id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of nombre
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set the value of nombre
     *
     * @return  self
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * Get the value of nota
     */
    public function getNota()
    {
        return $this->nota;
    }

    /**
     * Set the value of nota
     *
     * @return  self
     */
    public function setNota($nota)
    {
        $this->nota = $nota;

        return $this;
    }

    /**
     * Get the value of comentario
     */
    public function getComentario()
    {
        return $this->comentario;
    }

    /**
     * Set the value of comentario
     *
     * @return  self
     */
    public function setComentario($comentario)
    {
        $this->comentario = $comentario;

        return $this;
    }

    /**
     * Get the value of id_serie
     */ 
    public function getId_serie()
    {
        return $this->id_serie;
    }

    /**
     * Set the value of id_serie
     *
     * @return  self
     */ 
    public function setId_serie($id_serie)
    {
        $this->id_serie = $id_serie;

        return $this;
    }
}
