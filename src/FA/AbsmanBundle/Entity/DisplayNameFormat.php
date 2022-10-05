<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DisplayNameFormat
 *
 * @ORM\Table(name="displayname_format")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\DisplayNameFormatRepository")
 */
class DisplayNameFormat
{
    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="format", type="string", length=256, nullable=false)
     */
    private $format;


    /**
     * @var string
     *
     * @ORM\Column(name="template", type="string", length=256, nullable=false)
     */
    private $template;



    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set format
     *
     * @param string $format
     *
     * @return DisplayNameFormat
     */
    public function setFormat($format)
    {
        $this->format = $format;

        return $this;
    }

    /**
     * Get format
     *
     * @return string
     */
    public function getFormat()
    {
        return $this->format;
    }

    /**
     * Set template
     *
     * @param string $template
     *
     * @return DisplayNameFormat
     */
    public function setTemplate($template)
    {
        $this->template = $template;

        return $this;
    }

    /**
     * Get template
     *
     * @return string
     */
    public function getTemplate()
    {
        return $this->template;
    }
}
