<?php

namespace FA\AbsmanBundle\Entity;

/**
 * RequestLeaveCategoryRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RequestLeaveCategoryRepository extends \Doctrine\ORM\EntityRepository
{



    public function getRequestCategories($absRequest)
    {

        $queryBuilder = $this->createQueryBuilder('rlc')
            ->select('rlc.startDate startdate, rlc.endDate enddate, rlc.startDateRatio startdateratio, rlc.endDateRatio enddateratio, rlc.taken, lc.categoryName name, rlc.justification')
            ->innerJoin('rlc.leaveCategory', 'lc')
            ->innerJoin('rlc.request', 'r', 'with', 'r.id = :request')
                ->setParameter('request', $absRequest->getBinId());

        $queryResult = $queryBuilder->getQuery()->getArrayResult();

        foreach($queryResult as &$item) {
            $item["startdate"] = $item["startdate"]->format("Y-m-d");
            $item["enddate"] = $item["enddate"]->format("Y-m-d");
        };

        return $queryResult;


    }
}
