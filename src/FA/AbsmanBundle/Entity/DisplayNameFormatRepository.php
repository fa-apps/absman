<?php

namespace FA\AbsmanBundle\Entity;

/**
 * DisplayNameFormatRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class DisplayNameFormatRepository extends \Doctrine\ORM\EntityRepository
{


    public function getFormats()
    {
        $queryBuilder = $this->createQueryBuilder('f');

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }

}