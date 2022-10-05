<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Req2entabscat
 *
 * @ORM\Table(name="request_entitledcategory")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\RequestEntitledCategoryRepository")
 */
class RequestEntitledCategory
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
     * @ORM\Column(name="taken", type="decimal", precision=10, scale=2, nullable=false)
     */
    private $taken;

     /**
     * @var string
     *
     * @ORM\Column(name="ondemand_taken", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $onDemandTaken;

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
     * @ORM\ManyToOne(targetEntity="Request")
     */
    private $request;

    /**
     * @ORM\ManyToOne(targetEntity="EntitledCategory")
     */
    private $entitledCategory;


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
     * @return RequestEntitledCategory
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
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return RequestEntitledCategory
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
     * @return RequestEntitledCategory
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
     * @return RequestEntitledCategory
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
     * @return RequestEntitledCategory
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
     * Set request
     *
     * @param \FA\AbsmanBundle\Entity\Request $request
     *
     * @return RequestEntitledCategory
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
     * Set entitledCategory
     *
     * @param \FA\AbsmanBundle\Entity\EntitledCategory $entitledCategory
     *
     * @return RequestEntitledCategory
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

    /**
     * Set onDemandTaken
     *
     * @param string $onDemandTaken
     *
     * @return RequestEntitledCategory
     */
    public function setOnDemandTaken($onDemandTaken)
    {
        $this->onDemandTaken = $onDemandTaken;

        return $this;
    }

    /**
     * Get onDemandTaken
     *
     * @return string
     */
    public function getOnDemandTaken()
    {
        return $this->onDemandTaken;
    }

    /**
     * Set isCanceledOrRejected
     *
     * @param boolean $isCanceledOrRejected
     *
     * @return RequestEntitledCategory
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
