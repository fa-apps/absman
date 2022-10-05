<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Reqstatus
 *
 * @ORM\Table(name="request_status")
 * @ORM\Entity
 */
class RequestStatus
{
    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     *
     * @ORM\Column(name="request_status", type="string", length=64, nullable=true)
     */
    private $requestStatus;


   /**
     *
     * @ORM\Column(name="request_status_text", type="string", length=64, nullable=true)
     */
    private $requestStatusText;




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
     * Set requestStatus
     *
     * @param string $requestStatus
     * @return RequestStatus
     */
    public function setRequestStatus($requestStatus)
    {
        $this->requestStatus = $requestStatus;

        return $this;
    }

    /**
     * Get requestStatus
     *
     * @return string 
     */
    public function getRequestStatus()
    {
        return $this->requestStatus;
    }

    /**
     * Set requestStatusText
     *
     * @param string $requestStatusText
     *
     * @return RequestStatus
     */
    public function setRequestStatusText($requestStatusText)
    {
        $this->requestStatusText = $requestStatusText;

        return $this;
    }

    /**
     * Get requestStatusText
     *
     * @return string
     */
    public function getRequestStatusText()
    {
        return $this->requestStatusText;
    }
}
