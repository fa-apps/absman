<?php

namespace FA\AbsmanBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * Groups
 *
 * @ORM\Table(name="egroup_member")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\EGroupMemberRepository")
 */

class EGroupMember
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
     * @var integer
     *
     * @ORM\Column(name="display_order", type="integer", nullable=false)
     */
    private $displayOrder = 0;


    /**
     * @ORM\ManyToOne(targetEntity="Egroup")
     */
    private $eGroup;


    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $eGroupMember;



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
     * Set displayOrder
     *
     * @param integer $displayOrder
     *
     * @return EGroupMember
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
     * Set eGroup
     *
     * @param \FA\AbsmanBundle\Entity\Egroup $eGroup
     *
     * @return EGroupMember
     */
    public function setEGroup(\FA\AbsmanBundle\Entity\Egroup $eGroup = null)
    {
        $this->eGroup = $eGroup;

        return $this;
    }

    /**
     * Get eGroup
     *
     * @return \FA\AbsmanBundle\Entity\Egroup
     */
    public function getEGroup()
    {
        return $this->eGroup;
    }

    /**
     * Set eGroupMember
     *
     * @param \FA\AbsmanBundle\Entity\User $eGroupMember
     *
     * @return EGroupMember
     */
    public function setEGroupMember(\FA\AbsmanBundle\Entity\User $eGroupMember = null)
    {
        $this->eGroupMember = $eGroupMember;

        return $this;
    }

    /**
     * Get eGroupMember
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getEGroupMember()
    {
        return $this->eGroupMember;
    }
}
