<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="public_day")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\PublicDayRepository")
 */
class PublicDay
{
    /**
     * @var string
     *
     * @ORM\Column(name="id", type="binary", length=16, nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
     */
    private $id = 0;

    /**
     * @var string
     *
     * @ORM\Column(name="pubic_day_name", type="string", length=256, nullable=true)
     */
    private $publicDayName;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="public_day_date", type="date", nullable=true)
     */
    private $publicDayDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="public_day_length", type="integer", nullable=false)
     */
    private $publicDayLength = '0';

    /**
     * @var integer
     *
     * @ORM\Column(name="display_order", type="integer", nullable=true)
     */
    private $displayOrder = '0';

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=false)
     */
    private $lastUpdate;

    /**
     * @ORM\ManyToOne(targetEntity="Company")
     */
    private $company;

    /**
     * @ORM\ManyToMany(targetEntity="UGroup", mappedBy="publicDays")
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
     * Set publicDayName
     *
     * @param string $publicDayName
     *
     * @return PublicDay
     */
    public function setPublicDayName($publicDayName)
    {
        $this->publicDayName = $publicDayName;

        return $this;
    }

    /**
     * Get publicDayName
     *
     * @return string
     */
    public function getPublicDayName()
    {
        return $this->publicDayName;
    }

    /**
     * Set publicDayDate
     *
     * @param \DateTime $publicDayDate
     *
     * @return PublicDay
     */
    public function setPublicDayDate($publicDayDate)
    {
        $this->publicDayDate = $publicDayDate;

        return $this;
    }

    /**
     * Get publicDayDate
     *
     * @return \DateTime
     */
    public function getPublicDayDate()
    {
        return $this->publicDayDate;
    }

    /**
     * Set publicDayLength
     *
     * @param integer $publicDayLength
     *
     * @return PublicDay
     */
    public function setPublicDayLength($publicDayLength)
    {
        $this->publicDayLength = $publicDayLength;

        return $this;
    }

    /**
     * Get publicDayLength
     *
     * @return integer
     */
    public function getPublicDayLength()
    {
        return $this->publicDayLength;
    }

    /**
     * Set displayOrder
     *
     * @param integer $displayOrder
     *
     * @return PublicDay
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
     * @return PublicDay
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
     * @return PublicDay
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
     * @return PublicDay
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
