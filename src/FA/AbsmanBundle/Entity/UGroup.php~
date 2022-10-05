<?php

namespace FA\AbsmanBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * Groups
 *
 * @ORM\Table(name="ugroup")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\UGroupRepository")
 */
class UGroup
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
     * @var string
     *
     * @ORM\Column(name="group_name", type="string", length=256, nullable=false)
     */
    private $groupName;

    /**
     * @var string
     *
     * @ORM\Column(name="working_days", type="string", length=255, nullable=true)
     */
    private $workingDays = '0,100,100,100,100,100,0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="disable_public_days", type="boolean", nullable=false)
     */
    private $disablePublicDays = false;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=true)
     */
    private $lastUpdate;

    /**
     *
     * @ORM\ManyToOne(targetEntity="Company")
     */
    private $company;

    /**
     * @ORM\ManyToMany(targetEntity="EntitledCategory", inversedBy="groups" )
     * @ORM\JoinTable(name="ugroup_entitledcategory",
     *      joinColumns={@ORM\JoinColumn(name="entitledcategory_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="ugroup_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $entitledCategories;

    /**
     * @ORM\ManyToMany(targetEntity="LeaveCategory", inversedBy="groups")
     * @ORM\JoinTable(name="ugroup_leavecategory",
     *      joinColumns={@ORM\JoinColumn(name="leavecategory_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="ugroup_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $leaveCategories;

    /**
     * @ORM\ManyToMany(targetEntity="PublicDay", inversedBy="ugroups")
     * @ORM\JoinTable(name="ugroup_publicday",
     *      joinColumns={@ORM\JoinColumn(name="publicday_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="ugroup_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $publicDays;


    /**
     * @ORM\ManyToMany(targetEntity="Action", mappedBy="ugroup")
     */
    private $actions;


    /**
     * @ORM\ManyToMany(targetEntity="User", mappedBy="uGroups")
     */
    private $users;




    public function getBinId()
    {
        return pack('H*', $this->id);
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->entitledCategories = new \Doctrine\Common\Collections\ArrayCollection();
        $this->leaveCategories = new \Doctrine\Common\Collections\ArrayCollection();
        $this->publicDays = new \Doctrine\Common\Collections\ArrayCollection();
        $this->actions = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set groupName
     *
     * @param string $groupName
     *
     * @return UGroup
     */
    public function setGroupName($groupName)
    {
        $this->groupName = $groupName;

        return $this;
    }

    /**
     * Get groupName
     *
     * @return string
     */
    public function getGroupName()
    {
        return $this->groupName;
    }

    /**
     * Set workingDays
     *
     * @param string $workingDays
     *
     * @return UGroup
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
     * Set disablePublicDays
     *
     * @param boolean $disablePublicDays
     *
     * @return UGroup
     */
    public function setDisablePublicDays($disablePublicDays)
    {
        $this->disablePublicDays = $disablePublicDays;

        return $this;
    }

    /**
     * Get disablePublicDays
     *
     * @return boolean
     */
    public function getDisablePublicDays()
    {
        return $this->disablePublicDays;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return UGroup
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
     * @return UGroup
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
     * Add entitledCategory
     *
     * @param \FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory
     *
     * @return UGroup
     */
    public function addEntitledCategory(\FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory)
    {
        $this->entitledCategories[] = $entitledCategory;

        return $this;
    }

    /**
     * Remove entitledCategory
     *
     * @param \FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory
     */
    public function removeEntitledCategory(\FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory)
    {
        $this->entitledCategories->removeElement($entitledCategory);
    }

    /**
     * Get entitledCategories
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEntitledCategories()
    {
        return $this->entitledCategories;
    }

    /**
     * Add leaveCategory
     *
     * @param \FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory
     *
     * @return UGroup
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
     * Add publicDay
     *
     * @param \FA\AbsmanBundle\Entity\PublicDay $publicDay
     *
     * @return UGroup
     */
    public function addPublicDay(\FA\AbsmanBundle\Entity\PublicDay $publicDay)
    {
        $this->publicDays[] = $publicDay;

        return $this;
    }

    /**
     * Remove publicDay
     *
     * @param \FA\AbsmanBundle\Entity\PublicDay $publicDay
     */
    public function removePublicDay(\FA\AbsmanBundle\Entity\PublicDay $publicDay)
    {
        $this->publicDays->removeElement($publicDay);
    }

    /**
     * Get publicDays
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPublicDays()
    {
        return $this->publicDays;
    }

    /**
     * Add action
     *
     * @param \FA\AbsmanBundle\Entity\Action $action
     *
     * @return UGroup
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
     * Add user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return UGroup
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
}
