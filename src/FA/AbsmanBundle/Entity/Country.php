<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Countries
 *
 * @ORM\Table(name="country")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\CountryRepository")
 */
class Country
{
    /**
     * @var binary
     *
     * @ORM\Column(name="id", type="binary", length=16, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
     */
    private $id;


    /**
     * @var string
     *
     * @ORM\Column(name="country_name", type="string", length=256, nullable=true)
     */
    private $countryName;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=true)
     */
    private $lastUpdate;

    /**
     * @ORM\ManyToMany(targetEntity="Action", mappedBy="country")
     */
    private $actions;


    /**
     * @ORM\OneToMany(targetEntity="Company", mappedBy="country")
     */
    private $companies;


    /**
     * Get binaryId
     *
     * @return string
     */
    public function getBinId()
    {
        return pack('H*', $this->id);

    }


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->actions = new \Doctrine\Common\Collections\ArrayCollection();
        $this->companies = new \Doctrine\Common\Collections\ArrayCollection();
    }

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
     * Set countryName
     *
     * @param string $countryName
     *
     * @return Country
     */
    public function setCountryName($countryName)
    {
        $this->countryName = $countryName;

        return $this;
    }

    /**
     * Get countryName
     *
     * @return string
     */
    public function getCountryName()
    {
        return $this->countryName;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return Country
     */
    public function setLastUpdate($lastUpdate)
    {
        $this->lastUpdate = $lastUpdate;

        return $this;
    }

    /**
     * Get lastUpdate
     *
     * @return \DateTime
     */
    public function getLastUpdate()
    {
        return $this->lastUpdate;
    }

    /**
     * Add action
     *
     * @param \FA\AbsmanBundle\Entity\Action $action
     *
     * @return Country
     */
    public function addAction(\FA\AbsmanBundle\Entity\Action $action)
    {
        $this->actions[] = $action;

        return $this;
    }

    /**
     * Remove action
     *
     * @param \FA\AbsmanBundle\Entity\Action $action
     */
    public function removeAction(\FA\AbsmanBundle\Entity\Action $action)
    {
        $this->actions->removeElement($action);
    }

    /**
     * Get actions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getActions()
    {
        return $this->actions;
    }

    /**
     * Add company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     *
     * @return Country
     */
    public function addCompany(\FA\AbsmanBundle\Entity\Company $company)
    {
        $this->companies[] = $company;

        return $this;
    }

    /**
     * Remove company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     */
    public function removeCompany(\FA\AbsmanBundle\Entity\Company $company)
    {
        $this->companies->removeElement($company);
    }

    /**
     * Get companies
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCompanies()
    {
        return $this->companies;
    }
}
