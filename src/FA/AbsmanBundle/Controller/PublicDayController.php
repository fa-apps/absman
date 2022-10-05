<?php

namespace FA\AbsmanBundle\Controller;

use FA\AbsmanBundle\Entity\PublicDay;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use FA\AbsmanBundle\Entity\DeletedItems;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

// TODO TODO check duplicate name before save

class PublicDayController extends Controller
{

    public function getFormAction($id)
    {

        $isNewRecord = substr($id,0,2) == "0-";
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');


        if ($isNewRecord) {

            $company = $em->getRepository("FAAbsmanBundle:Company")->find(substr($id,2));
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

                    $response = array(
                        "name" => "New Public Day",
                        "date" => date_format(new \DateTime(date("1-1-Y")), 'Y-m-d'),
                        "pdlength" => 0,
                        "id" => $id,
                        "companyid" => $company->getId(),
                        "lastupdate" => "0",
                        "isdeletable" => false,
                        "isfavorite" => false
                    );
                }
            }

        } else {

            $publicDay = $em->getRepository("FAAbsmanBundle:PublicDay")->find($id);

            if ( null === $publicDay ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Public Day id " . $id . " does not exist."
                );

            } else {

                $company = $publicDay->getCompany();
                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "company", $company);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the read operation have been denied."
                    );

                } else {

                    $response = array(
                        "name" => $publicDay->getPublicDayName(),
                        "date" => date_format($publicDay->getPublicDayDate(), 'Y-m-d'),
                        "pdlength" => $publicDay->getPublicDayLength(),
                        "id" => $id,
                        "companyid" => $company->getId(),
                        "lastupdate" => $publicDay->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($publicDay),
                        "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company),
                        "isfavorite" => $this->isFavorite($publicDay->getId())
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

                        $publicDay = new PublicDay();
                        $em->persist($publicDay);

                        $publicDay->setCompany($company)
                            ->setPublicDayName($params['name'])
                            ->setPublicDayDate(new \DateTime($params['date']))
                            ->setPublicDayLength($params['pdlength'])
                            ->setDisplayOrder(0)
                            ->setLastUpdate(new \DateTime());

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($publicDay));

                        $adminShared->addAction($em, $this->getUser(), "company", $company, "NEWPUBLICDAY", "Public Day Created with name " . $publicDay->getPublicDayName() . " (" . count($changeSet) . ").", $changeSet);

                        $response = array(
                            "success" => true,
                            "lastupdate" => $publicDay->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($publicDay),
                            "id" => $publicDay->getId(),
                            "companyid" => $company->getId(),
                            "mess" => "Public Day '" . $publicDay->getPublicDayName() . "'has been created."
                        );
                    }
                }

            } else {

                $publicDay = $em->getRepository('FAAbsmanBundle:PublicDay')->find($id);

                if (null === $publicDay) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Public Day id " . $id . " does not exist."
                    );

                } else {

                    $company = $publicDay->getCompany();
                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the update operation have been denied."
                        );

                    } else {

                        $publicDay->setPublicDayName($params['name'])
                            ->setPublicDayDate(new \DateTime($params['date']))
                            ->setPublicDayLength($params['pdlength'])
                            ->setDisplayOrder(0)
                            ->setLastUpdate(new \DateTime());

                        $uow = $em->getUnitOfWork();
                        $uow->computeChangeSets();
                        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($publicDay));

                        $adminShared->addAction($em, $this->getUser(), "company", $company, "UPDATEPUBLICDAY", "Public Day Update " . $publicDay->getPublicDayName() . " (" . count($changeSet) . ").", $changeSet);

                        $response = array(
                            "success" => true,
                            "lastupdate" => $publicDay->getLastUpdate()->getTimestamp(),
                            "isdeletable" => $this->isDeletable($publicDay),
                            "id" => $publicDay->getId(),
                            "companyid" => $company->getId(),
                            "mess" => "Public Day '" . $publicDay->getPublicDayName() . "'has been updated."
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

        $publicDay = $em->getRepository('FAAbsmanBundle:PublicDay')->find($id);


        if (null === $publicDay) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Public Day id " . $id . " does not exist."
            );

        } else {

            $company = $publicDay->getCompany();
            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {

                if (!$this->isDeletable($publicDay)) {

                    $response = array(
                        "success" => false,
                        "reason" => "DELETE_FORBIDDEN",
                        "mess" => "Public Day id " . $id . " can't be deleted."
                    );

                } else {


                    $publicDayArray = $em->getRepository("FAAbsmanBundle:PublicDay")->getArrayPublicDay($publicDay);
                    $backup = new DeletedItems();
                    $em->persist($backup);

                    $backup->setEntityName("Public Day " . $publicDay->getPublicDayName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "entitled" => $publicDayArray
                        )));

                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('pub-' . $id);

                    $adminShared->addAction($em, $this->getUser(), "company", $company, "DELETEPUBLICDAY", "Public Day " . $publicDay->getPublicDayName() . " has been deleted.", NULL);

                    $em->remove($publicDay);
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "Public Day has been deleted.",
                        "updateitems" => array("pub", "com", $company->getId())
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
        $publicDay = $em->getRepository('FAAbsmanBundle:PublicDay')->find($id);

        if (null === $publicDay) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Public Day id " . $id . " does not exist."
            );

        } else {

            $currentTimeStamp = $publicDay->getLastUpdate()->getTimestamp();
            $response = json_encode(array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($publicDay)
            ));
        }

        return new Response(json_encode($response));
    }



    private function isFavorite($id)
    {
        $em = $this->getDoctrine()->getManager();
        return $favoriteExists = $em->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(),"ent-" . $id);

    }


    private function isDeletable($publicDay)
    {

        $em = $this->getDoctrine()->getManager();

        //TODO
        return true;
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

                $publicDays = $em->getRepository('FAAbsmanBundle:PublicDay')->findByCompany($id);
                $publicDayList = array();

                foreach ($publicDays as $publicDay) {

                    $publicDayList[] = Array(
                        $publicDay->getId(),
                        $publicDay->getPublicDayName(),
                        date_format($publicDay->getPublicDayDate(), 'Y-m-d'),
                        $publicDay->getPublicDayLength(),
                        $publicDay->getDisplayOrder(),
                        date_format($publicDay->getPublicDayDate(), 'Y'),
                        $publicDay->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $publicDayList
                );
            }
        }

        return new Response(json_encode($response));
    }


    public function saveCompanyListAction($targetId,$id, Request $request) {

        return $this->saveFormAction($id, $request);
    }




    private function isGroupRemovable($publicDay, $group)
    {

        //TODO search if any user in that group has already used the public day in a request
        //TODO and that the public day is not in any other user's group

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

                $publicDayRecords = $forAllocated ? $group->getPublicDays() : $em->getRepository('FAAbsmanBundle:PublicDay')->getGroupUnallocated($group);
                $publicDayList = array();

                foreach ($publicDayRecords as $publicDay) {
                    $publicDayList[] = Array(
                        $publicDay->getId(),
                        $publicDay->getPublicDayName(),
                        date_format($publicDay->getPublicDayDate(), 'Y-m-d'),
                        $publicDay->getDisplayOrder(),
                        $this->isGroupRemovable($publicDay, $group),
                        date_format($publicDay->getPublicDayDate(), 'Y'),
                        $publicDay->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $publicDayList
                );
            }
        }

        return new Response(json_encode($response));
    }

    public function saveGroupAllocatedAction($id, Request $request) {

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
                    $publicDayRepository = $em->getRepository('FAAbsmanBundle:PublicDay');


                    foreach ($params["added"] as $publicDayId) {

                        $publicDay = $publicDayRepository->find($publicDayId);

                        if (null !== $publicDay) {

                            $group->addPublicDay($publicDay);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "ADDPUBLICDAY", "Public Day with name " . $publicDay->getPublicDayName() . "added to group (" . count($changeSet) . ").", $changeSet);
                        }
                    }

                    foreach ($params["removed"] as $publicDayId) {

                        $publicDay = $publicDayRepository->find($publicDayId);

                        if (null !== $publicDay && $this->isGroupRemovable($publicDay, $group)) {

                            $group->removePublicDay($publicDay);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($group));

                            $adminShared->addAction($em, $this->getUser(), "ugroup", $group, "REMOVEPUBLICDAY", "Public Day with name " . $publicDay->getPublicDayName() . "removed from group (" . count($changeSet) . ").", $changeSet);
                        }
                    }
                }

                $em->flush();
                $response = array(
                    "success" => true,
                    "mess" => "Public Days allocation for group '". $group->getGroupName() ."' has been updated."
                );
            }
        }

        return new Response(json_encode($response));
    }


    public function getUserPublicDayAction($id) {

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

                $userPublicDay = $em->getRepository('FAAbsmanBundle:PublicDay')->getUserPublicDay($id);
                $publicDayList = array();

                foreach ($userPublicDay as $publicDay) {

                    $publicDayList[] = Array(
                        $publicDay->getId(),
                        $publicDay->getPublicDayName(),
                        date_format($publicDay->getPublicDayDate(), 'Y-m-d'),
                        $publicDay->getPublicDayLength(),
                        $publicDay->getDisplayOrder(),
                        date_format($publicDay->getPublicDayDate(), 'Y'),
                        $publicDay->getLastUpdate()->getTimestamp()
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $publicDayList
                );
            }
        }

        return new Response(json_encode($response));
    }
}