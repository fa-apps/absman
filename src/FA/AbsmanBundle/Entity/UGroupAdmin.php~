<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CompanyAdmins
 *
 * @ORM\Table(name="ugroup_admin")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\UGroupAdminRepository")
 */
class UGroupAdmin
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
     *
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="UGroup")
     *
     */
    private $uGroup;




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
     * @return UGroupAdmin
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
     * @return UGroupAdmin
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
     * Set uGroup
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $uGroup
     *
     * @return UGroupAdmin
     */
    public function setUGroup(\FA\AbsmanBundle\Entity\UGroup $uGroup = null)
    {
        $this->uGroup = $uGroup;

        return $this;
    }

    /**
     * Get uGroup
     *
     * @return \FA\AbsmanBundle\Entity\UGroup
     */
    public function getUGroup()
    {
        return $this->uGroup;
    }
}
