<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Countries
 *
 * @ORM\Table(name="user_entitlement")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\UserEntitlementRepository")
 */
class UserEntitlement
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
     * @ORM\Column(name="allocated", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $allocated;

    /**
     * @ORM\Column(name="nleft", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $left;

    /**
     * @ORM\Column(name="onDemand_allocated", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $onDemandAllocated;

    /**
     * @ORM\Column(name="onDemand_left", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $onDemandLeft;

    /**
     * @var boolean
     *
     * @ORM\Column(name="hidden", type="boolean", nullable=false)
     */
    private $hidden = '0';


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
     * @ORM\ManyToOne(targetEntity="EntitledCategory")
     */
    private $entitledCategory;


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
     * Get id
     *
     * @return binary
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set allocated
     *
     * @param string $allocated
     *
     * @return UserEntitlement
     */
    public function setAllocated($allocated)
    {
        $this->allocated = $allocated;

        return $this;
    }

    /**
     * Get allocated
     *
     * @return string
     */
    public function getAllocated()
    {
        return $this->allocated;
    }

    /**
     * Set left
     *
     * @param string $left
     *
     * @return UserEntitlement
     */
    public function setLeft($left)
    {
        $this->left = $left;

        return $this;
    }

    /**
     * Get left
     *
     * @return string
     */
    public function getLeft()
    {
        return $this->left;
    }

    /**
     * Set onDemandAllocated
     *
     * @param string $onDemandAllocated
     *
     * @return UserEntitlement
     */
    public function setOnDemandAllocated($onDemandAllocated)
    {
        $this->onDemandAllocated = $onDemandAllocated;

        return $this;
    }

    /**
     * Get onDemandAllocated
     *
     * @return string
     */
    public function getOnDemandAllocated()
    {
        return $this->onDemandAllocated;
    }

    /**
     * Set onDemandLeft
     *
     * @param string $onDemandLeft
     *
     * @return UserEntitlement
     */
    public function setOnDemandLeft($onDemandLeft)
    {
        $this->onDemandLeft = $onDemandLeft;

        return $this;
    }

    /**
     * Get onDemandLeft
     *
     * @return string
     */
    public function getOnDemandLeft()
    {
        return $this->onDemandLeft;
    }

    /**
     * Set hidden
     *
     * @param boolean $hidden
     *
     * @return UserEntitlement
     */
    public function setHidden($hidden)
    {
        $this->hidden = $hidden;

        return $this;
    }

    /**
     * Get hidden
     *
     * @return boolean
     */
    public function getHidden()
    {
        return $this->hidden;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return UserEntitlement
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
     * @return UserEntitlement
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
     * Set entitledCategory
     *
     * @param \FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory
     *
     * @return UserEntitlement
     */
    public function setEntitledCategory(\FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory = null)
    {
        $this->entitledCategory = $entitledCategory;

        return $this;
    }

    /**
     * Get entitledCategory
     *
     * @return \FA\AbsmanBundle\Entity\EntitledCategory
     */
    public function getEntitledCategory()
    {
        return $this->entitledCategory;
    }
}
