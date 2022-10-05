<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Reqstatus
 *
 * @ORM\Table(name="preference")
 * @ORM\Entity
 */
class Preference
{
    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     *
     * @ORM\Column(name="name", type="string", length=64, nullable=true)
     */
    private $name;

    /**
     *
     * @ORM\Column(name="type", type="string", length=64, nullable=true)
     */
    private $type;


   /**
     *
     * @ORM\Column(name="text", type="string", length=64, nullable=true)
     */
    private $text;


    /**
     * @ORM\OneToMany(targetEntity="UserPreference", mappedBy="preference")
     */
    private $userPreferences;





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
     * Constructor
     */
    public function __construct()
    {
        $this->userPreferences = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Preference
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set text
     *
     * @param string $text
     *
     * @return Preference
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * Get text
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Add userPreference
     *
     * @param \FA\AbsmanBundle\Entity\UserPreference $userPreference
     *
     * @return Preference
     */
    public function addUserPreference(\FA\AbsmanBundle\Entity\UserPreference $userPreference)
    {
        $this->userPreferences[] = $userPreference;

        return $this;
    }

    /**
     * Remove userPreference
     *
     * @param \FA\AbsmanBundle\Entity\UserPreference $userPreference
     */
    public function removeUserPreference(\FA\AbsmanBundle\Entity\UserPreference $userPreference)
    {
        $this->userPreferences->removeElement($userPreference);
    }

    /**
     * Get userPreferences
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUserPreferences()
    {
        return $this->userPreferences;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Preference
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }
}
