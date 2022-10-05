<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Actors
 *
 * @ORM\Table(name="country_admin")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\CountryAdminRepository")
 */
class CountryAdmin
{
    /**
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     *
     * @ORM\ManyToOne(targetEntity="Role")
     */
    private $role;

    /**
     * @var \Users
     *
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="Country")
     *
     */
    private $country;



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
     * Set role
     *
     * @param \FA\AbsmanBundle\Entity\Role $role
     *
     * @return CountryAdmin
     */
    public function setRole(\FA\AbsmanBundle\Entity\Role $role = null)
    {
        $this->role = $role;

        return $this;
    }

    /**
     * Get role
     *
     * @return \FA\AbsmanBundle\Entity\Role
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * Set user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return CountryAdmin
     */
    public function setUser(\FA\AbsmanBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set country
     *
     * @param \FA\AbsmanBundle\Entity\Country $country
     *
     * @return CountryAdmin
     */
    public function setCountry(\FA\AbsmanBundle\Entity\Country $country = null)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return \FA\AbsmanBundle\Entity\Country
     */
    public function getCountry()
    {
        return $this->country;
    }
}
