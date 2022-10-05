<?php

namespace FA\AbsmanBundle\Entity;

/**
 * UserEntitlementRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UserEntitlementRepository extends \Doctrine\ORM\EntityRepository
{


    public function hasNewerTimeStampForUser($user, $oldestTimeStamp) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->select('count(ue)')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->Where('ue.lastUpdate > :oldestDate')
            ->setParameter('user',$user->getBinId())
            ->setParameter('oldestDate', date_create("@$oldestTimeStamp"));

        $query = $queryBuilder->getQuery();

        return (int) $query->getSingleScalarResult() !== 0;
    }

    public function getCountForCategory($entitledCategory) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->select('count(ue)')
            ->where(' ue.entitledCategory = :entitledCategory')
            ->setParameter('entitledCategory', $entitledCategory->getBinId());

        $query = $queryBuilder->getQuery();

        return  (int) $query->getSingleScalarResult();
    }

    public function getUserEntitledCategory($user) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->select('ue.id id, e.categoryName name, ue.left, ue.onDemandLeft ondemandleft, ue.lastUpdate')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->leftJoin('ue.entitledCategory', 'e')
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getArrayResult();
    }

    public function getUserEntitledCategoryDetails($user) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->select('ue.id id, e.categoryName name, ue.left, ue.onDemandLeft ondemandleft, e.validFrom, e.validTo, e.enforceValidity, e.id categoryId')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->leftJoin('ue.entitledCategory', 'e')
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getArrayResult();
    }

    public function getUserEntitledCategoryDetailsByExpiration($user) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->select('ue.id id, e.categoryName name, ue.left, ue.onDemandLeft ondemandleft, e.validFrom, e.validTo, e.enforceValidity, e.id categoryId')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->leftJoin('ue.entitledCategory', 'e')
            ->orderBy("e.validTo", "ASC")
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getArrayResult();
    }


    public function getUserCategoryEntitlement($entitledCategory, $user) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->where(' ue.entitledCategory = :entitledCategory')
            ->andWhere(' ue.user = :user')
            ->setParameter('entitledCategory', $entitledCategory->getBinId())
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getSingleResult();
    }


    public function getUserEntitlements($user) {

        $queryBuilder = $this->createQueryBuilder('ue')
            ->select('ue.id id, e.categoryName name, ue.allocated, ue.left, ue.onDemandLeft ondemandleft, e.validFrom, e.validTo, e.enforceValidity, e.id categoryId')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->leftJoin('ue.entitledCategory', 'e')
            ->where('ue.hidden = 0')
            ->orderBy("e.validTo","ASC")
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getArrayResult();
    }


}