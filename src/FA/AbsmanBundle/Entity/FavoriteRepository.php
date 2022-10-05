<?php


namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class FavoriteRepository extends EntityRepository
{

    public function getFavorites(User $user)
    {
        $queryBuilder = $this->createQueryBuilder('f')
            ->where('f.user = :user' )
            ->orderBy("f.displayOrder","ASC")
                ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();
        return $query->getResult();
    }

    public function getCountryFavorite(Country $country, User $user)
    {
        $queryBuilder = $this->createQueryBuilder('f')
            ->where('f.user = :user' )
                ->setParameter('user', $user->getBinId())
            ->andWhere('f.country = :country')
                ->setParameter('country', $country->getBinId());

        $query = $queryBuilder->getQuery();
        return $query->getResult();
    }

    public function getCount(User $user)
    {
        $query=$this->_em->createQuery('SELECT COUNT(*) FROM Favorite f WHERE  f.user = :user')
            ->setParameter('user', $user->getBinId());

        return $query->getSingleResult();
    }

    public function favoriteExists (User $user, $id)
    {
        $query=$this->_em->createQuery('SELECT COUNT(f) FROM FAAbsmanBundle:Favorite f WHERE f.user = :user AND f.target = :target')
            ->setParameter('user',  $user->getBinId())
            ->setParameter('target', $id);

        $count = $query->getSingleScalarResult();

        return $count != 0;

    }

    public function removeFavoriteAllUsers ($id)
    {
        $query=$this->_em->createQuery('DELETE FROM FAAbsmanBundle:Favorite f WHERE f.target = :target')
            ->setParameter('target', $id);

        return $query->getSingleScalarResult();
    }
}