<?php

namespace FA\AbsmanBundle\Entity;

/**
 * CompanyAdminRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class CompanyAdminRepository extends \Doctrine\ORM\EntityRepository
{
    public function getAdminRoleForTarget($user,$company)
    {
        $query = $this->_em
            ->createQuery('SELECT r.role role FROM FAAbsmanBundle:CompanyAdmin a JOIN a.role r WHERE a.company = :company AND a.user = :user')
            ->setParameter('company',$company->getBinId())
            ->setParameter('user', $user->getBinId());

        $query_result = $query->getArrayResult();

        $result = false;
        if (array_key_exists(0,$query_result)) {
            $result = $query_result[0]["role"];
        }
        return $result;
    }


    public function getAdmins($company, $offset, $maxResults, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, u.displayName user, u.id userid, r.id roleid, r.roleName rolename')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.role', 'r')
            ->where('a.company = :company' )
            ->setParameter('company', $company->getBinId());


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

    public function getAdminsCount($company)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:CompanyAdmin a JOIN a.role r WHERE a.company = :company')
            ->setParameter('company', $company->getBinId());

        return (int) $query->getSingleScalarResult();

    }


    public function isAdminForTarget($user,$company)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:CompanyAdmin a WHERE a= :company AND a.user = :user')
            ->setParameter('company',  $company->getBinId())
            ->setParameter('user', $user->getBinId());

        return (bool) $query->getSingleScalarResult() != "0";

    }

    public function removeAdmins($company)
    {
        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:CompanyAdmin a WHERE a.company = :company')
            ->setParameter('company', $company->getBinId());

        $query->execute();
        return true;

    }


    public function isAdminWithRoleForUser($currentUser, $accessType, $user)
    {

        $qb1 = $this->createQueryBuilder('ca')
            ->select('count(ca)')
            ->innerJoin('ca.user', 'u', 'with', 'u.id = :currentUser')
            ->leftJoin('ca.company', 'c')
            ->leftJoin('ca.role', 'r')
            ->where('r.id <= (select ro.id from FAAbsmanBundle:Role ro where ro.role = :accessType)')
            ->andWhere(':user MEMBER OF c.users')
            ->setParameter('currentUser',$currentUser->getBinId())
            ->setParameter('accessType',$accessType)
            ->setParameter('user',$user->getBinId());

        $query1 = $qb1->getQuery();

        return (int) $query1->getSingleScalarResult() > 0;

    }

    public function isAdminWithRoleForCompany($currentUser, $accessType, $company)
    {

        $qb1 = $this->createQueryBuilder('ca')
            ->select('count(ca)')
            ->innerJoin('ca.user', 'u', 'with', 'u.id = :currentUser')
            ->innerJoin('ca.company', 'c' , 'with', 'c.id = :company')
            ->leftJoin('ca.role', 'r')
            ->where('r.id <= (select ro.id from FAAbsmanBundle:Role ro where ro.role = :accessType)')
            ->setParameter('currentUser',$currentUser->getBinId())
            ->setParameter('accessType',$accessType)
            ->setParameter('company',$company->getBinId());

        $query1 = $qb1->getQuery();

        return (int) $query1->getSingleScalarResult() > 0;
    }

    public function isAdminWithRoleForGroup($currentUser, $accessType, $group)
    {

        $qb1 = $this->createQueryBuilder('ca')
            ->select('count(ca)')
            ->innerJoin('ca.user', 'u', 'with', 'u.id = :currentUser')
            ->innerJoin('ca.company', 'c')
            ->leftJoin('ca.role', 'r')
            ->where('r.id <= (select ro.id from FAAbsmanBundle:Role ro where ro.role = :accessType)')
            ->andWhere(':group MEMBER OF c.uGroups')
            ->setParameter('currentUser',$currentUser->getBinId())
            ->setParameter('accessType',$accessType)
            ->setParameter('group',$group->getBinId());

        $query1 = $qb1->getQuery();

        return (int) $query1->getSingleScalarResult() > 0;
    }
}
