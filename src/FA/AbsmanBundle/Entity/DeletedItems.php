<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DeletedItems
 *
 * @ORM\Table(name="deleted_items")
 * @ORM\Entity(repositoryClass="FA\AbsmanBundle\Entity\DeletedItemsRepository")
 */
class DeletedItems
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
     * @ORM\Column(name="entity_name", type="string", length=64, nullable=false)
     */
    private $entityName;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="delete_date", type="datetime", nullable=false)
     */
    private $deleteDate;

    /**
     * @var string
     *
     * @ORM\Column(name="previous_data", type="text", nullable=true)
     */
    private $previousData;




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
     * Set entityName
     *
     * @param string $entityName
     *
     * @return DeletedItems
     */
    public function setEntityName($entityName)
    {
        $this->entityName = $entityName;

        return $this;
    }

    /**
     * Get entityName
     *
     * @return string
     */
    public function getEntityName()
    {
        return $this->entityName;
    }

    /**
     * Set deleteDate
     *
     * @param \DateTime $deleteDate
     *
     * @return DeletedItems
     */
    public function setDeleteDate($deleteDate)
    {
        $this->deleteDate = $deleteDate;

        return $this;
    }

    /**
     * Get deleteDate
     *
     * @return \DateTime
     */
    public function getDeleteDate()
    {
        return $this->deleteDate;
    }

    /**
     * Set previousData
     *
     * @param string $previousData
     *
     * @return DeletedItems
     */
    public function setPreviousData($previousData)
    {
        $this->previousData = $previousData;

        return $this;
    }

    /**
     * Get previousData
     *
     * @return string
     */
    public function getPreviousData()
    {
        return $this->previousData;
    }
}
