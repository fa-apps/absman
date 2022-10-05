<?php

namespace FA\AbsmanBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * Groups
 *
 * @ORM\Table(name="egroup")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\EGroupRepository")
 */
class EGroup
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
     * @var boolean
     *
     * @ORM\Column(name="is_staff", type="boolean", nullable=false)
     */
    private $isStaff = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_default", type="boolean", nullable=false)
     */
    private $isDefault = false;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=true)
     */
    private $lastUpdate;


    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;


    /**
     * @ORM\OneToMany(targetEntity="EGroupMember", mappedBy="eGroupMember")
     */
    private $eGroupMembers;


    /**
     * @ORM\ManyToMany(targetEntity="Action", mappedBy="eGroup")
     */
    private $actions;



    public function getBinId()
    {
        return pack('H*', $this->id);
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->eGroupMembers = new \Doctrine\Common\Collections\ArrayCollection();
        $this->actions = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @return EGroup
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
     * Set isStaff
     *
     * @param boolean $isStaff
     *
     * @return EGroup
     */
    public function setIsStaff($isStaff)
    {
        $this->isStaff = $isStaff;

        return $this;
    }

    /**
     * Get isStaff
     *
     * @return boolean
     */
    public function getIsStaff()
    {
        return $this->isStaff;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return EGroup
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
     * Set user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return EGroup
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
     * Add eGroupMember
     *
     * @param \FA\AbsmanBundle\Entity\EGroupMember $eGroupMember
     *
     * @return EGroup
     */
    public function addEGroupMember(\FA\AbsmanBundle\Entity\EGroupMember $eGroupMember)
    {
        $this->eGroupMembers[] = $eGroupMember;

        return $this;
    }

    /**
     * Remove eGroupMember
     *
     * @param \FA\AbsmanBundle\Entity\EGroupMember $eGroupMember
     */
    public function removeEGroupMember(\FA\AbsmanBundle\Entity\EGroupMember $eGroupMember)
    {
        $this->eGroupMembers->removeElement($eGroupMember);
    }

    /**
     * Get eGroupMembers
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEGroupMembers()
    {
        return $this->eGroupMembers;
    }

    /**
     * Add action
     *
     * @param \FA\AbsmanBundle\Entity\Action $action
     *
     * @return EGroup
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
     * Set isDefault
     *
     * @param boolean $isDefault
     *
     * @return EGroup
     */
    public function setIsDefault($isDefault)
    {
        $this->isDefault = $isDefault;

        return $this;
    }

    /**
     * Get isDefault
     *
     * @return boolean
     */
    public function getIsDefault()
    {
        return $this->isDefault;
    }
}
