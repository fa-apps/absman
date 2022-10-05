<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AppLogs
 *
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\AppLogRepository")
 * @ORM\Table(name="applog")
 */
class AppLog
{
    /**
     * @var binary
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;



    /**
     * @var \DateTime
     *
     * @ORM\Column(name="log_date", type="datetime", nullable=false)
     */
    private $logDate;

    /**
     * @var string
     *
     * @ORM\Column(name="log_text", type="text", nullable=false)
     */
    private $logText;

    /**
     * @ORM\ManyToOne(targetEntity="ActionType")
     */
    private $actionType;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;




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
     * Set logDate
     *
     * @param \DateTime $logDate
     *
     * @return AppLog
     */
    public function setLogDate($logDate)
    {
        $this->logDate = $logDate;

        return $this;
    }

    /**
     * Get logDate
     *
     * @return \DateTime
     */
    public function getLogDate()
    {
        return $this->logDate;
    }

    /**
     * Set logText
     *
     * @param string $logText
     *
     * @return AppLog
     */
    public function setLogText($logText)
    {
        $this->logText = $logText;

        return $this;
    }

    /**
     * Get logText
     *
     * @return string
     */
    public function getLogText()
    {
        return $this->logText;
    }

    /**
     * Set actionType
     *
     * @param \FA\AbsmanBundle\Entity\ActionType $actionType
     *
     * @return AppLog
     */
    public function setActionType(\FA\AbsmanBundle\Entity\ActionType $actionType = null)
    {
        $this->actionType = $actionType;

        return $this;
    }

    /**
     * Get actionType
     *
     * @return \FA\AbsmanBundle\Entity\ActionType
     */
    public function getActionType()
    {
        return $this->actionType;
    }

    /**
     * Set user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return AppLog
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
}
