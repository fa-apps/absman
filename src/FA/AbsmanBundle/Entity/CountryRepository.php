<?php


namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class CountryRepository extends EntityRepository
{

    public function getCountries($user)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->orderBy('a.countryName');
        $query = $queryBuilder->getQuery();

        return $query->getResult();
    }

    public function getArrayCountry($country)
    {
        $queryBuilder = $this->createQueryBuilder('a')
            ->where('a = :country' )
            ->setParameter('country', $country->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }


    public function isDuplicateName($country,$name)
    {

        $qb = $this->createQueryBuilder('c')
            ->select('count(c)')
            ->where('c.countryName = :name' )
            ->andWhere('c.id != :country' )
            ->setParameter('country', $country->getBinId())
            ->setParameter('name', $name);

        $query = $qb->getQuery();

        return (int) $query->getSingleScalarResult() !== 0;

    }
}
