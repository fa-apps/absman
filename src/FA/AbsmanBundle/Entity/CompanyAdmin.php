<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CompanyAdmins
 *
 * @ORM\Table(name="company_admin")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\CompanyAdminRepository")
 */
class CompanyAdmin
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
     * @ORM\ManyToOne(targetEntity="Company")
     *
     */
    private $company;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->company = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * @return CompanyAdmin
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
     * @return CompanyAdmin
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
     * Add company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     *
     * @return CompanyAdmin
     */
    public function addCompany(\FA\AbsmanBundle\Entity\Company $company)
    {
        $this->company[] = $company;

        return $this;
    }

    /**
     * Remove company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     */
    public function removeCompany(\FA\AbsmanBundle\Entity\Company $company)
    {
        $this->company->removeElement($company);
    }

    /**
     * Get company
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * Set company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     *
     * @return CompanyAdmin
     */
    public function setCompany(\FA\AbsmanBundle\Entity\Company $company = null)
    {
        $this->company = $company;

        return $this;
    }
}
