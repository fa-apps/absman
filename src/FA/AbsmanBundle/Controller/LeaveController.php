<?php

namespace FA\AbsmanBundle\Controller;

use FA\AbsmanBundle\Entity\LeaveCategory;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use FA\AbsmanBundle\Entity\DeletedItems;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

// TODO TODO check duplicate name before save


class LeaveController extends Controller
{

    public function getFormAction($id)
    {

        $isNewRecord = substr($id,0,2) == "0-";
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        if ($isNewRecord) {

            $company=$em->getRepository("FAAbsmanBundle:Company")->find(substr($id,2));
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
                        "name" => "New Leave Category",
                        "text" => "",
                        "maxvalue" => 0,
                        "autoapprovable" => false,
                        "justificationnotrequired" => false,
                        "absenceunit" => $company->getAbsenceUnit() == 0 ? "days" : "hours",
                        "id" => $id,
                        "companyid" => $company->getId(),
                        "lastupdate" => "0",
                        "isdeletable" => false,
                        "isfavorite" => false
                    );
                }
            }
        }  else {

            $leave = $em->getRepository("FAAbsmanBundle:LeaveCategory")->find($id);
            if ( null === $leave ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Leave id " . $id . " does not exist."
                );

            } else {

                $company = $leave->getCompany();
                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "company", $company);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the read operation have been denied."
                    );

                } else {

                    $response = array(
                        "name" => $leave->getCategoryName(),
                        "text" => $leave->getCategoryText(),
                        "maxvalue" => $leave->getMaxDays(),
                        "autoapprovable" => $leave->getAutoApprovable(),
                        "justificationnotrequired" => $leave->getJustificationNotRequired(),
                        "absenceunit" => $company->getAbsenceUnit() == 0 ? "days" : "hours",
                        "minabsencelength" => $company->getAbsenceUnit() == 0 ? $company->getMinRatio() / 100 : $company->getMinRatio() / 1000,
                        "id" => $leave->getId(),
                        "companyid" => $company->getId(),
                        "lastupdate" => $leave->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($leave),
                        "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company),
                        "isfavorite" => $this->isFavorite($leave->getId())
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

                        $leave = new LeaveCategory();
                        $em->persist($leave);

                        $leave->setCompany($company)
                            ->setCategoryName($params['name'])
                            ->setCategoryText($params['text'])
                            ->setMaxDays($params['maxvalue'])
                            ->setAutoApprovable($params['autoapprovable'])
                            ->setJustificationNotRequired($params['justificationnotrequired'])
                            ->setDisplayOrder(0)
                            ->setLastUpdate(new \DateTime());

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($leave));

                        $adminShared->addAction($em, $this->getUser(), "company", $company, "NEWLEAVECATEGORY", "Leave Category Created with name " . $leave->getCategoryName() . " (" . count($changeSet) . ").", $changeSet);


                        $response = array(
                            "success" => true,
                            "lastupdate" => $leave->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($leave),
                            "id" => $leave->getId(),
                            "companyid" => $company->getId(),
                            "mess" => "Entitled Category '" . $leave->getCategoryName() . "'has been created."
                        );
                    }
                }
            } else {

                $leave = $em->getRepository('FAAbsmanBundle:LeaveCategory')->find($id);

                if (null === $leave) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Leave id " . $id . " does not exist."
                    );

                } else {

                    $company = $leave->getCompany();
                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the update operation have been denied."
                        );

                    } else {

                        $leave->setCategoryName($params['name'])
                            ->setCategoryText($params['text'])
                            ->setMaxDays($params['maxvalue'])
                            ->setAutoApprovable($params['autoapprovable'])
                            ->setJustificationNotRequired($params['justificationnotrequired'])
                            ->setDisplayOrder(0)
                            ->setLastUpdate(new \DateTime());

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($leave));

                        $adminShared->addAction($em, $this->getUser(), "company", $company, "UPDATELEAVECATEGORY", "Leave Category Update " . $leave->getCategoryName() . " (" . count($changeSet) . ").", $changeSet);

                        $response = array(
                            "success" => true,
                            "lastupdate" => $leave->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($leave),
                            "id" => $leave->getId(),
                            "companyid" => $company->getId(),
                            "mess" => "Leave Category '" . $leave->getCategoryName() . "' has been updated."
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

        $leave = $em->getRepository('FAAbsmanBundle:LeaveCategory')->find($id);

        if ( null === $leave ) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Leave id " . $id . " does not exist."
            );

        } else {

            $company = $leave->getCompany();
            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {

                if (!$this->isDeletable($leave)) {

                    $response = array(
                        "success" => false,
                        "reason" => "DELETE_FORBIDDEN",
                        "mess" => "Leave category id " . $id . " can't be deleted."
                    );

                } else {

                    $leaveArray = $em->getRepository("FAAbsmanBundle:LeaveCategory")->getArrayLeaveCategory($leave);

                    $backup = new DeletedItems();
                    $em->persist($backup);

                    $backup->setEntityName("Leave Category " . $leave->getCategoryName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "entitled" => $leaveArray
                        )));

                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('lea-' . $id);

                    $adminShared->addAction($em, $this->getUser(), "company", $company, "DELETELEAVECATEGORY", "Leave Category " . $leave->getCategoryName() . " has been deleted.", NULL);

                    $em->remove($leave);
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "Leave category has been deleted.",
                        "updateitems" => array("lea", "com", $company->getId())
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

        $leave = $em->getRepository('FAAbsmanBundle:LeaveCategory')->find($id);

        if (null === $leave) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Leave id " . $id . " does not exist."
            );

        } else {

            $currentTimeStamp = $leave->getLastUpdate()->getTimestamp();
            $response = array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($leave)
            );
        }

        return new Response(json_encode($response));
    }


    private function isDeletable($leave)
    {

        //TODO use requests

        return true;


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

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the read operation have been denied."
                );

            } else {

                $leaveRecords = $company->getLeaveCategories();
                $leaveList = array();

                foreach ($leaveRecords as $leave) {

                    $leaveList[] = Array(
                        $leave->getId(),
                        $leave->getCategoryName(),
                        $leave->getCategoryText(),
                        $leave->getMaxDays(),
                        $leave->getAutoApprovable(),
                        $leave->getJustificationNotRequired(),
                        $company->getAbsenceUnit() == 0 ? "days" : "hours",
                        $company->getAbsenceUnit() == 0 ? $company->getMinRatio() / 100 : $company->getMinRatio() / 1000,
                        $leave->getDisplayOrder(),
                        $leave->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $leaveList
                );
            }
        }

        return new Response(json_encode($response));
    }


    public function saveSortingAction($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $content = $request->getContent();

        if ( empty($content) ) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $company = $em->getRepository('FAAbsmanBundle:Company')->find($id);

            if ( null === $company ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Company id " . $id . " does not exist."
                );

            } else {

                $params = json_decode($content, true);

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the sort operation have been denied."
                    );

                } else {

                    $order = 1;
                    foreach ($params["ordering"] as $id) {
                        $entity = $em->getRepository('FAAbsmanBundle:' . ucfirst($params["category"]) . 'Category')->find($id);
                        $entity->setDisplayOrder($order++);
                    }
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "Leave categories ordering saved."
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    private function isGroupRemovable($leave, $group)
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


                $leaveRecords = $forAllocated ? $group->getLeaveCategories() : $em->getRepository('FAAbsmanBundle:LeaveCategory')->getGroupUnallocated($group);
                $leaveList = array();

                foreach ($leaveRecords as $leave) {

                    $leaveList[] = Array(
                        $leave->getId(),
                        $leave->getCategoryName(),
                        $leave->getCategoryText(),
                        $leave->getDisplayOrder(),
                        $this->isGroupRemovable($leave, $group),
                        $leave->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $leaveList
                );
            }
        }

        return new Response(json_encode($response));
    }



    public function saveGroupAllocatedAction($id, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $content = $request->getContent();

        if (empty($content)) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

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

                    $params = json_decode($content, true);
                    $leaveRepository = $em->getRepository('FAAbsmanBundle:LeaveCategory');

                    foreach ($params["added"] as $leaveId) {

                        $leave = $leaveRepository->find($leaveId);

                        if (null !== $leave) {

                            $group->addLeaveCategory($leave);
                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "ADDLEAVECATEGORY", "Leave category with name " . $leave->getCategoryName() . "added to group (" . count($changeSet) . ").", $changeSet);
                        }
                    }

                    foreach ($params["removed"] as $leaveId) {

                        $leave = $leaveRepository->find($leaveId);

                        if (null !== $leave && $this->isGroupRemovable($leave, $group)) {

                            $group->removeLeaveCategory($leave);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "REMOVELEAVECATEGORY", "Leave Category with name " . $leave->getCategoryName() . "removed from group (" . count($changeSet) . ").", $changeSet);

                        }
                    }

                    $em->flush();
                    $response = array(
                        "success" => true,
                        "mess" => "Leave categories allocation for group '". $group->getGroupName() ."' has been updated."
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    public function getUserLeaveAction ($id)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $user = $em->getRepository('FAAbsmanBundle:User')->find($id);

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

                $userLeave = $em->getRepository('FAAbsmanBundle:LeaveCategory')->getUserLeave($id);
                $leaveList = array();

                foreach ($userLeave as $leave) {

                    $leaveList[] = Array(
                        $leave->getId(),
                        $leave->getCategoryName(),
                        $leave->getCategoryText(),
                        $leave->getMaxDays(),
                        $leave->getAutoApprovable(),
                        $leave->getJustificationNotRequired(),
                        $leave->getDisplayOrder(),
                        $leave->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $leaveList
                );
            }
        }

        return new Response(json_encode($response));
    }
}