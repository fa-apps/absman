<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class EntitledCategoryRepository extends EntityRepository
{


    public function getArrayEntitledCategory($entitled)
    {
        $queryBuilder = $this->createQueryBuilder('a')
            ->where('a = :entitled' )
            ->setParameter('entitled', $entitled->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }



    public function getGroupUnallocated($group)
    {

        $allocated = $this->_em
            ->createQuery('SELECT a.id FROM FAAbsmanBundle:EntitledCategory a JOIN a.groups g WHERE g = :group')
            ->setParameter('group', $group->getBinId());

        $allocIds=array();
        foreach ($allocated->getArrayResult() as $alloc) {
            $allocIds[] = pack('H*',$alloc["id"]);
        }

        if (count($allocIds) > 0) {
            $available = $this->_em
                ->createQuery('SELECT b FROM FAAbsmanBundle:EntitledCategory b WHERE b.company = :company AND b.id NOT IN (:allocIds)')
                ->setParameter('company', $group->getCompany()->getBinId())
                ->setParameter('allocIds', $allocIds);
        }
        else {
            $available = $this->_em
                ->createQuery('SELECT b FROM FAAbsmanBundle:EntitledCategory b WHERE b.company = :company')
                ->setParameter('company', $group->getCompany()->getBinId());
        }

        return $available->getResult();
    }

    public function isEntitlementDefinedInOtherGroup ($user,$group,$entitlement)
    {
        $queryBuilder = $this->createQueryBuilder('e')
            ->select('count(e)')->distinct()
            ->innerJoin('e.userEntitlements', 'ue')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->innerJoin('u.uGroups', 'g', 'with', 'g.id != :group')
            ->Where('e.id = :entitlement')
            ->andWhere(':entitlement MEMBER OF g.entitledCategories')
            ->setParameter('user',$user->getBinId())
            ->setParameter('group',$group->getBinId())
            ->setParameter('entitlement',$entitlement->getBinId());

        $query = $queryBuilder->getQuery();

        return (int) $query->getSingleScalarResult() !== 0;
    }

    public function hasNewerTimeStampForUser($user, $oldestTimeStamp) {

        $queryBuilder = $this->createQueryBuilder('e')
            ->select('count(e)')
            ->innerJoin('e.userEntitlements', 'ue')
            ->innerJoin('ue.user', 'u', 'with', 'u.id = :user')
            ->Where('e.lastUpdate > :oldestDate')
            ->setParameter('user',$user->getBinId())
            ->setParameter('oldestDate', date_create("@$oldestTimeStamp"));

        $query = $queryBuilder->getQuery();

        return  (int) $query->getSingleScalarResult() !== 0;
    }

    public function hasNewerTimeStampForCompany($company, $oldestTimeStamp) {

        $queryBuilder = $this->createQueryBuilder('e')
            ->select('count(e)')
            ->innerJoin('e.company', 'c', 'with', 'c.id = :company')
            ->Where('e.lastUpdate > :oldestDate')
            ->setParameter('company',$company->getBinId())
            ->setParameter('oldestDate', date_create("@$oldestTimeStamp"));

        $query = $queryBuilder->getQuery();

        return  (int) $query->getSingleScalarResult() !== 0;
    }

}
