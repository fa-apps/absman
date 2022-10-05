<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="entitled_category")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\EntitledCategoryRepository")
 */
class EntitledCategory
{
    /**
     *
     * @ORM\Column(name="id", type="binary", length=16, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
     */
    private $id;

    /**
     *
     * @ORM\Column(name="category_name", type="string", length=256, nullable=true)
     */
    private $categoryName;

    /**
     *
     * @ORM\Column(name="category_text", type="string", length=2048, nullable=true)
     */
    private $categoryText;

    /**
     *
     * @ORM\Column(name="default_value", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $defaultValue;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="valid_from", type="datetime", nullable=true)
     */
    private $validFrom;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="valid_to", type="datetime", nullable=true)
     */
    private $validTo;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enforce_validity", type="boolean", nullable=false)
     */
    private $enforceValidity = '0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="auto_expires", type="boolean", nullable=true)
     */
    private $autoExpires = '0';

    /**
     * @var string
     *
     * @ORM\Column(name="ondemand_default_value", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $onDemandDefaultValue;

    /**
     * @var string
     *
     * @ORM\Column(name="auto_increment", type="string", length=256, nullable=true)
     */
    private $autoIncrement;

    /**
     * @var integer
     *
     * @ORM\Column(name="display_order", type="integer", nullable=true)
     */
    private $displayOrder = 0;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=false)
     */
    private $lastUpdate;

    /**
      *
     * @ORM\ManyToOne(targetEntity="Company")
     */
    private $company;

    /**
     * @ORM\ManyToMany(targetEntity="UGroup", mappedBy="entitledCategories")
     *
     */
    private $groups;

    /**
     * @ORM\OneToMany(targetEntity="UserEntitlement", mappedBy="entitledCategory")
     */
    private $userEntitlements;



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
        $this->groups = new \Doctrine\Common\Collections\ArrayCollection();
        $this->userEntitlements = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set categoryName
     *
     * @param string $categoryName
     *
     * @return EntitledCategory
     */
    public function setCategoryName($categoryName)
    {
        $this->categoryName = $categoryName;

        return $this;
    }

    /**
     * Get categoryName
     *
     * @return string
     */
    public function getCategoryName()
    {
        return $this->categoryName;
    }

    /**
     * Set categoryText
     *
     * @param string $categoryText
     *
     * @return EntitledCategory
     */
    public function setCategoryText($categoryText)
    {
        $this->categoryText = $categoryText;

        return $this;
    }

    /**
     * Get categoryText
     *
     * @return string
     */
    public function getCategoryText()
    {
        return $this->categoryText;
    }

    /**
     * Set defaultValue
     *
     * @param string $defaultValue
     *
     * @return EntitledCategory
     */
    public function setDefaultValue($defaultValue)
    {
        $this->defaultValue = $defaultValue;

        return $this;
    }

    /**
     * Get defaultValue
     *
     * @return string
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * Set validFrom
     *
     * @param \DateTime $validFrom
     *
     * @return EntitledCategory
     */
    public function setValidFrom($validFrom)
    {
        $this->validFrom = $validFrom;

        return $this;
    }

    /**
     * Get validFrom
     *
     * @return \DateTime
     */
    public function getValidFrom()
    {
        return $this->validFrom;
    }

    /**
     * Set validTo
     *
     * @param \DateTime $validTo
     *
     * @return EntitledCategory
     */
    public function setValidTo($validTo)
    {
        $this->validTo = $validTo;

        return $this;
    }

    /**
     * Get validTo
     *
     * @return \DateTime
     */
    public function getValidTo()
    {
        return $this->validTo;
    }

    /**
     * Set enforceValidity
     *
     * @param boolean $enforceValidity
     *
     * @return EntitledCategory
     */
    public function setEnforceValidity($enforceValidity)
    {
        $this->enforceValidity = $enforceValidity;

        return $this;
    }

    /**
     * Get enforceValidity
     *
     * @return boolean
     */
    public function getEnforceValidity()
    {
        return $this->enforceValidity;
    }

    /**
     * Set autoExpires
     *
     * @param boolean $autoExpires
     *
     * @return EntitledCategory
     */
    public function setAutoExpires($autoExpires)
    {
        $this->autoExpires = $autoExpires;

        return $this;
    }

    /**
     * Get autoExpires
     *
     * @return boolean
     */
    public function getAutoExpires()
    {
        return $this->autoExpires;
    }

    /**
     * Set onDemandDefaultValue
     *
     * @param string $onDemandDefaultValue
     *
     * @return EntitledCategory
     */
    public function setOnDemandDefaultValue($onDemandDefaultValue)
    {
        $this->onDemandDefaultValue = $onDemandDefaultValue;

        return $this;
    }

    /**
     * Get onDemandDefaultValue
     *
     * @return string
     */
    public function getOnDemandDefaultValue()
    {
        return $this->onDemandDefaultValue;
    }

    /**
     * Set autoIncrement
     *
     * @param string $autoIncrement
     *
     * @return EntitledCategory
     */
    public function setAutoIncrement($autoIncrement)
    {
        $this->autoIncrement = $autoIncrement;

        return $this;
    }

    /**
     * Get autoIncrement
     *
     * @return string
     */
    public function getAutoIncrement()
    {
        return $this->autoIncrement;
    }

    /**
     * Set displayOrder
     *
     * @param integer $displayOrder
     *
     * @return EntitledCategory
     */
    public function setDisplayOrder($displayOrder)
    {
        $this->displayOrder = $displayOrder;

        return $this;
    }

    /**
     * Get displayOrder
     *
     * @return integer
     */
    public function getDisplayOrder()
    {
        return $this->displayOrder;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return EntitledCategory
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
     * Set company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     *
     * @return EntitledCategory
     */
    public function setCompany(\FA\AbsmanBundle\Entity\Company $company = null)
    {
        $this->company = $company;

        return $this;
    }

    /**
     * Get company
     *
     * @return \FA\AbsmanBundle\Entity\Company
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * Add group
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $group
     *
     * @return EntitledCategory
     */
    public function addGroup(\FA\AbsmanBundle\Entity\UGroup $group)
    {
        $this->groups[] = $group;

        return $this;
    }

    /**
     * Remove group
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $group
     */
    public function removeGroup(\FA\AbsmanBundle\Entity\UGroup $group)
    {
        $this->groups->removeElement($group);
    }

    /**
     * Get groups
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getGroups()
    {
        return $this->groups;
    }

    /**
     * Add userEntitlement
     *
     * @param \FA\AbsmanBundle\Entity\UserEntitlement $userEntitlement
     *
     * @return EntitledCategory
     */
    public function addUserEntitlement(\FA\AbsmanBundle\Entity\UserEntitlement $userEntitlement)
    {
        $this->userEntitlements[] = $userEntitlement;

        return $this;
    }

    /**
     * Remove userEntitlement
     *
     * @param \FA\AbsmanBundle\Entity\UserEntitlement $userEntitlement
     */
    public function removeUserEntitlement(\FA\AbsmanBundle\Entity\UserEntitlement $userEntitlement)
    {
        $this->userEntitlements->removeElement($userEntitlement);
    }

    /**
     * Get userEntitlements
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUserEntitlements()
    {
        return $this->userEntitlements;
    }
}
