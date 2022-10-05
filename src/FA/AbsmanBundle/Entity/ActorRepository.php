<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class ActorRepository extends EntityRepository
{

    public function getActors($target)
    {
        $query = $this->_em
            ->createQuery('SELECT a, r FROM FAAbsmanBundle:Actor a JOIN a.role r WHERE a.targetId = :target')
            ->setParameter('target', $target);

        return $query->getArrayResult();

    }

    public function getAdmins($target, $offset, $maxResults, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, u.displayName user, u.id userid, r.id roleid, r.roleName rolename')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.role', 'r')
            ->where('a.targetId = :target' )
            ->setParameter('target', $target);


        if (!empty($sort)) {
            $sortColumns = array("user"=>"u.displayName","rolename"=>"r.roleName");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]] , $sort[0]["direction"]);
        } else {
            $queryBuilder->orderby('u.displayName', 'DESC');
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($maxResults);
        $query->setFirstResult($offset);

        return $query->getArrayResult();

    }

    public function getAdminsCount($target)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:Actor a JOIN a.role r WHERE a.targetId = :target')
            ->setParameter('target', $target);

        return (int) $query->getSingleScalarResult();

    }

    public function removeActors($target)
    {
        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:Actor a WHERE a.targetId = :target')
            ->setParameter('target', $target->getBinId());

        $query->execute();
        return true;

    }

    public function isAdminForTarget($user,$target)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:Actor a WHERE a.targetId = :target AND a.user = :user')
            ->setParameter('target', pack("H*",$target))
            ->setParameter('user', $user->getBinId());

        return (bool) $query->getSingleScalarResult() != "0";

    }

    public function getAdminRoleForTarget($user,$target)
    {
        $query = $this->_em
            ->createQuery('SELECT r.role role FROM FAAbsmanBundle:Actor a JOIN a.role r WHERE a.targetId = :target AND a.user = :user')
            ->setParameter('target', pack("H*",$target))
            ->setParameter('user', $user->getBinId());

        $query_result = $query->getArrayResult();

        $result = false;
        if (array_key_exists(0,$query_result)) {
            $result = $query_result[0]["role"];
        }
        return $result;
    }

}
