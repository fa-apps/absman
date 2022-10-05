<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class ActionRepository extends EntityRepository
{



    public function getCountryActionsCount($country)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:Action a JOIN a.country c WHERE c = :country')
            ->setParameter('country', $country->getBinId());

        return (int) $query->getSingleScalarResult();
    }


    public function getCountryActions($country, $start, $limit, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.country', 'c')
            ->leftJoin('a.actionType', 't')
            ->where('c = :country' )
            ->setParameter('country', $country->getBinId());


        if (!empty($sort)) {
            $sortColumns = array("date"=>"a.actionDate","text"=>"a.actionText","user"=>"u.displayName","type"=>"t.actionTypeText");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]] , $sort[0]["direction"]);
        } else {
            $queryBuilder->orderby('a.actionDate', 'DESC');
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function getFullCountryActions($country, $start, $limit)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type, a.actionDetails details')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.country', 'c')
            ->leftJoin('a.actionType', 't')
            ->where('c = :country' )
            ->setParameter('country', $country->getBinId());

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function removeCountryActions($country)
    {
        $actions = $this->_em
            ->createQuery('SELECT a.id FROM FAAbsmanBundle:Action a JOIN a.country c WHERE c = :country')
            ->setParameter('country', $country->getBinId());

        $actionIds=array();
        foreach ($actions->getArrayResult() as $action) {
            $actionIds[] = pack('H*',$action["id"]);
        }

        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:Action a WHERE a.id IN (:actionIds)')
            ->setParameter('actionIds', $actionIds);

        $query->execute();

        return true;
    }



    public function getCompanyActionsCount($company)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:Action a JOIN a.company c WHERE c = :company')
            ->setParameter('company', $company->getBinId());

        return (int) $query->getSingleScalarResult();
    }


    public function getCompanyActions($company, $start, $limit, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.company', 'c')
            ->leftJoin('a.actionType', 't')
            ->where('c = :company' )
            ->setParameter('company', $company->getBinId());


        if (!empty($sort)) {
            $sortColumns = array("date"=>"a.actionDate","text"=>"a.actionText","user"=>"u.displayName","type"=>"t.actionTypeText");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]] , $sort[0]["direction"]);
        } else {
            $queryBuilder->orderby('a.actionDate', 'DESC');
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function getFullCompanyActions($company, $start, $limit)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type, a.actionDetails details')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.company', 'c')
            ->leftJoin('a.actionType', 't')
            ->where('c = :company' )
            ->setParameter('company', $company->getBinId());

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function removeCompanyActions($company)
    {
        $actions = $this->_em
            ->createQuery('SELECT a.id FROM FAAbsmanBundle:Action a JOIN a.company c WHERE c = :company')
            ->setParameter('company', $company->getBinId());

        $actionIds=array();
        foreach ($actions->getArrayResult() as $action) {
            $actionIds[] = pack('H*',$action["id"]);
        }

        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:Action a WHERE a.id IN (:actionIds)')
            ->setParameter('actionIds', $actionIds);

        $query->execute();

        return true;
    }



    public function getUGroupActionsCount($group)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:Action a JOIN a.ugroup g WHERE g = :group')
            ->setParameter('group', $group->getBinId());

        return (int) $query->getSingleScalarResult();
    }


    public function getUGroupActions($group, $start, $limit, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.ugroup', 'g')
            ->leftJoin('a.actionType', 't')
            ->where('g = :ugroup' )
            ->setParameter('ugroup', $group->getBinId());


        if (!empty($sort)) {
            $sortColumns = array("date"=>"a.actionDate","text"=>"a.actionText","user"=>"u.displayName","type"=>"t.actionTypeText");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]] , $sort[0]["direction"]);
        } else {
            $queryBuilder->orderby('a.actionDate', 'DESC');
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function getFullUGroupActions($group, $start, $limit)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type, a.actionDetails details')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.ugroup', 'c')
            ->leftJoin('a.actionType', 't')
            ->where('c = :group' )
            ->setParameter('group', $group->getBinId());

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function getFullUserEntitlementActions($userEntitlement, $start, $limit)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type, a.actionDetails details')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.userEntitlement', 'ue' ,'with', 'ue.id = :userEntitlement')
            ->leftJoin('a.actionType', 't')
            ->setParameter('userEntitlement', $userEntitlement->getBinId());

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function removeUGroupActions($group)
    {
        $actions = $this->_em
            ->createQuery('SELECT a.id FROM FAAbsmanBundle:Action a JOIN a.ugroup c WHERE c = :group')
            ->setParameter('group', $group->getBinId());

        $actionIds=array();
        foreach ($actions->getArrayResult() as $action) {
            $actionIds[] = pack('H*',$action["id"]);
        }

        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:Action a WHERE a.id IN (:actionIds)')
            ->setParameter('actionIds', $actionIds);

        $query->execute();

        return true;
    }



    public function getUserActionsCount($targetUser)
    {
        $query = $this->_em
            ->createQuery('SELECT COUNT(a) FROM FAAbsmanBundle:Action a JOIN a.targetUser tu WHERE tu = :targetUser')
            ->setParameter('targetUser', $targetUser->getBinId());

        return (int) $query->getSingleScalarResult();
    }


    public function getUserActions($targetUser, $start, $limit, $sort)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type')
            ->leftJoin('a.user', 'u')
            ->innerJoin('a.targetUser', 'tu', 'with', 'tu = :targetUser' )
            ->leftJoin('a.actionType', 't')
            ->setParameter('targetUser', $targetUser->getBinId());


        if (!empty($sort)) {

            $sortColumns = array("date"=>"a.actionDate","text"=>"a.actionText","user"=>"u.displayName","type"=>"t.actionTypeText");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]] , $sort[0]["direction"]);
        }
        else {

            $queryBuilder->orderby('a.actionDate', 'DESC');
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function getFullUserActions($targetUser, $start, $limit)
    {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName user, a.actionDate date, t.actionTypeText type, a.actionDetails details')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.targetUser', 'tu')
            ->leftJoin('a.actionType', 't')
            ->where('tu = :targetUser' )
            ->setParameter('targetUser', $targetUser->getBinId());

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function removeUserActions($targetUser)
    {
        $actions = $this->_em
            ->createQuery('SELECT a.id FROM FAAbsmanBundle:Action aJOIN a.targetUser tu WHERE tu = :targetUser')
            ->setParameter('targetUser', $targetUser->getBinId());

        $actionIds=array();
        foreach ($actions->getArrayResult() as $action) {
            $actionIds[] = pack('H*',$action["id"]);
        }

        $query = $this->_em
            ->createQuery('DELETE FROM FAAbsmanBundle:Action a WHERE a.id IN (:actionIds)')
            ->setParameter('actionIds', $actionIds);

        $query->execute();

        return true;
    }



    public function getRequestActions ($absRequest) {

        $queryBuilder = $this->createQueryBuilder('a')
            ->select('a.id, a.actionText text, u.displayName actionBy, a.actionDate date, t.actionType actionType, t.actionTypeText actionTypeText, a.actionDetails details, r.id reqId')
            ->innerJoin('a.request', 'r', 'with', 'r.id = :request')
            ->leftJoin('a.user', 'u')
            ->leftJoin('a.targetUser', 'tu')
            ->leftJoin('a.actionType', 't')
            ->orderBy('date')
            ->setParameter('request', $absRequest->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();


    }

}
