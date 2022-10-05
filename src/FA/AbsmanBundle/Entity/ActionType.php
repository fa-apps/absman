<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Actiontypes
 *
 * @ORM\Table(name="actiontype")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\ActionTypeRepository")
 */
class ActionType
{
    /**
     * @var string
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="action_type", type="string", length=64, nullable=false)
     */
    private $actionType;

    /**
     * @var string
     *
     * @ORM\Column(name="action_type_text", type="string", length=512, nullable=false)
     */
    private $actionTypeText;



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
     * Set actionType
     *
     * @param string $actionType
     * @return Actiontype
     */
    public function setActionType($actionType)
    {
        $this->actionType = $actionType;

        return $this;
    }

    /**
     * Get actionType
     *
     * @return string 
     */
    public function getActionType()
    {
        return $this->actionType;
    }

    /**
     * Set actionTypeText
     *
     * @param string $actionTypeText
     * @return Actiontype
     */
    public function setActionTypeText($actionTypeText)
    {
        $this->actionTypeText = $actionTypeText;

        return $this;
    }

    /**
     * Get actionTypeText
     *
     * @return string 
     */
    public function getActionTypeText()
    {
        return $this->actionTypeText;
    }
}
