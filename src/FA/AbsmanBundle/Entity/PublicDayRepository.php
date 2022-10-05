<?php

namespace FA\AbsmanBundle\Entity;



class PublicDayRepository extends \Doctrine\ORM\EntityRepository
{


    public function getArrayPublicDay($publicDay)
    {
        $queryBuilder = $this->createQueryBuilder('a')
            ->where('a = :publicday' )
            ->setParameter('publicday', $publicDay->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }



    public function getGroupUnallocated($group)
    {

        $allocated = $this->_em
            ->createQuery('SELECT a.id FROM FAAbsmanBundle:PublicDay a JOIN a.groups g WHERE g = :group')
            ->setParameter('group', $group->getBinId());

        $allocIds=array();
        foreach ($allocated->getArrayResult() as $alloc) {
            $allocIds[] = pack('H*',$alloc["id"]);
        }

        if (count($allocIds) > 0) {
            $available = $this->_em
                ->createQuery('SELECT b FROM FAAbsmanBundle:PublicDay b WHERE b.company = :company AND b.id NOT IN (:allocIds)')
                ->setParameter('company', $group->getCompany()->getBinId())
                ->setParameter('allocIds', $allocIds);
        }
        else {
            $available = $this->_em
                ->createQuery('SELECT b FROM FAAbsmanBundle:PublicDay b WHERE b.company = :company')
                ->setParameter('company', $group->getCompany()->getBinId());
        }

        return $available->getResult();
    }


    public function getUserPublicDay($userId) {

        $queryBuilder = $this->createQueryBuilder('p')
            ->distinct()
            ->innerJoin('p.groups', 'g')
            ->innerJoin('g.users', 'u', 'with', 'u.id = :user')
            ->setParameter('user',pack('H*',$userId));

        $query = $queryBuilder->getQuery();

        return $query->getResult();
    }


    public function hasNewerTimeStampForUser($user, $oldestTimeStamp) {

        $queryBuilder = $this->createQueryBuilder('p')
            ->select('count(p)')
            ->innerJoin('p.groups', 'g')
            ->innerJoin('g.users', 'u', 'with', 'u.id = :user')
            ->Where('p.lastUpdate > :oldestDate')
            ->setParameter('user',$user->getBinId())
            ->setParameter('oldestDate', date_create("@$oldestTimeStamp"));

        $query = $queryBuilder->getQuery();

        return (int) $query->getSingleScalarResult() !== 0;
    }

    public function hasNewerTimeStampForCompany($company, $oldestTimeStamp) {

        $queryBuilder = $this->createQueryBuilder('p')
            ->select('count(p)')
            ->innerJoin('p.company', 'c', 'with', 'c.id = :company')
            ->Where('p.lastUpdate > :oldestDate')
            ->setParameter('company',$company->getBinId())
            ->setParameter('oldestDate', date_create("@$oldestTimeStamp"));

        $query = $queryBuilder->getQuery();

        return (int) $query->getSingleScalarResult() !== 0;
    }



    public function getUserPublicDays($user) {

        $queryBuilder = $this->createQueryBuilder('p')
            ->select('p.id, p.publicDayName name')
            ->distinct()
            ->innerJoin('p.groups', 'g')
            ->innerJoin('g.users', 'u', 'with', 'u.id = :user')
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getArrayResult();
    }

    public function getUserPublicDaysOnPeriod($user, $begin, $end) {

        $queryBuilder = $this->createQueryBuilder('p')
            ->select('p.id, p.publicDayName name, p.publicDayLength, p.publicDayDate')
            ->distinct()
            ->innerJoin('p.groups', 'g')
            ->innerJoin('g.users', 'u', 'with', 'u.id = :user')
            ->where('p.publicDayDate >= :begin')
            ->andWhere('p.publicDayDate <= :end')
            ->setParameter('begin', $begin)
            ->setParameter('end', $end)
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return  $query->getArrayResult();
    }
}
