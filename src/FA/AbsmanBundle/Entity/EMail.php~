<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * EMails
 *
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\EmailRepository")
 * @ORM\Table(name="email")
 */

class EMail
{
    /**
     * @var binary
     *
     * @ORM\Column(name="id", length=16, type="binary", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="FA\AbsmanBundle\Types\GuidGenerator")
     */
    private $id;


    /**
     * @var \DateTime
     *
     * @ORM\Column(name="email_date", type="datetime", nullable=false)
     */
    private $emailDate;


    /**
     * @var string
     *
     * @ORM\Column(name="email_subject", type="text", nullable=false)
     */
    private $emailSubject;


    /**
     * @var string
     *
     * @ORM\Column(name="email_body", type="text", nullable=false)
     */
    private $emailBody;



    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $emailTo;





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
     * Set emailDate
     *
     * @param \DateTime $emailDate
     *
     * @return EMail
     */
    public function setEmailDate($emailDate)
    {
        $this->emailDate = $emailDate;

        return $this;
    }

    /**
     * Get emailDate
     *
     * @return \DateTime
     */
    public function getEmailDate()
    {
        return $this->emailDate;
    }

    /**
     * Set emailSubject
     *
     * @param string $emailSubject
     *
     * @return EMail
     */
    public function setEmailSubject($emailSubject)
    {
        $this->emailSubject = $emailSubject;

        return $this;
    }

    /**
     * Get emailSubject
     *
     * @return string
     */
    public function getEmailSubject()
    {
        return $this->emailSubject;
    }

    /**
     * Set emailBody
     *
     * @param string $emailBody
     *
     * @return EMail
     */
    public function setEmailBody($emailBody)
    {
        $this->emailBody = $emailBody;

        return $this;
    }

    /**
     * Get emailBody
     *
     * @return string
     */
    public function getEmailBody()
    {
        return $this->emailBody;
    }

    /**
     * Set emailTo
     *
     * @param \FA\AbsmanBundle\Entity\User $emailTo
     *
     * @return EMail
     */
    public function setEmailTo(\FA\AbsmanBundle\Entity\User $emailTo = null)
    {
        $this->emailTo = $emailTo;

        return $this;
    }

    /**
     * Get emailTo
     *
     * @return \FA\AbsmanBundle\Entity\User
     */
    public function getEmailTo()
    {
        return $this->emailTo;
    }
}
