<?php

namespace FA\AbsmanBundle\Controller;

use FA\AbsmanBundle\Entity\UGroup;
use FA\AbsmanBundle\Entity\UGroupAdmin;
use FA\AbsmanBundle\Entity\DeletedItems;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class UGroupController extends Controller
{

    public function getFormAction($id)
    {
        $isNewRecord = substr($id,0,2) == "0-";
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        if ($isNewRecord) {

            $company = $em->getRepository("FAAbsmanBundle:Company")->find(substr($id, 2));

            if (null === $company) {

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

                    $response = array(
                        "name" => "New Group",
                        "workingdays" => $company->getWorkingDays(),
                        "disablepublicdays" => false,
                        "id" => $id,
                        "companyid" => $company->getId(),
                        "lastupdate" => "0",
                        "isdeletable" => false,
                        "isreadonly" => false,
                        "isfavorite" => false,
                        "isdefaultgroup" => false
                    );
                }
            }
        } else {

            $group = $em->getRepository("FAAbsmanBundle:UGroup")->find($id);

            if (null === $group) {

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

                    $isDefaultGroup = $em->getRepository("FAAbsmanBundle:Company")->isDefaultGroup($group);

                    $response = array(
                        "name" => $group->getGroupName(),
                        "workingdays" => $group->getWorkingDays(),
                        "disablepublicdays" => $group->getDisablePublicDays(),
                        "id" => $group->getId(),
                        "companyid" => $group->getCompany()->getId(),
                        "lastupdate" => $group->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $isDefaultGroup ? false : $this->isDeletable($group),
                        "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "ugroup", $group),
                        "isfavorite" => $em->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(), "gro-" . $id),
                        "isdefaultgroup" => $isDefaultGroup
                    );
                }
            }
        }

        return new JsonResponse($response);
    }


    public function saveFormAction ($id, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();
        $isNewRecord = substr($id, 0, 2) == "0-";

        $content = $request->getContent();

        if (empty($content)) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $params = json_decode($content, true);

            if ($isNewRecord) {

                $company = $em->getRepository("FAAbsmanBundle:Company")->find(substr($id, 2));

                if (null === $company) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Country id " . substr($id, 2) . " does not exist."
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

                        $isDuplicateName = $em->getRepository("FAAbsmanBundle:UGroup")->isDuplicateNameForInsert($company, $params['name']);

                        if ($isDuplicateName) {

                            $response = array(
                                "success" => false,
                                "reason" => "DUPLICATE_NAME",
                                "mess" => "A Group record with name '" . $params["name"] . "' already exists"
                            );

                        } else {

                            $group = new UGroup();
                            $em->persist($group);
                            $group->setCompany($company)
                                ->setGroupName($params['name'])
                                ->setWorkingDays($params['workingdays'])
                                ->setDisablePublicDays($params['disablepublicdays'])
                                ->setLastUpdate(new \DateTime());

                            $groupAdmin = New UGroupAdmin();
                            $em->persist($groupAdmin);
                            $groupAdmin->setUser($this->getUser())
                                ->setRole($em->getRepository('FAAbsmanBundle:Role')->findOneBy(array('role' => 'admin')))
                                ->SetUGroup($group);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));
                            $groupAdminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($groupAdmin));
                            $adminShared->addAction($em, $this->getUser(), "company", $company, "NEWGROUP", "Group Created with name " . $group->getGroupName() . " (" . count($changeSet) . ").", $changeSet)
                                ->addAction($em, $this->getUser(), "ugroup", $group, "NEWGROUP", "Group Created with name " . $group->getGroupName() . " (" . count($changeSet) . ").", $changeSet)
                                ->addAction($em, $this->getUser(), "ugroup", $group, "NEWADMIN", "Group Admin " . $this->getUser()->getDisplayName() . " added with role " . $groupAdmin->getRole()->getRoleName() . ".", $groupAdminChangeSet);

                            $response = array(
                                "success" => true,
                                "lastupdate" => $group->getLastUpdate()->getTimestamp(),
                                "isdeletable" => false,
                                "id" => $group->getId(),
                                "companyid" => $company->getId(),
                                "newnode" => $adminShared->getGroupNode($group->getId(), $group->getGroupName(), false),
                                "mess" => "Group '" . $group->getGroupName() . "' has been created."
                            );
                        }
                    }
                }
            } else {

                $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($id);

                if (null === $group) {

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

                        $isDuplicateName = $em->getRepository("FAAbsmanBundle:UGroup")->isDuplicateNameForUpdate($group, $params['name']);

                        if ($isDuplicateName) {

                            $response = array(
                                "success" => false,
                                "reason" => "DUPLICATE_NAME",
                                "mess" => "A Group record with name '" . $params["name"] . "' already exists"
                            );

                        } else {

                            $isDefaultGroup = $em->getRepository("FAAbsmanBundle:Company")->isDefaultGroup($group);

                            $group->setGroupName($params['name'])
                                ->setWorkingDays($params['workingdays'])
                                ->setDisablePublicDays($params['disablepublicdays'])
                                ->setLastUpdate(new \DateTime());

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));
                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "UPDATEGROUP", "Group Update " . $group->getGroupName() . " (" . count($changeSet) . ").", $changeSet);

                            $response = array(
                                "success" => true,
                                "lastupdate" => $group->getLastUpdate()->getTimestamp(),
                                "isdeletable" => $isDefaultGroup ? false : $this->isDeletable($group),
                                "id" => $group->getId(),
                                "companyid" => $group->getCompany()->getId(),
                                "mess" => "Group '" . $group->getGroupName() . "' has been updated."
                            );
                        }
                    }
                }
            }
        }

        $em->flush();
        return new JsonResponse($response);
    }


    public function deleteFormAction ($id)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $group = $em->getRepository("FAAbsmanBundle:UGroup")->find($id);

        if (null === $group) {

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
                    "mess" => "Access for the delete operation have been denied."
                );

            } else {

                if (!$this->isDeletable($group)) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_DELETABLE",
                        "mess" => "The record can't be deleted."
                    );

                } else {

                    $groupArray = $em->getRepository("FAAbsmanBundle:UGroup")->getArrayUGroup($group);
                    $groupHistory = $em->getRepository("FAAbsmanBundle:Action")->getFullUGroupActions($group, 0, 250);
                    $groupAdmins = $em->getRepository("FAAbsmanBundle:UGroupAdmin")->getAdmins($group, 0, 250, "");

                    $backup = new DeletedItems();
                    $em->persist($backup);
                    $backup->setEntityName("Group " . $group->getGroupName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "group" => $groupArray,
                            "admins" => $groupAdmins,
                            "history" => $groupHistory
                        )));


                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('gro-' . $id);
                    $em->getRepository("FAAbsmanBundle:UGroupAdmin")->removeAdmins($group);
                    $em->getRepository("FAAbsmanBundle:Action")->removeUGroupActions($group);

                    $em->remove($group);

                    $uow = $em->getUnitOfWork();
                    $uow->computeChangeSets();
                    $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                    $adminShared->addAction($em, $this->getUser(), "company", $group->getCompany(), "DELETEGROUP", "Group " . $group->getGroupName() . " has been deleted.", $changeSet);

                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "Group has been deleted."
                    );
                }
            }
        }

        return new JsonResponse($response);
    }


    public function checkFormAction($id, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($id);

        if (null === $group) {

            $response = array(
                "success" => false,
                "code" => "NOT_FOUND",
                "mess" => "Group id " . $id . " does not exist."
            );

        } else {

            $oodSubForms = Array();
            $loadedSubForms = (array) json_decode($request->get("subforms"));

            foreach ($loadedSubForms as $formType => $oldestTimeStamp) {

                if ($adminShared->subFormIsOutOfDate($em, $group, $formType, $oldestTimeStamp)) {

                    $oodSubForms[] = $formType;
                }
            }

            $lastupdate = $request->get('lastupdate');
            $currentTimeStamp = $group->getLastUpdate()->getTimestamp();

            $response = array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $em->getRepository("FAAbsmanBundle:Company")->isDefaultGroup($group) ? false : $this->isDeletable($group),
                "oodSubForms" => $oodSubForms
            );
        }

        return new JsonResponse($response);
    }


    private function isDeletable($group)
    {

        return $this->getDoctrine()->getManager()->getRepository('FAAbsmanBundle:User')->getUserGroupCount($group) === 0;
    }


    public function getMembersAction($groupId,  Request $request) {

        $em = $this->getDoctrine()->getManager();
        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($groupId);
        $adminShared = $this->get('fa_absman.admin.shared');

        if (null === $group) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Group id " . $groupId . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(),"reader", "ugroup", $group);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the read operation have been denied."
                );

            } else {


                $userList = array();
                $sortstring = $request->get("sort");
                $sort = $sortstring ? json_decode($sortstring, true) : array();;
                $users = $em->getRepository('FAAbsmanBundle:User')->getUserInGroup($group, $request->get("start"), $request->get("limit"), $sort);

                foreach ($users as $user) {
                    $userList[] = Array(
                        $user["id"],
                        $user["displayname"],
                        $user["firstname"],
                        $user["lastname"],
                        $user["title"],
                        $user["email"],
                        $user["number"],
                        $user["enabled"],
                        $user["lastupdate"]->getTimestamp(),
                        $user["companyid"]
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $userList
                );
            }
        }

        return new JsonResponse($response);
    }


    public function addMembersAction($groupId, Request $request) {

        $adminShared = $this->get('fa_absman.admin.shared');

        $userIds = json_decode($request->get("ids"));
        $em = $this->getDoctrine()->getManager();
        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($groupId);

        if (null === $group) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Group id " . $groupId . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(),"editor", "ugroup", $group);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the add operation have been denied."
                );

            } else {

                $response = array(
                    "success" => true,
                    "mess" => "Users have been added to the group."
                );

                foreach ($userIds as $userId) {

                    $user = $em->getRepository('FAAbsmanBundle:User')->find($userId);

                    if (null === $user) {

                        $response = array(
                            "success" => false,
                            "reason" => "NOT_FOUND",
                            "mess" => "User id " . $userId . " does not exist."
                        );
                        break;

                    } else {

                        $isMember = $em->getRepository('FAAbsmanBundle:UGroup')->isMember($group, $user);

                        if (!$isMember) {

                            $group->addUser($user);
                            $user->addUGroup($group);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "ADDGROUPMEMBER", "User " . $user->getDisplayName() . " added to group " . $group->getGroupName(), $changeSet);
                            $adminShared->addAction($em, $this->getUser(), "user", $user, "ADDGROUPMEMBER", "User " . $user->getDisplayName() . " added to group " . $group->getGroupName(), $changeSet);

                            $entitlements = $group->getEntitledCategories();
                            foreach ($entitlements as $entitlement) {

                                $adminShared->addUserEntitlement($em, $user, $entitlement, $this->getUser());
                            }
                            $user->setLastUpdate(new \DateTime());

                        }
                    }
                }

                $em->flush();
            }
        }

        return new JsonResponse($response);
    }


    public function removeMembersAction($groupId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($groupId);

        if (null === $group) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Group id " . $groupId . " does not exist."
            );

        } else {

            $userIds = json_decode($request->get("ids"));
            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "ugroup", $group);


            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {

                $response = array(
                    "success" => true,
                    "mess" => "Users have been removed from the group."
                );

                foreach ($userIds as $userId) {

                    $user = $em->getRepository('FAAbsmanBundle:User')->find($userId);

                    if (null === $user) {

                        $response = array(
                            "success" => false,
                            "reason" => "NOT_FOUND",
                            "mess" => "User id " . $userId . " does not exist."
                        );
                        break;

                    } else {

                        $isMember = $em->getRepository('FAAbsmanBundle:UGroup')->isMember($group, $user);

                        if ($isMember) {

                            $group->removeUser($user);
                            $user->removeUGroup($group);
                            $user->setLastUpdate(new \DateTime());

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared
                                ->addAction($em, $this->getUser(), "ugroup", $group, "REMOVEGROUPMEMBER", "User " . $user->getDisplayName() . " removed from group " . $group->getGroupName(), $changeSet)
                                ->addAction($em, $this->getUser(), "user", $user, "REMOVEGROUPMEMBER", "User " . $user->getDisplayName() . " removed from group " . $group->getGroupName(), $changeSet);

                            $entitlements = $group->getEntitledCategories();
                            foreach ($entitlements as $entitlement) {

                                $adminShared->removeUserEntitlement($em, $user, $group, $entitlement, $this->getUser());
                            }
                        }
                    }
                }

                $em->flush();
            }
        }

        return new JsonResponse($response);
    }
}