<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Actors
 *
 * @ORM\Table(name="actor")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\ActorRepository")
 */
class Actor
{
    /**
     * @var binary
     *
     * @ORM\Column(name="id", length=16, type="binary", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
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
     * Get id
     *
     * @return binary
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set targetId
     *
     * @param binary $targetId
     *
     * @return Actor
     */
    public function setTargetId($targetId)
    {
        $this->targetId = $targetId;

        return $this;
    }

    /**
     * Get targetId
     *
     * @return binary
     */
    public function getTargetId()
    {
        return $this->targetId;
    }

    /**
     * Set roleOrder
     *
     * @param integer $roleOrder
     *
     * @return Actor
     */
    public function setRoleOrder($roleOrder)
    {
        $this->roleOrder = $roleOrder;

        return $this;
    }

    /**
     * Get roleOrder
     *
     * @return integer
     */
    public function getRoleOrder()
    {
        return $this->roleOrder;
    }

    /**
     * Set role
     *
     * @param \FA\AbsmanBundle\Entity\Role $role
     *
     * @return Actor
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
     * @return Actor
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
     * Constructor
     */
    public function __construct()
    {
        $this->country = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add country
     *
     * @param \FA\AbsmanBundle\Entity\Country $country
     *
     * @return Actor
     */
    public function addCountry(\FA\AbsmanBundle\Entity\Country $country)
    {
        $this->country[] = $country;

        return $this;
    }

    /**
     * Remove country
     *
     * @param \FA\AbsmanBundle\Entity\Country $country
     */
    public function removeCountry(\FA\AbsmanBundle\Entity\Country $country)
    {
        $this->country->removeElement($country);
    }

    /**
     * Get country
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCountry()
    {
        return $this->country;
    }
}
