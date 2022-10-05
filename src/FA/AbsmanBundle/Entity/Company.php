<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="company")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\CompanyRepository")
 */
class Company
{
    /**
     * @var string
     *
     * @ORM\Column(name="id", type="binary", length=16, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
     */
    private $id ;

    /**
     * @var string
     *
     * @ORM\Column(name="company_name", type="string", length=256, nullable=false)
     */
    private $companyName;

    /**
     * @ORM\OneToOne(targetEntity="UGroup")
     * @ORM\JoinColumn(name="group_id", referencedColumnName="id" , nullable=true, onDelete="SET NULL")
     */
    private $defaultGroup;

    /**
     *
     * @ORM\ManyToOne(targetEntity="DisplayNameFormat")
     */
    private $displayNameFormat;

   /**
     * @var string
     *
     * @ORM\Column(name="working_days", type="string", length=256, nullable=false)
     */
    private $workingDays = '0,100,100,100,100,100,0';

    /**
     * @var integer
     *
     * @ORM\Column(name="absence_unit", type="integer", nullable=true)
     */
    private $absenceUnit = '0';

    /**
     * @var float
     *
     * @ORM\Column(name="hours_per_day", type="float", precision=10, scale=0, nullable=false)
     */
    private $hoursPerDay = '0';


    /**
     * @var boolean
     *
     * @ORM\Column(name="manage_ondemand", type="boolean", nullable=false)
     */
    private $manageOnDemand = '0';


