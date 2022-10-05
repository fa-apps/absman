<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Actions
 *
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\ActionRepository")
 * @ORM\Table(name="action")
 */
class Action
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
     * @ORM\Column(name="action_date", type="datetime", nullable=false)
     */
    private $actionDate;

    /**
     * @var string
     *
     * @ORM\Column(name="action_text", type="text", nullable=false)
     */
    private $actionText;

    /**
     * @var json_array
     *
     * @ORM\Column(name="action_details", type="json_array", nullable=true)
     */
    private $actionDetails;

    /**
     *
     * @ORM\ManyToOne(targetEntity="ActionType")
     */
    private $actionType;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;

     /**
     * @ORM\ManyToMany(targetEntity="Request" , inversedBy="actions")
     * @ORM\JoinTable(name="request_action",
     *      joinColumns={@ORM\JoinColumn(name="action_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="request_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $request;


    /**
     * @ORM\ManyToMany(targetEntity="Country" , inversedBy="actions")
     * @ORM\JoinTable(name="country_action",
     *      joinColumns={@ORM\JoinColumn(name="action_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="country_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $country;


    /**
     * @ORM\ManyToMany(targetEntity="Company" , inversedBy="actions")
     * @ORM\JoinTable(name="company_action",
     *      joinColumns={@ORM\JoinColumn(name="action_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="company_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $company;

    /**
     * @ORM\ManyToMany(targetEntity="UGroup" , inversedBy="actions")
     * @ORM\JoinTable(name="ugroup_action",
     *      joinColumns={@ORM\JoinColumn(name="action_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="ugroup_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $ugroup;

   /**
     * @ORM\ManyToMany(targetEntity="User" , inversedBy="actions")
     * @ORM\JoinTable(name="user_action",
     *      joinColumns={@ORM\JoinColumn(name="action_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $targetUser;


    /**
     * @ORM\ManyToMany(targetEntity="EGroup" , inversedBy="actions")
     * @ORM\JoinTable(name="egroup_action",
     *      joinColumns={@ORM\JoinColumn(name="action_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="egroup_id", referencedColumnName="id", onDelete="CASCADE")}
     *      )
     */
    private $eGroup;




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
        $this->request = new \Doctrine\Common\Collections\ArrayCollection();
        $this->country = new \Doctrine\Common\Collections\ArrayCollection();
        $this->company = new \Doctrine\Common\Collections\ArrayCollection();
        $this->ugroup = new \Doctrine\Common\Collections\ArrayCollection();
        $this->targetUser = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set actionDate
     *
     * @param \DateTime $actionDate
     *
     * @return Action
     */
    public function setActionDate($actionDate)
    {
        $this->actionDate = $actionDate;

        return $this;
    }

    /**
     * Get actionDate
     *
     * @return \DateTime
     */
    public function getActionDate()
    {
        return $this->actionDate;
    }

    /**
     * Set actionText
     *
     * @param string $actionText
     *
     * @return Action
     */
    public function setActionText($actionText)
    {
        $this->actionText = $actionText;

        return $this;
    }

    /**
     * Get actionText
     *
     * @return string
     */
    public function getActionText()
    {
        return $this->actionText;
    }

    /**
     * Set actionDetails
     *
     * @param array $actionDetails
     *
     * @return Action
     */
    public function setActionDetails($actionDetails)
    {
        $this->actionDetails = $actionDetails;

        return $this;
    }

    /**
     * Get actionDetails
     *
     * @return array
     */
    public function getActionDetails()
    {
        return $this->actionDetails;
    }

    /**
     * Set actionType
     *
     * @param \FA\AbsmanBundle\Entity\ActionType $actionType
     *
     * @return Action
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
     * @return Action
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
     * Add request
     *
     * @param \FA\AbsmanBundle\Entity\Request $request
     *
     * @return Action
     */
    public function addRequest(\FA\AbsmanBundle\Entity\Request $request)
    {
        $this->request[] = $request;

        return $this;
    }

    /**
     * Remove request
     *
     * @param \FA\AbsmanBundle\Entity\Request $request
     */
    public function removeRequest(\FA\AbsmanBundle\Entity\Request $request)
    {
        $this->request->removeElement($request);
    }

    /**
     * Get request
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * Add country
     *
     * @param \FA\AbsmanBundle\Entity\Country $country
     *
     * @return Action
     */
    public function addCountry(\FA\AbsmanBundle\Entity\Country $country)
    {
        $this->country[] = $country;

        return $this;
    }

    /**
     * Remove country
     *
     * @param \FA\AbsmanBundle\Entity\Country $country
     */
    public function removeCountry(\FA\AbsmanBundle\Entity\Country $country)
    {
        $this->country->removeElement($country);
    }

    /**
     * Get country
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Add company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     *
     * @return Action
     */
    public function addCompany(\FA\AbsmanBundle\Entity\Company $company)
    {
        $this->company[] = $company;

        return $this;
    }

    /**
     * Remove company
     *
     * @param \FA\AbsmanBundle\Entity\Company $company
     */
    public function removeCompany(\FA\AbsmanBundle\Entity\Company $company)
    {
        $this->company->removeElement($company);
    }

    /**
     * Get company
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCompany()
    {
        return $this->company;
    }

    /**
     * Add ugroup
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $ugroup
     *
     * @return Action
     */
    public function addUgroup(\FA\AbsmanBundle\Entity\UGroup $ugroup)
    {
        $this->ugroup[] = $ugroup;

        return $this;
    }

    /**
     * Remove ugroup
     *
     * @param \FA\AbsmanBundle\Entity\UGroup $ugroup
     */
    public function removeUgroup(\FA\AbsmanBundle\Entity\UGroup $ugroup)
    {
        $this->ugroup->removeElement($ugroup);
    }

    /**
     * Get ugroup
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getUgroup()
    {
        return $this->ugroup;
    }

    /**
     * Add targetUser
     *
     * @param \FA\AbsmanBundle\Entity\User $targetUser
     *
     * @return Action
     */
    public function addTargetUser(\FA\AbsmanBundle\Entity\User $targetUser)
    {
        $this->targetUser[] = $targetUser;

        return $this;
    }

    /**
     * Remove targetUser
     *
     * @param \FA\AbsmanBundle\Entity\User $targetUser
     */
    public function removeTargetUser(\FA\AbsmanBundle\Entity\User $targetUser)
    {
        $this->targetUser->removeElement($targetUser);
    }

    /**
     * Get targetUser
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTargetUser()
    {
        return $this->targetUser;
    }

    /**
     * Add eGroup
     *
     * @param \FA\AbsmanBundle\Entity\EGroup $eGroup
     *
     * @return Action
     */
    public function addEGroup(\FA\AbsmanBundle\Entity\EGroup $eGroup)
    {
        $this->eGroup[] = $eGroup;

        return $this;
    }

    /**
     * Remove eGroup
     *
     * @param \FA\AbsmanBundle\Entity\EGroup $eGroup
     */
    public function removeEGroup(\FA\AbsmanBundle\Entity\EGroup $eGroup)
    {
        $this->eGroup->removeElement($eGroup);
    }

    /**
     * Get eGroup
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEGroup()
    {
        return $this->eGroup;
    }
}
