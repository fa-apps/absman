<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Requests
 *
 * @ORM\Entity
 * @ORM\Table(name="request")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\RequestRepository")
 */

class Request
{
    /**
     *
     * @ORM\Column(name="id", length=16, type="binary", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
     */
    private $id;

    /**
     * @ORM\ManyToMany(targetEntity="PublicDay", inversedBy="Request")
     */
    private $publicDays;


    /**
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="date", nullable=false)
     */
    private $startDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date", type="date", nullable=false)
     */
    private $endDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="start_date_ratio",  type="float", precision=10, scale=0, nullable=false)
     */
    private $startDateRatio = 0;

    /**
     * @var integer
     *
     * @ORM\Column(name="end_date_ratio",  type="float", precision=10, scale=0, nullable=false)
     */
    private $endDateRatio = 0;

    /**
     * @var float
     *
     * @ORM\Column(name="total_request", type="float", precision=10, scale=0, nullable=false)
     */
    private $totalRequest = 0;

    /**
     * @var string
     *
     * @ORM\Column(name="request_text", type="text", nullable=true)
     */
    private $requestText;

   /**
     * @var string
     *
     * @ORM\Column(name="request_context", type="text", nullable=true)
     */
    private $requestContext;

    /**
     *
     * @ORM\ManyToOne(targetEntity="RequestStatus")
     */
    private $requestStatus;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;


     /**
     * @ORM\ManyToMany(targetEntity="Action", mappedBy="request")
     */
    private $actions;

    /**
     * @ORM\ManyToOne(targetEntity="Workflow")
     */
    private $workflow;

   /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $approver;

   /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $standInApprover;

   /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $substitute;

   /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $notified;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="request_date", type="datetime", nullable=false)
     */
    private $requestDate;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $requestedBy;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $approvalBy;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="approval_date", type="datetime", nullable=true)
     */
    private $approvalDate;

    /**
     * @var string
     *
     * @ORM\Column(name="approval_text", type="text", nullable=true)
     */
    private $approvalText;

    /**
     * @var boolean
     *
     * @ORM\Column(name="substitute_ack", type="boolean", nullable=true)
     */
    private $substituteAck;

    /**
     * @var string
     *
     * @ORM\Column(name="substitute_ack_text", type="text", nullable=true)
     */
    private $substituteAckText;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="substitute_ack_date", type="datetime", nullable=true)
     */
    private $substituteAckDate;


    /**
     * @var \DateTime
     *
     * @ORM\Column(name="cancel_date", type="datetime", nullable=true)
     */
    private $cancelDate;


    /**
     * @var string
     *
     * @ORM\Column(name="cancel_text", type="text", nullable=true)
     */
    private $cancelText;


    /**
     * @var boolean
     *
     * @ORM\Column(name="is_cancel_reject", type="boolean", nullable=true)
     */
    private $isCanceledOrRejected = '0';



    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_update", type="datetime", nullable=true)
     */
    private $lastUpdate;



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
        $this->publicDays = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return Request
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate
     *
     * @return Request
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * Set startDateRatio
     *
     * @param integer $startDateRatio
     *
     * @return Request
     */
    public function setStartDateRatio($startDateRatio)
    {
        $this->startDateRatio = $startDateRatio;

        return $this;
    }

    /**
     * Get startDateRatio
     *
     * @return integer
     */
    public function getStartDateRatio()
    {
        return $this->startDateRatio;
    }

    /**
     * Set endDateRatio
     *
     * @param integer $endDateRatio
     *
     * @return Request
     */
    public function setEndDateRatio($endDateRatio)
    {
        $this->endDateRatio = $endDateRatio;

        return $this;
    }

    /**
     * Get endDateRatio
     *
     * @return integer
     */
    public function getEndDateRatio()
    {
        return $this->endDateRatio;
    }

    /**
     * Set totalRequest
     *
     * @param float $totalRequest
     *
     * @return Request
     */
    public function setTotalRequest($totalRequest)
    {
        $this->totalRequest = $totalRequest;

        return $this;
    }

    /**
     * Get totalRequest
     *
     * @return float
     */
    public function getTotalRequest()
    {
        return $this->totalRequest;
    }

    /**
     * Set requestText
     *
     * @param string $requestText
     *
     * @return Request
     */
    public function setRequestText($requestText)
    {
        $this->requestText = $requestText;

        return $this;
    }

    /**
     * Get requestText
     *
     * @return string
     */
    public function getRequestText()
    {
        return $this->requestText;
    }

    /**
     * Set requestContext
     *
     * @param string $requestContext
     *
     * @return Request
     */
    public function setRequestContext($requestContext)
    {
        $this->requestContext = $requestContext;

        return $this;
    }

    /**
     * Get requestContext
     *
     * @return string
     */
    public function getRequestContext()
    {
        return $this->requestContext;
    }

    /**
     * Set requestDate
     *
     * @param \DateTime $requestDate
     *
     * @return Request
     */
    public function setRequestDate($requestDate)
    {
        $this->requestDate = $requestDate;

        return $this;
    }

    /**
     * Get requestDate
     *
     * @return \DateTime
     */
    public function getRequestDate()
    {
        return $this->requestDate;
    }

    /**
     * Set approvalDate
     *
     * @param \DateTime $approvalDate
     *
     * @return Request
     */
    public function setApprovalDate($approvalDate)
    {
        $this->approvalDate = $approvalDate;

        return $this;
    }

    /**
     * Get approvalDate
     *
     * @return \DateTime
     */
    public function getApprovalDate()
    {
        return $this->approvalDate;
    }

    /**
     * Set approvalText
     *
     * @param string $approvalText
     *
     * @return Request
     */
    public function setApprovalText($approvalText)
    {
        $this->approvalText = $approvalText;

        return $this;
    }

    /**
     * Get approvalText
     *
     * @return string
     */
    public function getApprovalText()
    {
        return $this->approvalText;
    }

    /**
     * Set substituteAck
     *
     * @param boolean $substituteAck
     *
     * @return Request
     */
    public function setSubstituteAck($substituteAck)
    {
        $this->substituteAck = $substituteAck;

        return $this;
    }

    /**
     * Get substituteAck
     *
     * @return boolean
     */
    public function getSubstituteAck()
    {
        return $this->substituteAck;
    }

    /**
     * Set substituteAckText
     *
     * @param string $substituteAckText
     *
     * @return Request
     */
    public function setSubstituteAckText($substituteAckText)
    {
        $this->substituteAckText = $substituteAckText;

        return $this;
    }

    /**
     * Get substituteAckText
     *
     * @return string
     */
    public function getSubstituteAckText()
    {
        return $this->substituteAckText;
    }

    /**
     * Set substituteAckDate
     *
     * @param \DateTime $substituteAckDate
     *
     * @return Request
     */
    public function setSubstituteAckDate($substituteAckDate)
    {
        $this->substituteAckDate = $substituteAckDate;

        return $this;
    }

    /**
     * Get substituteAckDate
     *
     * @return \DateTime
     */
    public function getSubstituteAckDate()
    {
        return $this->substituteAckDate;
    }

    /**
     * Add publicDay
     *
     * @param \FA\AbsmanBundle\Entity\PublicDay $publicDay
     *
     * @return Request
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
     * Set requestStatus
     *
     * @param \FA\AbsmanBundle\Entity\RequestStatus $requestStatus
     *
     * @return Request
     */
    public function setRequestStatus(\FA\AbsmanBundle\Entity\RequestStatus $requestStatus = null)
    {
        $this->requestStatus = $requestStatus;

        return $this;
    }

    /**
     * Get requestStatus
     *
     * @return \FA\AbsmanBundle\Entity\RequestStatus
     */
    public function getRequestStatus()
    {
        return $this->requestStatus;
    }

    /**
     * Set user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return Request
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
     * Add action
     *
     * @param \FA\AbsmanBundle\Entity\Action $action
     *
     * @return Request
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
     * Set workflow
     *
     * @param \FA\AbsmanBundle\Entity\Workflow $workflow
     *
     * @return Request
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
     * Set approver
     *
     * @param \FA\AbsmanBundle\Entity\User $approver
     *
     * @return Request
     */
    public function setApprover(\FA\AbsmanBundle\Entity\User $approver = null)
    {
        $this->approver = $approver;

        return $this;
    }

    /**
     * Get approver
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getApprover()
    {
        return $this->approver;
    }

    /**
     * Set standInApprover
     *
     * @param \FA\AbsmanBundle\Entity\User $standInApprover
     *
     * @return Request
     */
    public function setStandInApprover(\FA\AbsmanBundle\Entity\User $standInApprover = null)
    {
        $this->standInApprover = $standInApprover;

        return $this;
    }

    /**
     * Get standInApprover
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getStandInApprover()
    {
        return $this->standInApprover;
    }

    /**
     * Set substitute
     *
     * @param \FA\AbsmanBundle\Entity\User $substitute
     *
     * @return Request
     */
    public function setSubstitute(\FA\AbsmanBundle\Entity\User $substitute = null)
    {
        $this->substitute = $substitute;

        return $this;
    }

    /**
     * Get substitute
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getSubstitute()
    {
        return $this->substitute;
    }

    /**
     * Set notified
     *
     * @param \FA\AbsmanBundle\Entity\User $notified
     *
     * @return Request
     */
    public function setNotified(\FA\AbsmanBundle\Entity\User $notified = null)
    {
        $this->notified = $notified;

        return $this;
    }

    /**
     * Get notified
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getNotified()
    {
        return $this->notified;
    }

    /**
     * Set requestedBy
     *
     * @param \FA\AbsmanBundle\Entity\User $requestedBy
     *
     * @return Request
     */
    public function setRequestedBy(\FA\AbsmanBundle\Entity\User $requestedBy = null)
    {
        $this->requestedBy = $requestedBy;

        return $this;
    }

    /**
     * Get requestedBy
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getRequestedBy()
    {
        return $this->requestedBy;
    }

    /**
     * Set approvalBy
     *
     * @param \FA\AbsmanBundle\Entity\User $approvalBy
     *
     * @return Request
     */
    public function setApprovalBy(\FA\AbsmanBundle\Entity\User $approvalBy = null)
    {
        $this->approvalBy = $approvalBy;

        return $this;
    }

    /**
     * Get approvalBy
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getApprovalBy()
    {
        return $this->approvalBy;
    }

    /**
     * Set cancelDate
     *
     * @param \DateTime $cancelDate
     *
     * @return Request
     */
    public function setCancelDate($cancelDate)
    {
        $this->cancelDate = $cancelDate;

        return $this;
    }

    /**
     * Get cancelDate
     *
     * @return \DateTime
     */
    public function getCancelDate()
    {
        return $this->cancelDate;
    }

    /**
     * Set cancelText
     *
     * @param string $cancelText
     *
     * @return Request
     */
    public function setCancelText($cancelText)
    {
        $this->cancelText = $cancelText;

        return $this;
    }

    /**
     * Get cancelText
     *
     * @return string
     */
    public function getCancelText()
    {
        return $this->cancelText;
    }

    /**
     * Set isCanceledOrRejected
     *
     * @param boolean $isCanceledOrRejected
     *
     * @return Request
     */
    public function setIsCanceledOrRejected($isCanceledOrRejected)
    {
        $this->isCanceledOrRejected = $isCanceledOrRejected;

        return $this;
    }

    /**
     * Get isCanceledOrRejected
     *
     * @return boolean
     */
    public function getIsCanceledOrRejected()
    {
        return $this->isCanceledOrRejected;
    }

    /**
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     *
     * @return Request
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
}