    /**
     * @var integer
     *
     * @ORM\Column(name="min_ratio", type="integer", nullable=false)
     */
    private $minRatio = '50';

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=true)
     */
    private $lastUpdate;

    /**
      * @ORM\ManyToOne(targetEntity="Country")
     */
    private $country;

    /**
     * @ORM\ManyToMany(targetEntity="Action", mappedBy="company")
     */
    private $actions;

    /**
     * @ORM\OneToMany(targetEntity="LeaveCategory", mappedBy="company")
     * @ORM\OrderBy({"displayOrder" = "ASC"})
     */
    private $leaveCategories;

    /**
     * @ORM\OneToMany(targetEntity="UGroup", mappedBy="company")
     */
    private $uGroups;


    /**
     * @ORM\OneToMany(targetEntity="User", mappedBy="company")
     */
    private $users;

    /**
     * @ORM\ManyToOne(targetEntity="Workflow")
     */
    private $workflow;



    /**
     * Get binid
     *
     * @return binary
     */
    public function getBinId()
    {
        return pack("H*",$this->id);
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->actions = new \Doctrine\Common\Collections\ArrayCollection();
        $this->leaveCategories = new \Doctrine\Common\Collections\ArrayCollection();
        $this->uGroups = new \Doctrine\Common\Collections\ArrayCollection();
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set companyName
     *
     * @param string $companyName
     *
     * @return Company
     */
    public function setCompanyName($companyName)
    {
        $this->companyName = $companyName;

        return $this;
    }

    /**
     * Get companyName
     *
     * @return string
     */
    public function getCompanyName()
    {
        return $this->companyName;
    }

    /**
     * Set workingDays
     *
     * @param string $workingDays
     *
     * @return Company
     */
    public function setWorkingDays($workingDays)
    {
        $this->workingDays = $workingDays;

        return $this;
    }

    /**
     * Get workingDays
     *
     * @return string
     */
    public function getWorkingDays()
    {
        return $this->workingDays;
    }

    /**
     * Set absenceUnit
     *
     * @param integer $absenceUnit
     *
     * @return Company
     */
    public function setAbsenceUnit($absenceUnit)
    {
        $this->absenceUnit = $absenceUnit;

        return $this;
    }

    /**
     * Get absenceUnit
     *
     * @return integer
     */
    public function getAbsenceUnit()
    {
        return $this->absenceUnit;
    }

    /**
     * Set minRatio
     *
     * @param integer $minRatio
     *
     * @return Company
     */
    public function setMinRatio($minRatio)
    {
        $this->minRatio = $minRatio;

        return $this;
    }

    /**
     * Get minRatio
     *
     * @return integer
     */
    public function getMinRatio()
    {
        return $this->minRatio;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return Company
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
     * Set defaultGroup
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $defaultGroup
     *
     * @return Company
     */
    public function setDefaultGroup(\FA\AbsmanBundle\Entity\UGroup $defaultGroup = null)
    {
        $this->defaultGroup = $defaultGroup;

        return $this;
    }

    /**
     * Get defaultGroup
     *
     * @return \FA\AbsmanBundle\Entity\UGroup
     */
    public function getDefaultGroup()
    {
        return $this->defaultGroup;
    }

    /**
     * Set displayNameFormat
     *
     * @param \FA\AbsmanBundle\Entity\DisplayNameFormat $displayNameFormat
     *
     * @return Company
     */
    public function setDisplayNameFormat(\FA\AbsmanBundle\Entity\DisplayNameFormat $displayNameFormat = null)
    {
        $this->displayNameFormat = $displayNameFormat;

        return $this;
    }

    /**
     * Get displayNameFormat
     *
     * @return \FA\AbsmanBundle\Entity\DisplayNameFormat
     */
    public function getDisplayNameFormat()
    {
        return $this->displayNameFormat;
    }

    /**
     * Set country
     *
     * @param \FA\AbsmanBundle\Entity\Country $country
     *
     * @return Company
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

    /**
     * Add action
     *
     * @param \FA\AbsmanBundle\Entity\Action $action
     *
     * @return Company
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
     * Add leaveCategory
     *
     * @param \FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory
     *
     * @return Company
     */
    public function addLeaveCategory(\FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory)
    {
        $this->leaveCategories[] = $leaveCategory;

        return $this;
    }

    /**
     * Remove leaveCategory
     *
     * @param \FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory
     */
    public function removeLeaveCategory(\FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory)
    {
        $this->leaveCategories->removeElement($leaveCategory);
    }

    /**
     * Get leaveCategories
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getLeaveCategories()
    {
        return $this->leaveCategories;
    }

    /**
     * Add uGroup
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $uGroup
     *
     * @return Company
     */
    public function addUGroup(\FA\AbsmanBundle\Entity\UGroup $uGroup)
    {
        $this->uGroups[] = $uGroup;

        return $this;
    }

    /**
     * Remove uGroup
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $uGroup
     */
    public function removeUGroup(\FA\AbsmanBundle\Entity\UGroup $uGroup)
    {
        $this->uGroups->removeElement($uGroup);
    }

    /**
     * Get uGroups
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUGroups()
    {
        return $this->uGroups;
    }

    /**
     * Add user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return Company
     */
    public function addUser(\FA\AbsmanBundle\Entity\User $user)
    {
        $this->users[] = $user;

        return $this;
    }

    /**
     * Remove user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     */
    public function removeUser(\FA\AbsmanBundle\Entity\User $user)
    {
        $this->users->removeElement($user);
    }

    /**
     * Get users
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * Set manageOnDemand
     *
     * @param boolean $manageOnDemand
     *
     * @return Company
     */
    public function setManageOnDemand($manageOnDemand)
    {
        $this->manageOnDemand = $manageOnDemand;

        return $this;
    }

    /**
     * Get manageOnDemand
     *
     * @return boolean
     */
    public function getManageOnDemand()
    {
        return $this->manageOnDemand;
    }

    /**
     * Set workflow
     *
     * @param \FA\AbsmanBundle\Entity\Workflow $workflow
     *
     * @return Company
     */
    public function setWorkflow(\FA\AbsmanBundle\Entity\Workflow $workflow = null)
    {
        $this->workflow = $workflow;

        return $this;
    }

    /**
     * Get workflow
     *
     * @return \FA\AbsmanBundle\Entity\Workflow
     */
    public function getWorkflow()
    {
        return $this->workflow;
    }

    /**
     * Set hoursPerDay
     *
     * @param float $hoursPerDay
     *
     * @return Company
     */
    public function setHoursPerDay($hoursPerDay)
    {
        $this->hoursPerDay = $hoursPerDay;

        return $this;
    }

    /**
     * Get hoursPerDay
     *
     * @return float
     */
    public function getHoursPerDay()
    {
        return $this->hoursPerDay;
    }
}
