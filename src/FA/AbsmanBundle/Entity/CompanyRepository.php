<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class CompanyRepository extends EntityRepository
{

    public function getCompanies(Country $country)
    {

        $queryBuilder = $this->createQueryBuilder('c')
            ->where('c.country = :country')
            ->setParameter('country', $country->getBinId())
            ->orderBy('c.companyName');
        $query = $queryBuilder->getQuery();

        return $query->getResult();
    }

    public function getCompanyCount(Country $country)
    {

        $qb = $this->createQueryBuilder('c');
        $qb->add('select', $qb->expr()->count('c'))
            ->where('c.country = :country')->setParameter('country', $country->getBinId());
        $query = $qb->getQuery();

        return intval($query->getSingleScalarResult());

    }

    public function isDefaultGroup(UGroup $group)
    {

        $qb = $this->createQueryBuilder('c')
            ->select('count(c)')
            ->where('c.defaultGroup = :group')
            ->setParameter('group', $group->getBinId());

        $query = $qb->getQuery();

        return (int)$query->getSingleScalarResult() === 1;

    }


    public function isDuplicateNameForUpdate($company, $name)
    {

        $qb = $this->createQueryBuilder('c')
            ->select('count(c)')
            ->innerJoin('c.country', 'co', 'with', 'co.id = :country')
            ->where('c.companyName = :name')
            ->andWhere('c.id != :company')
            ->setParameter('company', $company->getBinId())
            ->setParameter('country', $company->getCountry()->getBinId())
            ->setParameter('name', $name);

        $query = $qb->getQuery();

        return (int)$query->getSingleScalarResult() !== 0;

    }

    public function isDuplicateNameForInsert($country, $name)
    {

        $qb = $this->createQueryBuilder('c')
            ->select('count(c)')
            ->innerJoin('c.country', 'co', 'with', 'co.id = :country')
            ->where('c.companyName = :name')
            ->setParameter('country', $country->getBinId())
            ->setParameter('name', $name);

        $query = $qb->getQuery();

        return (int)$query->getSingleScalarResult() !== 0;

    }


    public function getArrayCompany($company)
    {
        $queryBuilder = $this->createQueryBuilder('a')
            ->where('a = :company')
            ->setParameter('company', $company->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }


}
