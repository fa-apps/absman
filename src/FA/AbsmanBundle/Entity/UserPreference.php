<?php

namespace FA\AbsmanBundle\Entity;


use Doctrine\ORM\Mapping as ORM;

/**
 * Groups
 *
 * @ORM\Table(name="user_preference")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\UserPreferenceRepository")
 */

class UserPreference
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
     * @var string
     *
     * @ORM\Column(name="value", type="text", nullable=true)
     */
    private $preferenceValue;


    /**
     * @ORM\ManyToOne(targetEntity="Preference")
     */
    private $preference;


    /**
     * @ORM\ManyToOne(targetEntity="User")
     */
    private $user;







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
     * Set preferenceValue
     *
     * @param string $preferenceValue
     *
     * @return UserPreference
     */
    public function setPreferenceValue($preferenceValue)
    {
        $this->preferenceValue = $preferenceValue;

        return $this;
    }

    /**
     * Get preferenceValue
     *
     * @return string
     */
    public function getPreferenceValue()
    {
        return $this->preferenceValue;
    }

    /**
     * Set preference
     *
     * @param \FA\AbsmanBundle\Entity\Preference $preference
     *
     * @return UserPreference
     */
    public function setPreference(\FA\AbsmanBundle\Entity\Preference $preference = null)
    {
        $this->preference = $preference;

        return $this;
    }

    /**
     * Get preference
     *
     * @return \FA\AbsmanBundle\Entity\Preference
     */
    public function getPreference()
    {
        return $this->preference;
    }

    /**
     * Set user
     *
     * @param \FA\AbsmanBundle\Entity\User $user
     *
     * @return UserPreference
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
