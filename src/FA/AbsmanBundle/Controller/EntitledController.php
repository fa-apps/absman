<?php

namespace FA\AbsmanBundle\Controller;

use FA\AbsmanBundle\Entity\EntitledCategory;
use FA\AbsmanBundle\Entity\UserEntitlement;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use FA\AbsmanBundle\Entity\DeletedItems;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


// TODO TODO check duplicate name before save

class EntitledController extends Controller
{

    public function getFormAction($id)
    {

        $isNewRecord = substr($id, 0, 2) == "0-";
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        if ( $isNewRecord ) {

            $company = $em->getRepository("FAAbsmanBundle:Company")->find(substr($id, 2));
            if ( null === $company ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Company id " . substr($id, 2) . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);
                if ( !$isAdmin ) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the create operation have been denied."
                    );

                } else {

                    $response = array(
                        "name" => "New Entitled Category",
                        "text" => "",
                        "defaultvalue" => 0,
                        "validfrom" => date_format(new \DateTime(date("1-1-Y")), 'Y-m-d'),
                        "validto" => date_format(new \DateTime(date("31-12-Y")), 'Y-m-d'),
                        "enforcevalidity" => false,
                        "autoexpires" => false,
                        "ondemanddefaultvalue" => 0,
                        "autoincrement" => "",
                        "absenceunit" => $company->getAbsenceUnit() == 0 ? "days" : "hours",
                        "minabsencelength" => $company->getAbsenceUnit() == 0 ? $company->getMinRatio() / 100 : $company->getMinRatio() / 1000,
                        "manageondemand" => $company->getManageOnDemand(),
                        "id" => $id,
                        "companyid" => $company->getId(),
                        "lastupdate" => "0",
                        "isdeletable" => false,
                        "isreadonly" => false,
                        "isfavorite" => false
                    );
                }
            }
        } else {

            $entitled = $em->getRepository("FAAbsmanBundle:EntitledCategory")->find($id);
            if ( null === $entitled ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Entitlement id " . substr($id, 2) . " does not exist."
                );
            } else {

                $company = $entitled->getCompany();
                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "company", $company);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the read operation have been denied."
                    );
                } else {

                    $response = array(
                        "name" => $entitled->getCategoryName(),
                        "text" => $entitled->getCategoryText(),
                        "defaultvalue" => $entitled->getDefaultValue(),
                        "validfrom" => date_format($entitled->getValidFrom(), 'Y-m-d'),
                        "validto" => date_format($entitled->getValidTo(), 'Y-m-d'),
                        "enforcevalidity" => $entitled->getEnforceValidity(),
                        "autoexpires" => $entitled->getAutoExpires(),
                        "ondemanddefaultvalue" => $entitled->getOnDemandDefaultValue(),
                        "autoincrement" => $entitled->getAutoIncrement(),
                        "absenceunit" => $company->getAbsenceUnit() == 0 ? "days" : "hours",
                        "minabsencelength" => $company->getAbsenceUnit() == 0 ? $entitled->getCompany()->getMinRatio() / 100 : $entitled->getCompany()->getMinRatio() / 1000,
                        "manageondemand" => $company->getManageOnDemand(),
                        "id" => $entitled->getId(),
                        "companyid" => $company->getId(),
                        "lastupdate" => $entitled->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($entitled),
                        "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company),
                        "isfavorite" => $this->isFavorite($entitled->getId())
                    );
                }
            }
        }
        return new Response(json_encode($response));
    }


    public function saveFormAction ($id, Request $request)
    {

        $isNewRecord = substr($id,0,2) == "0-";
        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $content = $request->getContent();

        if ( empty($content) ) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $params = json_decode($content, true);

            if ( $isNewRecord ) {

                $company = $em->getRepository("FAAbsmanBundle:Company")->find(substr($id, 2));
                if ( null === $company ) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Company id " . substr($id, 2) . " does not exist."
                    );

                } else {

                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the create operation have been denied."
                        );

                    } else {

                        $entitled = new EntitledCategory();
                        $em->persist($entitled);

                        $entitled->setCompany($company)
                            ->setCategoryName($params['name'])
                            ->setCategoryText($params['text'])
                            ->setDefaultValue($params['defaultvalue'])
                            ->setValidFrom(new \DateTime($params['validfrom']))
                            ->setValidTo(new \DateTime($params['validto']))
                            ->setEnforceValidity($params['enforcevalidity'])
                            ->setAutoExpires($params['autoexpires'])
                            ->setOnDemandDefaultValue($params['ondemanddefaultvalue'])
                            ->setAutoIncrement($params['autoincrement'])
                            ->setDisplayOrder(0)
                            ->setLastUpdate(new \DateTime());

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($entitled));

                        $adminShared->addAction($em, $this->getUser(), "company", $company, "NEWENTITLEDCATEGORY", "Entitled Category Created with name " . $entitled->getCategoryName() . " (" . count($changeSet) . ").", $changeSet);

                        $response = array(
                            "success" => true,
                            "lastupdate" => $entitled->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($entitled),
                            "id" => $entitled->getId(),
                            "companyid" => $company->getId(),
                            "mess" => "Entitled Category '" . $entitled->getCategoryName() . "'has been created."
                        );
                    }
                }

            } else {

                $entitled = $em->getRepository('FAAbsmanBundle:EntitledCategory')->find($id);

                if (null === $entitled) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Entitlement id " . $id . " does not exist."
                    );

                } else {

                    $company = $entitled->getCompany();
                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the update operation have been denied."
                        );

                    } else {

                        $entitled->setCategoryName($params['name'])
                            ->setCategoryText($params['text'])
                            ->setDefaultValue($params['defaultvalue'])
                            ->setValidFrom(new \DateTime($params['validfrom']))
                            ->setValidTo(new \DateTime($params['validto']))
                            ->setEnforceValidity($params['enforcevalidity'])
                            ->setAutoExpires($params['autoexpires'])
                            ->setOnDemandDefaultValue($params['ondemanddefaultvalue'])
                            ->setAutoIncrement($params['autoincrement'])
                            ->setDisplayOrder(0)
                            ->setLastUpdate(new \DateTime());

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($entitled));

                        $adminShared->addAction($em, $this->getUser(), "company", $company, "UPDATEENTITLEDCATEGORY", "Entitled Category Update " . $entitled->getCategoryName() . " (" . count($changeSet) . ").", $changeSet);

                        $response = array(
                            "success" => true,
                            "lastupdate" => $entitled->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($entitled),
                            "id" => $entitled->getId(),
                            "companyid" => $company->getId(),
                            "mess" => "Entitled Category '" . $entitled->getCategoryName() . "' has been updated."
                        );
                    }
                }
            }
            $em->flush();
        }

        return new Response(json_encode($response));
    }



    public function deleteFormAction ($id)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $entitled = $em->getRepository('FAAbsmanBundle:EntitledCategory')->find($id);

        if ( null === $entitled ) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Entitlement id " . $id . " does not exist."
            );

        } else {

            $company = $entitled->getCompany();
            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

            if ( !$isAdmin ) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {

                if ( !$this->isDeletable($entitled) ) {

                    $response = array(
                        "success" => false,
                        "reason" => "DELETE_FORBIDDEN",
                        "mess" => "Entitled category id " . $id . " can't be deleted."
                    );

                } else {

                    $backup = new DeletedItems();
                    $em->persist($backup);

                    $entitledArray = $em->getRepository("FAAbsmanBundle:EntitledCategory")->getArrayEntitledCategory($entitled);

                    $backup->setEntityName("Entitled Category: " . $entitled->getCategoryName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "entitled" => $entitledArray
                        )));

                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('ent-' . $id);

                    $adminShared->addAction($em, $this->getUser(), "company", $company, "DELETEENTITLEDCATEGORY", "Entitled Category " . $entitled->getCategoryName() . " has been deleted.", NULL);

                    $em->remove($entitled);
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "Entitled category has been deleted.",
                        "updateitems" => array("ent", "com", $company->getId())
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    public function checkFormAction($id, Request $request)
    {
        $lastupdate = $request->get('lastupdate');
        $em = $this->getDoctrine()->getManager();

        $entitled = $em->getRepository('FAAbsmanBundle:EntitledCategory')->find($id);

        if (null === $entitled) {

            $return= array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Entitlement id " . $id . " does not exist."
            );

        } else {

            $currentTimeStamp = $entitled->getLastUpdate()->getTimestamp();
            $return = array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($entitled)
            );

        }
        return new Response(json_encode($return));
    }


    private function isDeletable($entitled)
    {
        $em = $this->getDoctrine()->getManager();

        $userEntitlementCount = $em->getRepository('FAAbsmanBundle:UserEntitlement')->getCountForCategory($entitled);

        $requestCount = 0; //TODO check requests

        return $userEntitlementCount == 0 && $requestCount == 0;


    }

    private function isFavorite($id)
    {
        $em = $this->getDoctrine()->getManager();
        return $favoriteExists = $em->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(),"ent-" . $id);

    }


    public function saveCompanyListAction($targetId,$id, Request $request)
    {

        return $this->saveFormAction($id, $request);
    }



    public function getCompanyListAction($id)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $company = $em->getRepository('FAAbsmanBundle:Company')->find($id);
        if ( null === $company ) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Company id " . $id . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "company", $company);

            if ( !$isAdmin ) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the read operation have been denied."
                );

            } else {

                $entitledRecords = $em->getRepository('FAAbsmanBundle:EntitledCategory')->findByCompany($id);
                $entitledList = array();

                foreach ($entitledRecords as $entitled) {
                    $entitledList[] = Array(
                        $entitled->getId(),
                        $entitled->getCategoryName(),
                        $entitled->getCategoryText(),
                        $entitled->getDefaultValue(),
                        date_format($entitled->getValidFrom(), 'Y-m-d'),
                        date_format($entitled->getValidTo(), 'Y-m-d'),
                        $entitled->getEnforceValidity(),
                        $entitled->getAutoExpires(),
                        $entitled->getOnDemandDefaultValue(),
                        $entitled->getAutoIncrement(),
                        $entitled->getCompany()->getAbsenceUnit() == 0 ? "Days" : "Hours",
                        $company->getAbsenceUnit() == 0 ? $company->getMinRatio() / 100 : $company->getMinRatio() / 1000,
                        $entitled->getDisplayOrder(),
                        date_format($entitled->getValidFrom(), 'Y'),
                        $entitled->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $entitledList
                );
            }
        }

        return new Response(json_encode($response));
    }

    private function isGroupRemovable($entitled, $group)
    {

        //TODO search if any user in that group has already used the category in a request
        //TODO and that the category is not in any other user's group

        return true;

    }

    public function getGroupAllocatedAction($id) {

        return $this->getGroupList($id, true);
    }


    public function getGroupAvailableAction($id)  {

        return $this->getGroupList($id, false);
    }


    private function getGroupList($id, $forAllocated) {


        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($id);
        if ( null === $group ) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Group id " . $id . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "ugroup", $group);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the read operation have been denied."
                );

            } else {

                $entitledRecords = $forAllocated ? $group->getEntitledCategories() : $em->getRepository('FAAbsmanBundle:EntitledCategory')->getGroupUnallocated($group);
                $entitledList = array();

                foreach ($entitledRecords as $entitled) {
                    $entitledList[] = Array(
                        $entitled->getId(),
                        $entitled->getCategoryName(),
                        $entitled->getDefaultValue(),
                        date_format($entitled->getValidFrom(), 'Y-m-d'),
                        date_format($entitled->getValidTo(), 'Y-m-d'),
                        $entitled->getDisplayOrder(),
                        $this->isGroupRemovable($entitled, $group),
                        date_format($entitled->getValidFrom(), 'Y'),
                        $entitled->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $entitledList
                );
            }
        }

        return new Response(json_encode($response));
    }


    public function saveGroupEntitlementAction($id, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $content = $request->getContent();

        if ( empty($content) ) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($id);
            if ( null === $group ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Group id " . $id . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "ugroup", $group);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the update operation have been denied."
                    );

                } else {

                    $params = json_decode($content, true);
                    $entitledRepository = $em->getRepository('FAAbsmanBundle:EntitledCategory');
                    $affectedUsers = [];
                    foreach ($params["added"] as $entitledId) {

                        $entitlement = $entitledRepository->find($entitledId);

                        if (null !== $entitlement) {

                            $group->addEntitledCategory($entitlement);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "ADDENTITLEDCATEGORY", "Entitled category with name " . $entitlement->getCategoryName() . " added to group (" . count($changeSet) . ").", $changeSet);

                            $groupMembers = $group->getUsers();
                            foreach ($groupMembers as $user) {

                                $adminShared->addUserEntitlement($em, $user, $entitlement, $this->getUser());
                                if (!array_search($user->getId(),$affectedUsers)) $affectedUsers[] = $user->getId();
                            }
                        }
                    }

                    $removeExceptions = [];
                    foreach ($params["removed"] as $entitledId) {

                        $entitlement = $entitledRepository->find($entitledId);

                        if (null !== $entitlement && $this->isGroupRemovable($entitlement, $group)) {

                            $group->removeEntitledCategory($entitlement);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "REMOVEENTITLEDCATEGORY", "Entitled Category with name " . $entitlement->getCategoryName() . " removed from group (" . count($changeSet) . ").", $changeSet);

                            $groupMembers = $group->getUsers();
                            foreach ($groupMembers as $user) {

                                $entitlementRemoved =$adminShared->removeUserEntitlement($em, $user, $group, $entitlement, $this->getUser());

                                if (!$entitlementRemoved && !array_search($user->getId(),$removeExceptions)) $removeExceptions[] = $user->getId();
                                if (!array_search($user->getId(),$affectedUsers)) $affectedUsers[] = $user->getId();

                            }
                        }
                    }

                    $em->flush();

                    $response =  array(
                        "success" => true,
                        "mess" => "Entitled categories allocation for group '". $group->getGroupName() ."' has been updated, (". count($affectedUsers) .") user(s) affected, (". count($removeExceptions) .") Exception(s)."
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }
}