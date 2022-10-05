<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\UserPreference;
use FA\AbsmanBundle\Entity\DeletedItems;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class UserController extends Controller
{
    public function getFormAction($id)
    {

        $isNewRecord = substr($id,0,2) == "0-";
        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $workflowList = array_map( function ($workflowItem) {

            return array($workflowItem["id"], $workflowItem["workflowName"], $workflowItem["workflowText"]);

        }, $em->getRepository("FAAbsmanBundle:Workflow")->getWorkflows());

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
                        "mess" => "Access for the read operation have been denied."
                    );

                } else {

                    $list = array_map(function ($title) {
                        return $title["title"];
                    }, $em->getRepository("FAAbsmanBundle:User")->getTitles($company));

                    $displayNameFormat = $company->getDisplayNameFormat()->getTemplate();

                    $response = array(
                        "username" => "",
                        "displayname" => "",
                        "title" => "",
                        "firstname" => "",
                        "lastname" => "",
                        "email" => "",
                        "number" => "",
                        "workingdays" => $company->getDefaultGroup()->getWorkingDays(),
                        "birthdate" => null,
                        "hiredate" => null,
                        "disablepublicdays" => false,
                        "enabled" => true,
                        "id" => $id,
                        "companyid" => $company->getId(),
                        "lastupdate" => 0,
                        "isdeletable" => false,
                        "isfavorite" => false,
                        "success" => true,
                        "lists" => array("titles" => array_values($list),
                            "displayNameFormat" => $displayNameFormat,
                            "workflow" => $workflowList),
                        "manageondemand" => $company->getManageOnDemand(),
                        "workflow" => 1

                    );
                }
            }
        } else {

            $user = $em->getRepository("FAAbsmanBundle:User")->find($id);

            if (null === $user) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "User id " . $id . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "user", $user);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the read operation have been denied."
                    );

                } else {

                    $isReadOnly = !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "user", $user);

                    $company = $user->getCompany();

                    $list = array_map(function ($title) {
                        return $title["title"];
                    }, $em->getRepository("FAAbsmanBundle:User")->getTitles($company));

                    $displayNameFormat = $company->getDisplayNameFormat()->getTemplate();


                    $approver = $this->getUserArray($user->getApprover());
                    $standInApprover = $this->getUserArray($user->getStandInApprover());
                    $substitute = $this->getUserArray($user->getSubstitute());
                    $notified = $this->getUserArray($user->getNotified());
                    $absproxy = $this->getUserArray($user->getAbsProxy());

                    $response = array(
                        "username" => $user->getUsername(),
                        "displayname" => $user->getDisplayName(),
                        "title" => $user->getTitle(),
                        "firstname" => $user->getFirstName(),
                        "lastname" => $user->getLastName(),
                        "email" => $user->getEmail(),
                        "number" => $user->getUserNumber(),
                        "workingdays" => $user->getWorkingDays(),
                        "birthdate" => date_format($user->getBirthDate(), 'Y-m-d'),
                        "hiredate" => date_format($user->getHireDate(), 'Y-m-d'),
                        "disablepublicdays" => $user->getDisablePublicDays(),
                        "enabled" => $user->isEnabled(),
                        "id" => $user->getId(),
                        "companyid" => $user->getCompany()->getId(),
                        "lastupdate" => $user->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($user),
                        "isreadonly" => $isReadOnly,
                        "isfavorite" => $em->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(), "use-" . $id),
                        "success" => true,
                        "lists" => array("titles" => array_values($list),
                            "displayNameFormat" => $displayNameFormat,
                            "workflow" => $workflowList),
                        "manageondemand" => $company->getManageOnDemand(),
                        "workflow" => $user->getWorkflow()->getId(),
                        "approver" => $approver["name"],
                        "approverid" => $approver["id"],
                        "standinapprover" => $standInApprover["name"],
                        "standinapproverid" => $standInApprover["id"],
                        "substitute" => $substitute["name"],
                        "substituteid" => $substitute["id"],
                        "notified" => $notified["name"],
                        "notifiedid" => $notified["id"],
                        "absproxy" => $absproxy["name"],
                        "absproxyid" => $absproxy["id"],
                        "notes" => $user->getNotes(),
                        "adminnotes" => $user->getAdminNotes()
                    );
                }
            }
        }

        return new JsonResponse($response);
    }


    private function getUserArray ($user) {

        return  null === $user ? array("id" => "0", "name" => "" ) : array("id" => $user->getId(), "name" => $user->getDisplayName() ) ;
    }

    public function saveFormAction ($id, Request $request)
    {

        $isNewRecord = substr($id,0,2) == "0-";
        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();
        $userManager = $this->container->get('fos_user.user_manager');

        $content = $request->getContent();

        if ( empty($content) ) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $params = json_decode($content, true);
            $workflow = $em->getRepository("FAAbsmanBundle:Workflow")->find($params["workflow"]);
            $approver = $userManager->findUserBy(array('id' => $params["approverid"]));
            $standInApprover = $userManager->findUserBy(array('id' => $params["standinapproverid"]));
            $substitute = $userManager->findUserBy(array('id' => $params["substituteid"]));
            $notified = $userManager->findUserBy(array('id' => $params["notifiedid"]));
            $absProxy = $userManager->findUserBy(array('id' => $params["absproxyid"]));


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

                        $user = $userManager->createUser();

                        $user->setUsername($params["username"])
                            ->setEmail($params["email"])
                            ->setPlainPassword('test')
                            ->setEnabled(true)
                            ->setDisplayName($params["displayname"])
                            ->setTitle($params["title"])
                            ->setFirstName($params["firstname"])
                            ->setLastName($params["lastname"])
                            ->setUserNumber($params["number"])
                            ->setWorkingDays($params["workingdays"])
                            ->setBirthDate(new \DateTime('@' . $params["birthdate"]))
                            ->setHireDate(new \DateTime('@' . $params["hiredate"]))
                            ->setDisablePublicDays($params["disablepublicdays"])
                            ->setLastUpdate(new \DateTime())
                            ->setCompany($company)
                            ->addUGroup($company->getDefaultGroup())
                            ->setWorkflow($workflow)
                            ->setApprover($approver)
                            ->setStandInApprover($standInApprover)
                            ->setSubstitute($substitute)
                            ->setNotified($notified)
                            ->setAbsProxy($absProxy)
                            ->setAdminNotes($params["adminnotes"]);

                        $userManager->updateUser($user, false);

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($user));
                        $adminShared->addAction($em, $this->getUser(), "user", $user, "NEWUSER", "User Created with name " . $user->getDisplayName() . " (" . count($changeSet) . ").", $changeSet);

                        $entitlements = $company->getDefaultGroup()->getEntitledCategories();
                        $adminShared = $this->get('fa_absman.admin.shared');

                        foreach($entitlements as $entitlement) {

                            $adminShared->addUserEntitlement ($em, $user, $entitlement, $this->getUser());
                        }

                        $response = array(
                            "success" => true,
                            "lastupdate" => $user->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($user),
                            "id" => $user->getId(),
                            "companyid" => $user->getCompany()->getId(),
                            "newnode" => "none",
                            "mess" => "User '" . $user->getDisplayName() ."' has been created."
                        );
                    }
                }
            } else {

                $user = $userManager->findUserBy(array('id' => $id));

                if (null === $user) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "User id " . $id . " does not exist."
                    );

                } else {

                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "user", $user);

                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the update operation have been denied."
                        );

                    } else {

                        $user->setUsername($params["username"])
                            ->setdisplayname($params["displayname"])
                            ->setTitle($params["title"])
                            ->setFirstName($params["firstname"])
                            ->setLastName($params["lastname"])
                            ->setEmail($params["email"])
                            ->setUserNumber($params["number"])
                            ->setWorkingDays($params["workingdays"])
                            ->setBirthDate(new \DateTime('@' . $params["birthdate"]))
                            ->setHireDate(new \DateTime('@' . $params["hiredate"]))
                            ->setDisablePublicDays($params["disablepublicdays"])
                            ->setEnabled($params["enabled"])
                            ->setLastUpdate(new \DateTime())
                            ->setWorkflow($workflow)
                            ->setApprover($approver)
                            ->setStandInApprover($standInApprover)
                            ->setSubstitute($substitute)
                            ->setNotified($notified)
                            ->setAbsProxy($absProxy)
                            ->setAdminNotes($params["adminnotes"]);


                        $userManager->updateUser($user, false);

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($user));
                        $adminShared->addAction($em, $this->getUser(), "user", $user, "UPDATEUSER", "User " . $user->getDisplayName() . " Updated (" . count($changeSet) . ").", $changeSet);

                        $response = array(
                            "success" => true,
                            "lastupdate" => $user->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($user),
                            "id" => $user->getId(),
                            "companyid" => $user->getCompany()->getId(),
                            "mess" => "User '" . $user->getDisplayName() . "' has been updated."
                        );
                    }
                }
            }
            $em->flush();
        }

        return new JsonResponse($response);
    }


    public function deleteFormAction ($id)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $user = $em->getRepository("FAAbsmanBundle:User")->find($id);

        if (null === $user) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $id . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "user", $user);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the delete operation have been denied."
                );

            } else {

                if (!$this->isDeletable($user)) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_DELETABLE",
                        "mess" => "The record can't be deleted."
                    );

                } else {

                    $userArray = $em->getRepository("FAAbsmanBundle:User")->getArrayUser($user);
                    $userEntitlements = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserEntitlementBackup($user);
                    $userHistory = $em->getRepository("FAAbsmanBundle:Action")->getFullUserActions($user, 0, 250);
                    $userRequests = Array(); //$em->getRepository("FAAbsmanBundle:UGroupAdmin")->getAdmins($user, 0, 250, "" ); todo

                    $backup = new DeletedItems();
                    $em->persist($backup);

                    $backup->setEntityName("User " . $user->getDisplayName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "user" => $userArray,
                            "requests" => $userRequests,
                            "entitlements" => $userEntitlements,
                            "history" => $userHistory
                        )));

                    //todo get rid of updateitems call backs
                    $groupIds = array_map( function ($group) {
                        return  $group->getId();
                    }, $user->getUGroups());

                    //todo remove user requests

                    $userEntitlements = $user->getUserEntitlements();
                    foreach ($userEntitlements as $userEntitlement) {

                        $user->removeUserEntitlement($userEntitlement);
                        $em->remove($userEntitlement);
                    }

                    $em->remove($user);
                    $em->flush();

                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('use-' . $id);

                    $response = array(
                        "success" => true,
                        "updateitems" => array("mem", "gro", $groupIds),
                        "mess" => "User record has been deleted."
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
        $oodSubForms = Array();
        $lastupdate = $request->get('lastupdate');
        $loadedSubForms = (array) json_decode($request->get("subforms"));
        $user = $em->getRepository('FAAbsmanBundle:User')->find($id);

        if (null === $user) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $id . " does not exist."
            );

        } else {

            foreach ($loadedSubForms as $formType => $oldestTimeStamp) {

                if (is_array($oldestTimeStamp)) {

                    if ($adminShared->subFormIsOutOfDate($em, $user, $formType, $oldestTimeStamp[0], $oldestTimeStamp[1])) {

                        $oodSubForms[] = $formType;
                    }
                } else if ($adminShared->subFormIsOutOfDate($em, $user, $formType, $oldestTimeStamp)) {

                    $oodSubForms[] = $formType;
                }
            }

            $currentTimeStamp = $user->getLastUpdate()->getTimestamp();

            $response = array(
                "success" => true,
                "isoutdated" => $currentTimeStamp != $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($user),
                "oodSubForms" => $oodSubForms
            );
        }

        return new JsonResponse($response);
    }


    private function isDeletable($user)
    {

        //TODO
        return true;
    }


    public function searchAction($searchText, Request $request) {

        $sort = array();
        $filters = array();

        $sortstring = $request->get("sort");
        if ($sortstring) {
            $sort = json_decode($sortstring, true);
        }
        $filterString = $request->get("filter");
        if ($filterString) {
            $filters =json_decode($filterString, true);
        }

        $userRepository = $this->getDoctrine()->getManager()->getRepository("FAAbsmanBundle:user");
        $users = $userRepository->searchUsers($searchText, $request->get("start"), $request->get("limit"), $sort, $filters);
        $usersCount = $userRepository->searchUsersCount($searchText, $filters);

        return new JsonResponse(array(
            "success" => true,
            "total" => $usersCount,
            "data" => $users
        ));
    }


    public function getProfileAction($id) {

        $user = $this->getDoctrine()->getManager()->getRepository("FAAbsmanBundle:user")->find($id);

        return new JsonResponse(array(
            "success" => true,
            "data" => $user
        ));
    }


    public function getUserPreferencesAction ($userId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository('FAAbsmanBundle:User')->find($userId);


        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $userId . " does not exist."
            ));
        }

        $userPreferencesRaw = $em->getRepository('FAAbsmanBundle:UserPreference')->findBy(array("user" => $user));
        $userPreferences = array();
        foreach ($userPreferencesRaw as $userPreference) {
            switch ($userPreference->getPreference()->getType()) {
                case "boolean":
                    $value =  $userPreference->getPreferenceValue() === "true" ;
                    break;

                default:
                    $value= $userPreference->getPreferenceValue();
                    break;

            }
            $userPreferences[] = array(
                "id"=>$userPreference->getId(),
                "name"=>$userPreference->getPreference()->getName() ,
                "value" => $value
            );
        }


        return new JsonResponse(array(
            "success" => true,
            "data" => $userPreferences
        ));

    }



    public function setUserPreferenceAction ($userId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository('FAAbsmanBundle:User')->find($userId);


        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $userId . " does not exist."
            ));
        }

        if ("POST" == $request->getMethod()) {

            $content = $this->get("request")->getContent();

            if (empty($content)) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NO_FORM_DATA",
                    "mess" => "No data."
                ));
            }

            $params = json_decode($content, true);

            $preferenceName = $params["name"];
            $preferenceValue = $params["value"];

        } else {

            $preference = $request->get("preference");
            $value = $request->get("value");

            if (empty($preference) || empty($value)) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NO_FORM_DATA",
                    "mess" => "No data." . $preference . " " . $value
                ));
            }

            $preferenceName = json_decode($preference);
            $preferenceValue = json_decode($value);

        }

        $preferenceModel= $em->getRepository('FAAbsmanBundle:Preference')->findOneBy(array("name"=>$preferenceName));

        if (null === $preferenceModel) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Preference %s does not exist!", $preferenceName)
            ));
        }

        $userPreference = $em->getRepository('FAAbsmanBundle:UserPreference')->findOneBy(array("user"=>$user,"preference"=>$preferenceModel));

        if (empty($userPreference)) {

            $userPreference = new UserPreference();
            $em->persist($userPreference);

            $userPreference
                ->setPreference($preferenceModel)
                ->setPreferenceValue($preferenceValue)
                ->setUser($user);

        } else {

            $userPreference
                ->setPreferenceValue($preferenceValue);
        }

        $em->flush();


        return new JsonResponse(array(
            "success" => true,
            "mess" => sprintf("Preference %s has been saved!",$preferenceName)
        ));

    }


    public function getMemberOfAction($id) {

        return $this->getMembers($id, true);
    }

    public function getNotMemberOfAction($id) {

        return $this->getMembers($id, false);
    }

    private function getMembers($id, $inGroup ) {

        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('FAAbsmanBundle:User')->find($id);

        if (null === $user) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $id . " does not exist."
            );

        } else {

            $groupList = array_map(function ($group) {
                return array(
                    $group->getId(),
                    $group->getGroupName(),
                    $group->getCompany()->getDefaultGroup() == $group,
                    $group->getLastUpdate()->getTimestamp(),
                    $group->getCompany()->getId()
                );
            }, $inGroup ? $em->getRepository('FAAbsmanBundle:UGroup')->getMemberOf($user) : $em->getRepository('FAAbsmanBundle:UGroup')->getNotMemberOf($user));

            $response = array(
                "success" => true,
                "data" => $groupList
            );
        }

        return new JsonResponse($response);
    }

    public function setMemberOfAction ($id, Request $request) {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $content = $request->getContent();

        if (empty($content)) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA"
            );

        } else {

            $params = json_decode($content, true);
            $user = $em->getRepository('FAAbsmanBundle:User')->find($id);

            if (null === $user) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "User id " . $id . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "user", $user);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the update operation have been denied."
                    );

                } else {

                    $added = $params['added'];
                    $removed = $params['removed'];

                    foreach ($added as $groupId) {

                        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($groupId);

                        $group->addUser($user)
                            ->setLastUpdate(new \DateTime());
                        $user->addUGroup($group);

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                        $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "ADDGROUPMEMBER", "User " . $user->getDisplayName() . " added to group " . $group->getGroupName(), $changeSet);

                        $entitlements = $group->getEntitledCategories();
                        foreach ($entitlements as $entitlement) {

                            $adminShared->addUserEntitlement($em, $user, $entitlement, $this->getUser());
                        }
                    }

                    foreach ($removed as $groupId) {

                        $group = $em->getRepository('FAAbsmanBundle:UGroup')->find($groupId);
                        $group->removeUser($user);
                        $group->setLastUpdate(new \DateTime());
                        $user->removeUGroup($group);

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                        $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "REMOVEGROUPMEMBER", "User " . $user->getDisplayName() . " removed from group " . $group->getGroupName(), $changeSet);

                        $entitlements = $group->getEntitledCategories();
                        foreach ($entitlements as $entitlement) {

                            $adminShared->removeUserEntitlement($em, $user, $group, $entitlement, $this->getUser());
                        }
                    }

                    $user->setLastUpdate(new \DateTime());
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "lastupdate" => $user->getLastUpdate()->getTimestamp(),
                        "mess" => "User has been added to group(s)."
                    );
                }
            }
        }

        return new JsonResponse($response);
    }
}