<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Actions
 *
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\WorkflowRepository")
 * @ORM\Table(name="workflow")
 */
class Workflow
{
    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;


    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text", nullable=false)
     */
    private $workflowName;

    /**
     * @var string
     *
     * @ORM\Column(name="text", type="text", nullable=false)
     */
    private $workflowText;

    /**
     * @var json_array
     *
     * @ORM\Column(name="details", type="json_array", nullable=true)
     */
    private $workflowDetails;

    /**
     * @var boolean
     *
     * @ORM\Column(name="require_stand_in_approver", type="boolean", nullable=false)
     */
    private $requireStandInApprover = '0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="require_substitute", type="boolean", nullable=false)
     */
    private $requireSubstitute = '0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="require_notified", type="boolean", nullable=false)
     */
    private $requireNotified = '0';

    /**
     * @var boolean
     *
     * @ORM\Column(name="require_substitute_ack", type="boolean", nullable=false)
     */
    private $requireSubstituteAck = '0';




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
     * Set workflowName
     *
     * @param string $workflowName
     *
     * @return Workflow
     */
    public function setWorkflowName($workflowName)
    {
        $this->workflowName = $workflowName;

        return $this;
    }

    /**
     * Get workflowName
     *
     * @return string
     */
    public function getWorkflowName()
    {
        return $this->workflowName;
    }

    /**
     * Set workflowText
     *
     * @param string $workflowText
     *
     * @return Workflow
     */
    public function setWorkflowText($workflowText)
    {
        $this->workflowText = $workflowText;

        return $this;
    }

    /**
     * Get workflowText
     *
     * @return string
     */
    public function getWorkflowText()
    {
        return $this->workflowText;
    }

    /**
     * Set workflowDetails
     *
     * @param array $workflowDetails
     *
     * @return Workflow
     */
    public function setWorkflowDetails($workflowDetails)
    {
        $this->workflowDetails = $workflowDetails;

        return $this;
    }

    /**
     * Get workflowDetails
     *
     * @return array
     */
    public function getWorkflowDetails()
    {
        return $this->workflowDetails;
    }

    /**
     * Set requireStandInApprover
     *
     * @param boolean $requireStandInApprover
     *
     * @return Workflow
     */
    public function setRequireStandInApprover($requireStandInApprover)
    {
        $this->requireStandInApprover = $requireStandInApprover;

        return $this;
    }

    /**
     * Get requireStandInApprover
     *
     * @return boolean
     */
    public function getRequireStandInApprover()
    {
        return $this->requireStandInApprover;
    }

    /**
     * Set requireSubstitute
     *
     * @param boolean $requireSubstitute
     *
     * @return Workflow
     */
    public function setRequireSubstitute($requireSubstitute)
    {
        $this->requireSubstitute = $requireSubstitute;

        return $this;
    }

    /**
     * Get requireSubstitute
     *
     * @return boolean
     */
    public function getRequireSubstitute()
    {
        return $this->requireSubstitute;
    }


    /**
     * Set requireNotified
     *
     * @param boolean $requireNotified
     *
     * @return Workflow
     */
    public function setRequireNotified($requireNotified)
    {
        $this->requireNotified = $requireNotified;

        return $this;
    }

    /**
     * Get requireNotified
     *
     * @return boolean
     */
    public function getRequireNotified()
    {
        return $this->requireNotified;
    }

    /**
     * Set requireSubstituteAck
     *
     * @param boolean $requireSubstituteAck
     *
     * @return Workflow
     */
    public function setRequireSubstituteAck($requireSubstituteAck)
    {
        $this->requireSubstituteAck = $requireSubstituteAck;

        return $this;
    }

    /**
     * Get requireSubstituteAck
     *
     * @return boolean
     */
    public function getRequireSubstituteAck()
    {
        return $this->requireSubstituteAck;
    }
}
