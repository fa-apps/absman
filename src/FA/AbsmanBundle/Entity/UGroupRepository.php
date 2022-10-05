<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class UGroupRepository extends EntityRepository
{

    public function getGroups(Company $company)
    {

        $queryBuilder = $this->createQueryBuilder('g')
            ->where('g.company = :company')
            ->setParameter('company', $company->getBinId())
            ->orderBy('g.groupName');

        $query = $queryBuilder->getQuery();

        return $query->getResult();
    }


    public function getGroupCount(Company $company, UGroup $defaultGroup)
    {

        $qb = $this->createQueryBuilder('g');
        $qb->add('select', $qb->expr()->count('g'))
            ->where('g.company = :company')
            ->andWhere('g.id != :defaultGroup')
            ->setParameter('company', $company->getBinId())
            ->setParameter('defaultGroup', $defaultGroup->getBinId());

        $query = $qb->getQuery();

        return intval($query->getSingleScalarResult());
    }


    public function getArrayUGroup($group)
    {
        $queryBuilder = $this->createQueryBuilder('a')
            ->where('a = :group')
            ->setParameter('group', $group->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }

    public function getMemberOf($user)
    {
        $queryBuilder = $this->createQueryBuilder('g')
            ->where(':user MEMBER OF g.users')
            ->andWhere('g.company = :company')
            ->orderby('g.groupName', 'ASC')
            ->setParameter('user', $user->getBinId())
            ->setParameter('company', $user->getCompany()->getBinId());


        $query = $queryBuilder->getQuery();

        return $query->getResult();
    }

    public function getNotMemberOf($user)
    {
        $queryBuilder = $this->createQueryBuilder('g')
            ->where(':user NOT MEMBER OF g.users')
            ->andWhere('g.company = :company')
            ->orderby('g.groupName', 'ASC')
            ->setParameter('user', $user->getBinId())
            ->setParameter('company', $user->getCompany()->getBinId());


        $query = $queryBuilder->getQuery();

        return $query->getResult();
    }

    public function isMember($group, $user)
    {
        $queryBuilder = $this->createQueryBuilder('g');
        $queryBuilder->add('select', $queryBuilder->expr()->count('g'))
            ->where(':user MEMBER OF g.users')
            ->andWhere('g.id = :group')
            ->setParameter('user', $user->getBinId())
            ->setParameter('group', $group->getBinId());


        $query = $queryBuilder->getQuery();
        return intval($query->getSingleScalarResult()) != 0;
    }


    public function isDuplicateNameForUpdate($group, $name)
    {

        $qb = $this->createQueryBuilder('g')
            ->select('count(g)')
            ->innerJoin('g.company', 'c', 'with', 'c.id = :company')
            ->where('g.groupName = :name')
            ->andWhere('g.id != :group')
            ->setParameter('group', $group->getBinId())
            ->setParameter('company', $group->getCompany()->getBinId())
            ->setParameter('name', $name);

        $query = $qb->getQuery();

        return (int)$query->getSingleScalarResult() !== 0;

    }

    public function isDuplicateNameForInsert($company, $name)
    {
        $qb = $this->createQueryBuilder('g')
            ->select('count(g)')
            ->innerJoin('g.company', 'c', 'with', 'c.id = :company')
            ->where('g.groupName = :name')
            ->setParameter('company', $company->getBinId())
            ->setParameter('name', $name);

        $query = $qb->getQuery();

        return (int)$query->getSingleScalarResult() !== 0;

    }


}
