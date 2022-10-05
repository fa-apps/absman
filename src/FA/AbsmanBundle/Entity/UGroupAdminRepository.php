<?php

namespace FA\AbsmanBundle\Entity;

/**
 * UGroupAdminRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UGroupAdminRepository extends \Doctrine\ORM\EntityRepository
{
    public function getAdminRoleForTarget($user,$uGroup)
    {
        $query = $this->_em
            ->createQuery('SELECT r.role role FROM FAAbsmanBundle:UGroupAdmin a JOIN a.role r WHERE a.uGroup = :uGroup AND a.user = :user')
            ->setParameter('uGroup',$uGroup->getBinId())
            ->setParameter('user', $user->getBinId());

        $query_result = $query->getArrayResult();

        $result = false;
        if (array_key_exists(0,$query_result)) {
            $result = $query_result[0]["role"];
        }
        return $result;
    }

   public function getAdminRoleForTargets($user,$uGroups)
    {

        $resultId = 10;
        $result = false;
        foreach ($uGroups as $uGroup) {

            $query = $this->_em
                ->createQuery('SELECT r.id id, r.role role FROM FAAbsmanBundle:UGroupAdmin a JOIN a.role r WHERE a.uGroup = :uGroups AND a.user = :user')
                ->setParameter('uGroups',$uGroup->getBinId())
                ->setParameter('user', $user->getBinId());

            $query_result = $query->getArrayResult();

            if (count($query_result)) {
                $currentResultId = $query_result[0]["id"];
                if ($currentResultId < $resultId) {
                    $result = $query_result[0]["role"];
                    $resultId = $currentResultId;
                }
            }
        }

        return $result;
    }


    public function getAdmins($uGroup, $offset, $maxResults, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, u.displayName user, u.id userid, r.id roleid, r.roleName rolename')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.role', 'r')
            ->where('a.uGroup = :uGroup' )
            ->setParameter('uGroup', $uGroup->getBinId());


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

    public function getAdminsCount($uGroup)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:UGroupAdmin a JOIN a.role r WHERE a.uGroup = :uGroup')
            ->setParameter('uGroup', $uGroup->getBinId());

        return (int) $query->getSingleScalarResult();

    }


    public function isAdminForTarget($user,$uGroup)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:UGroupAdmin a WHERE a = :uGroup AND a.user = :user')
            ->setParameter('uGroup',  $uGroup->getBinId())
            ->setParameter('user', $user->getBinId());

        return (bool) $query->getSingleScalarResult() != "0";

    }

    public function removeAdmins($uGroup)
    {
        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:UGroupAdmin a WHERE a.uGroup = :uGroup')
            ->setParameter('uGroup', $uGroup->getBinId());

        $query->execute();
        return true;

    }


    public function isAdminWithRoleForUser($currentUser, $accessType, $user)
    {

        $qb1 = $this->createQueryBuilder('ga')
            ->select('count(ga)')
            ->innerJoin('ga.user', 'u', 'with', 'u.id = :currentUser')
            ->leftJoin('ga.uGroup', 'g')
            ->leftJoin('ga.role', 'r')
            ->where('r.id <= (select ro.id from FAAbsmanBundle:Role ro where ro.role = :accessType)')
            ->andWhere(':user MEMBER OF g.users')
            ->setParameter('currentUser',$currentUser->getBinId())
            ->setParameter('accessType',$accessType)
            ->setParameter('user',$user->getBinId());

        $query1 = $qb1->getQuery();

        return (int) $query1->getSingleScalarResult() > 0;
    }

    public function isAdminWithRoleForGroup($currentUser, $accessType, $group)
    {

        $qb1 = $this->createQueryBuilder('ga')
            ->select('count(ga)')
            ->innerJoin('ga.user', 'u', 'with', 'u.id = :currentUser')
            ->innerJoin('ga.uGroup', 'g', 'with', 'g.id = :group')
            ->leftJoin('ga.role', 'r')
            ->where('r.id <= (select ro.id from FAAbsmanBundle:Role ro where ro.role = :accessType)')
            ->setParameter('currentUser',$currentUser->getBinId())
            ->setParameter('accessType',$accessType)
            ->setParameter('group',$group->getBinId());

        $query1 = $qb1->getQuery();

        return (int) $query1->getSingleScalarResult() > 0;


    }
}