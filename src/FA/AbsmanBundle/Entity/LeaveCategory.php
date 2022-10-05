<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * VariousAbscat
 *
 * @ORM\Table(name="leave_category")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\LeaveCategoryRepository")

 */
class LeaveCategory
{
    /**
     * @var string
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
     * @ORM\Column(name="category_name", type="string", length=256, nullable=true)
     */
    private $categoryName;

    /**
     * @var string
     *
     * @ORM\Column(name="category_text", type="string", length=1024, nullable=true)
     */
    private $categoryText;

    /**
     * @var integer
     *
     * @ORM\Column(name="max_days", type="integer", nullable=true)
     */
    private $maxDays = '0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="auto_approvable", type="boolean", nullable=false)
     */
    private $autoApprovable = '0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="justification_not_required", type="boolean", nullable=false)
     */
    private $justificationNotRequired = '0';

    /**
     * @var integer
     *
     * @ORM\Column(name="display_order", type="integer", nullable=false)
     */
    private $displayOrder;

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
     * @ORM\ManyToMany(targetEntity="UGroup", mappedBy="leaveCategories")
     *
     */
    private $groups;


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
     * @return LeaveCategory
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
     * @return LeaveCategory
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
     * Set maxDays
     *
     * @param integer $maxDays
     *
     * @return LeaveCategory
     */
    public function setMaxDays($maxDays)
    {
        $this->maxDays = $maxDays;

        return $this;
    }

    /**
     * Get maxDays
     *
     * @return integer
     */
    public function getMaxDays()
    {
        return $this->maxDays;
    }

    /**
     * Set autoApprovable
     *
     * @param boolean $autoApprovable
     *
     * @return LeaveCategory
     */
    public function setAutoApprovable($autoApprovable)
    {
        $this->autoApprovable = $autoApprovable;

        return $this;
    }

    /**
     * Get autoApprovable
     *
     * @return boolean
     */
    public function getAutoApprovable()
    {
        return $this->autoApprovable;
    }

    /**
     * Set justificationNotRequired
     *
     * @param boolean $justificationNotRequired
     *
     * @return LeaveCategory
     */
    public function setJustificationNotRequired($justificationNotRequired)
    {
        $this->justificationNotRequired = $justificationNotRequired;

        return $this;
    }

    /**
     * Get justificationNotRequired
     *
     * @return boolean
     */
    public function getJustificationNotRequired()
    {
        return $this->justificationNotRequired;
    }

    /**
     * Set displayOrder
     *
     * @param integer $displayOrder
     *
     * @return LeaveCategory
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
     * @return LeaveCategory
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
     * @return LeaveCategory
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
     * @return LeaveCategory
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
}
