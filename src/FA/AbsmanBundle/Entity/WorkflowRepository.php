<?php

namespace FA\AbsmanBundle\Entity;

/**
 * WorkflowRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class WorkflowRepository extends \Doctrine\ORM\EntityRepository
{



    public function getWorkflows()
    {
        $queryBuilder = $this->createQueryBuilder('w');

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }



}
