<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\DeletedItems;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class UserEntitlementController extends Controller
{


    public function getEntitlementsAction ($id) {

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

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "user", $user);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the read operation have been denied."
                );

            } else {

                $userEntitlements = $em->getRepository("FAAbsmanBundle:UserEntitlement")->findByUser($user);
                $entitlementsResult = array();

                foreach ($userEntitlements as $userEntitlement) {

                    $entitledCategory = $userEntitlement->getEntitledCategory();
                    $taken =  $em->getRepository("FAAbsmanBundle:RequestEntitledCategory")->getTaken($user,$entitledCategory);

                    $entitlementsResult[] = array(
                        "id" => $userEntitlement->getId(),
                        "categoryid" => $entitledCategory->getId(),
                        "name" => $entitledCategory->getCategoryName(),
                        "defaultvalue" => $entitledCategory->getDefaultValue(),
                        "allocated" => $userEntitlement->getAllocated(),
                        "taken" => $taken[0],
                        "left" => $userEntitlement->getLeft(),
                        "ondemanddefaultvalue" => $entitledCategory->getOnDemandDefaultValue(),
                        "ondemandallocated" => $userEntitlement->getOnDemandAllocated(),
                        "ondemandtaken" => $taken[1],
                        "ondemandleft" => $userEntitlement->getOnDemandLeft(),
                        "hidden" => $userEntitlement->getHidden(),
                        "lastupdate" => $userEntitlement->getLastUpdate()->getTimestamp(),
                        "categorylastupdate" => $entitledCategory->getLastUpdate()->getTimestamp(),
                        "validfrom" => date_format($entitledCategory->getValidFrom(), 'Y-m-d'),
                        "validto" => date_format($entitledCategory->getValidTo(), 'Y-m-d'),
                        "displayorder" => $entitledCategory->getDisplayOrder(),
                        "year" => date_format($entitledCategory->getValidFrom(), 'Y')
                    );
                }

                $response = array(
                    "success" => true,
                    "data" => $entitlementsResult
                );
            }
        }

        return new Response(json_encode($response));
    }


    public function getFormAction($id)
    {
        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $userEntitlement = $em->getRepository("FAAbsmanBundle:UserEntitlement")->find($id);

        if (null === $userEntitlement) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User Entitlement id " . $id . " does not exist."
            );

        } else {

            $user = $userEntitlement->getUser();
            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "user", $user);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the read operation have been denied."
                );

            } else {

                $company = $user->getCompany();
                $entitledCategory = $userEntitlement->getEntitledCategory();
                $taken =  $em->getRepository("FAAbsmanBundle:RequestEntitledCategory")->getTaken($user,$entitledCategory);

                $response = array(

                    "id" => $userEntitlement->getId(),
                    "userid" => $user->getId(),
                    "user" => $user->getDisplayName(),
                    "categoryid" => $entitledCategory->getId(),
                    "name" => $entitledCategory->getCategoryName(),
                    "text" => $entitledCategory->getCategoryText(),
                    "defaultvalue" => $entitledCategory->getDefaultValue(),
                    "allocated" => $userEntitlement->getAllocated(),
                    "taken" => $taken[0],
                    "left" => $userEntitlement->getLeft(),
                    "manageondemand" => $company->getManageOnDemand(),
                    "ondemanddefaultvalue" => $entitledCategory->getOnDemandDefaultValue(),
                    "ondemandallocated" => $userEntitlement->getOnDemandAllocated(),
                    "ondemandtaken" => $taken[1],
                    "ondemandleft" => $userEntitlement->getOnDemandLeft(),
                    "hidden" => $userEntitlement->getHidden(),
                    "absenceunit" => $company->getAbsenceUnit() == 0 ? "Days" : "Hours",
                    "lastupdate" => $userEntitlement->getLastUpdate()->getTimestamp(),
                    "validfrom" => date_format($entitledCategory->getValidFrom(), 'Y-m-d'),
                    "validto" => date_format($entitledCategory->getValidTo(), 'Y-m-d'),
                    "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "user", $user),
                    "isdeletable" => $this->isDeletable($userEntitlement),
                    "isfavorite" => $em->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(), "ued-" . $id)
                );
            }
        }

        return new Response(json_encode($response));
    }


    public function saveGridAction ($userId, $id, Request $request) {

        return $this->saveFormAction($id, $request);
    }


    public function saveFormAction ($id, Request $request) {

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

            $params = json_decode($content, true);
            $userEntitlement = $em->getRepository("FAAbsmanBundle:UserEntitlement")->find($id);

            if (null === $userEntitlement) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "User Entitlement id " . $id . " does not exist."
                );

            } else {

                $user = $userEntitlement->getUser();

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "user", $user);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the update operation have been denied."
                    );

                } else {

                    $entitledCategory = $userEntitlement->getEntitledCategory();

                    $userEntitlement
                        ->setAllocated($params["allocated"])
                        ->setLeft($params["left"])
                        ->setOnDemandAllocated($params["ondemandallocated"])
                        ->setOnDemandLeft($params["ondemandleft"])
                        ->setHidden($params["hidden"])
                        ->setLastUpdate(new \DateTime());

                    $uow = $em->getUnitOfWork();
                    $uow->computeChangeSets();
                    $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($userEntitlement));

                    $adminShared->addAction($em, $this->getUser(), "user", $user, "UPDATEUSERENTITLEMENT", "User Entitlement" . $entitledCategory->getCategoryName() . " Updated (" . count($changeSet) . ").", $changeSet);

                    $em->flush();

                    $response = array(
                        "success" => true,
                        "lastupdate" => $userEntitlement->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($userEntitlement),
                        "id" => $userEntitlement->getId(),
                        "mess" => "User Entitlement '" . $entitledCategory->getCategoryName() . "' has been updated."
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }

    public function deleteFormAction ($id) {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $userEntitlement= $em->getRepository("FAAbsmanBundle:UserEntitlement")->find($id);

        if (null === $userEntitlement) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User Entitlement id " . $id . " does not exist."
            );

        } else {

            $user = $userEntitlement->getUser();
            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(),"editor", "user", $user);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {


                if (!$this->isDeletable($userEntitlement)) {

                    $response = array(
                        "success" => false,
                        "reason" => "DELETE_FORBIDDEN",
                        "mess" => "User Entitlement id " . $id . " can't be deleted."
                    );

                } else {

                    $userEntitlementArray = $em->getRepository("FAAbsmanBundle:userEntitlement")->getArrayUserEntitlement($userEntitlement);
                    $entitlementHistory = $em->getRepository("FAAbsmanBundle:Action")->getFullUserEntitlementActions($userEntitlement, 0, 250);

                    $backup = new DeletedItems();
                    $em->persist($backup);
                    $backup->setEntityName("User Entitlement: " . $userEntitlement->getEntitledCategory()->getCategoryName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "userEntitlement" => $userEntitlementArray,
                            "history" => $entitlementHistory
                        )));

                    $uow = $em->getUnitOfWork();
                    $uow->computeChangeSets();
                    $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($userEntitlement));

                    $adminShared->addAction($em, $this->getUser(), "user", $user, "DELETEUSERENTITLEMENT", "User Entitlement " . $userEntitlement->getEntitledCategory()->getCategoryName() . " Deleted (" . count($changeSet) . ").", $changeSet);

                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('ued-' . $id);
                    $em->remove($userEntitlement);
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "User Entitlement has been deleted."
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    public function checkFormAction($id, Request $request) {

        $lastupdate = $request->get('lastupdate');
        $em = $this->getDoctrine()->getManager();
        $userEntitlement = $em->getRepository('FAAbsmanBundle:UserEntitlement')->find($id);

        if (null === $userEntitlement) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User Entitlement id " . $id . " does not exist."
            );

        } else {

            $currentTimeStamp = $userEntitlement->getLastUpdate()->getTimestamp();
            $response = array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($userEntitlement)
            );
        }

        return new Response(json_encode($response));
    }


    private function isDeletable($userEntitlement) {

        //todo check requests and group membership
        return false;
    }


}