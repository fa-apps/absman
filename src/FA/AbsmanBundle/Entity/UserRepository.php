<?php

namespace FA\AbsmanBundle\Entity;

use Doctrine\ORM\EntityRepository;


class UserRepository extends EntityRepository
{


    public function getUserCount(Company $company)
    {

        $qb = $this->createQueryBuilder('u')
            ->select('count(u)')
            ->where('u.company = :company')
            ->setParameter('company', $company->getBinId());

        $query = $qb->getQuery();

        return intval($query->getSingleScalarResult());
    }


    public function getUserGroupCount(UGroup $group)
    {

        $qb = $this->createQueryBuilder('u')
            ->select('count(u)')
            ->where(':group MEMBER OF u.uGroups')
            ->setParameter('group', $group->getBinId());

        $query = $qb->getQuery();

        return intval($query->getSingleScalarResult());
    }


    public function searchUsers($searchText, $start, $limit, $sort, $filter)
    {

        $queryBuilder = $this->createQueryBuilder('u')
            ->select('u.id,u.userNumber number, u.title, u.firstName first, u.lastName last, u.displayName name, u.email, e.companyName company, c.countryName country')
            ->leftJoin('u.company', 'e')
            ->leftJoin('e.country', 'c')
            ->where('u.lastName like :searchText')
            ->orWhere('u.firstName like :searchText')
            ->orWhere('u.email like :searchText')
            ->orWhere('u.userNumber like :searchText')
            ->orWhere('u.displayName like :searchText')
            ->setParameter('searchText', '%' . $searchText . '%');


        if (!empty($sort)) {

            $sortColumns = array("number" => "u.userNumber", "title" => "u.title", "last" => "u.lastName", "first" => "u.firstName", "email" => "u.email", "company" => "e.companyName", "country" => "c.countryName");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]], $sort[0]["direction"]);

        } else {

            $queryBuilder->orderby('u.lastName', 'DESC');

        }


        if (!empty($filter)) {
            foreach ($filter as $filterItem) {
                $property = $filterItem["property"];
                $value = $filterItem["value"];

                switch ($property) {
                    case "outgroup":
                        $group = $this->getEntityManager()->getRepository("FAAbsmanBundle:UGroup")->find($value);
                        $queryBuilder->andWhere(':group NOT MEMBER OF u.uGroups')->setParameter('group', $group->getBinId());
                        break;

                    case "company":
                        $company = $this->getEntityManager()->getRepository("FAAbsmanBundle:Company")->find($value);
                        $queryBuilder->andWhere('e.id = :company')->setParameter('company', $company->getBinId());
                        break;

                    case "requestfor":
                        break;
                }
            }
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function searchUsersCount($searchText, $filter)
    {
        $queryBuilder = $this->createQueryBuilder('u')
            ->select('count(u)')
            ->leftJoin('u.company', 'e')
            ->where('u.lastName like :searchText')
            ->orWhere('u.firstName like :searchText')
            ->orWhere('u.email like :searchText')
            ->orWhere('u.userNumber like :searchText')
            ->orWhere('u.displayName like :searchText')
            ->setParameter('searchText', '%' . $searchText . '%');

        if (!empty($filter)) {
            foreach ($filter as $filterItem) {
                $property = $filterItem["property"];
                $value = $filterItem["value"];

                switch ($property) {
                    case "outgroup":
                        $group = $this->getEntityManager()->getRepository("FAAbsmanBundle:UGroup")->find($value);
                        $queryBuilder->andWhere(':group NOT MEMBER OF u.uGroups')->setParameter('group', $group->getBinId());
                        break;

                    case "company":
                        $company = $this->getEntityManager()->getRepository("FAAbsmanBundle:Company")->find($value);
                        $queryBuilder->andWhere('e.id = :company')->setParameter('company', $company->getBinId());
                        break;
                }
            }
        }

        $query = $queryBuilder->getQuery();

        return $query->getSingleScalarResult();
    }


    public function getUserInGroup($group, $start, $limit, $sort)
    {
        $queryBuilder = $this->createQueryBuilder('u')
            ->select('u.id, u.displayName displayname, u.firstName firstname, u.lastName lastname, u.email, u.title, u.enabled, u.userNumber number, u.lastUpdate lastupdate, c.id companyid')
            ->leftJoin('u.uGroups', 'g')
            ->leftJoin('u.company', 'c')
            ->where('g.id = :group')
            ->setParameter('group', $group->getBinId());

        if (!empty($sort)) {
            $sortColumns = array("number" => "u.userNumber", "lastname" => "u.lastName", "firstname" => "u.firstName", "email" => "u.email", "title" => "u.title");
            $queryBuilder->orderby($sortColumns[$sort[0]["property"]], $sort[0]["direction"]);
        } else {
            $queryBuilder->orderby('u.lastName', 'DESC');
        }

        $query = $queryBuilder->getQuery();

        $query->setMaxResults($limit);
        $query->setFirstResult($start);

        return $query->getArrayResult();
    }


    public function getTitles($company = null)
    {

        $queryBuilder = $this->createQueryBuilder('u')
            ->select('u.title')->distinct();

        return $queryBuilder->getQuery()->getResult();
    }


    public function getArrayUser($user)
    {

        $queryBuilder = $this->createQueryBuilder('u')
            ->where('u = :user')
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getArrayResult();
    }


    public function hasNewerTimeStampForGroup($group, $oldestTimeStamp)
    {

        $queryBuilder = $this->createQueryBuilder('u')
            ->select('count(u)')
            ->innerJoin('u.uGroups', 'g', 'with', 'g.id = :group')
            ->Where('u.lastUpdate > :oldestDate')
            ->setParameter('group', $group->getBinId())
            ->setParameter('oldestDate', date_create("@$oldestTimeStamp"));

        $query = $queryBuilder->getQuery();

        return (int)$query->getSingleScalarResult() !== 0;
    }


    public function getMyStaff($user)
    {

        $queryBuilder = $this->createQueryBuilder('u')
            ->innerJoin('u.approver', 'a', 'with', 'a.id = :user')
            ->orderBy('u.lastName', 'ASC')
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getResult();

    }

    public function getReports($user)
    {

        $queryBuilder = $this->createQueryBuilder('u')
            ->innerJoin('u.approver', 'a', 'with', 'a.id = :user')
            ->orderBy('u.lastName', 'ASC')
            ->setParameter('user', $user->getBinId());

        $query = $queryBuilder->getQuery();

        return $query->getResult();

    }


}
