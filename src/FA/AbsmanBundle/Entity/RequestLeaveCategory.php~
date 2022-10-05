<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(name="request_leavecategory")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\RequestLeaveCategoryRepository")
 */
class RequestLeaveCategory
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="taken", type="decimal", precision=4, scale=3, nullable=false)
     */
    private $taken;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="start_date", type="date", nullable=true)
     */
    private $startDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date", type="date", nullable=true)
     */
    private $endDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="start_date_ratio", type="integer", nullable=false)
     */
    private $startDateRatio = '100';

    /**
     * @var integer
     *
     * @ORM\Column(name="end_date_ratio", type="integer", nullable=false)
     */
    private $endDateRatio = '100';

    /**
     * @var string
     *
     * @ORM\Column(name="justification", type="string", length=1024, nullable=true)
     */
    private $justification;

    /**
     * @ORM\ManyToOne(targetEntity="LeaveCategory")
     */
    private $leaveCategory;

    /**
     * @ORM\ManyToOne(targetEntity="Request")
     */
    private $request;


    /**
     * @var boolean
     *
     * @ORM\Column(name="is_cancel_reject", type="boolean", nullable=true)
     */
    private $isCanceledOrRejected = '0';



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
     * Set taken
     *
     * @param string $taken
     *
     * @return RequestLeaveCategory
     */
    public function setTaken($taken)
    {
        $this->taken = $taken;

        return $this;
    }

    /**
     * Get taken
     *
     * @return string
     */
    public function getTaken()
    {
        return $this->taken;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate
     *
     * @return RequestLeaveCategory
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
     * @return RequestLeaveCategory
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
     * @return RequestLeaveCategory
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
     * Set justification
     *
     * @param string $justification
     *
     * @return RequestLeaveCategory
     */
    public function setJustification($justification)
    {
        $this->justification = $justification;

        return $this;
    }

    /**
     * Get justification
     *
     * @return string
     */
    public function getJustification()
    {
        return $this->justification;
    }

    /**
     * Set leaveCategory
     *
     * @param \FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory
     *
     * @return RequestLeaveCategory
     */
    public function setLeaveCategory(\FA\AbsmanBundle\Entity\LeaveCategory $leaveCategory = null)
    {
        $this->leaveCategory = $leaveCategory;

        return $this;
    }

    /**
     * Get leaveCategory
     *
     * @return \FA\AbsmanBundle\Entity\LeaveCategory
     */
    public function getLeaveCategory()
    {
        return $this->leaveCategory;
    }

    /**
     * Set request
     *
     * @param \FA\AbsmanBundle\Entity\Request $request
     *
     * @return RequestLeaveCategory
     */
    public function setRequest(\FA\AbsmanBundle\Entity\Request $request = null)
    {
        $this->request = $request;

        return $this;
    }

    /**
     * Get request
     *
     * @return \FA\AbsmanBundle\Entity\Request
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return RequestLeaveCategory
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
     * Set isCanceledOrRejected
     *
     * @param boolean $isCanceledOrRejected
     *
     * @return RequestLeaveCategory
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
}
