<?php

namespace FA\AbsmanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use FA\AbsmanBundle\Entity\User;



class DefaultController extends Controller
{

    public function indexAction($name = 'noText')
    {
        return $this->render('FAAbsmanBundle:Default:index.html.twig', array('name' => $name));
    }


    public function getFormAction($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        //user details

        $user = $this->getUser();
        $company =$this->getUser()->getCompany();

        $workflow = $user->getWorkflow();
        if (null === $workflow) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "WORKFLOW_NOT_FOUND",
                "mess" => "User record does not have workflow information."
            ));
        }

        $approver = $user->getApprover();
        if (null === $approver) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "APPROVER_NOT_FOUND",
                "mess" => "User record does not have approver information."
            ));
        }

        $standInApprover = $user->getStandInApprover();
        if (null === $standInApprover && $workflow->getRequireStandInApprover()) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "STAND_IN_APPROVER_NOT_FOUND",
                "mess" => "User record does not have stand-in approver information."
            ));
        }

        $substitute = $user->getSubstitute();
        if (null === $substitute && $workflow->getRequireSubstitute()) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "SUBSTITUTE_NOT_FOUND",
                "mess" => "User record does not have substitute information."
            ));
        }

        $notified = $user->getNotified();
        if (null === $notified && $workflow->getRequireNotified()) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOTIFIED_NOT_FOUND",
                "mess" => "User record does not have notified information."
            ));
        }


        // user entitlements

        $userEntitlements = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserEntitlements($user);
        $entitlementsResult = array();
        $entitledLeft=0;

        foreach ($userEntitlements as $userEntitlement) {

            $entitledCategoryId = $userEntitlement["categoryId"];
            $taken = $em->getRepository("FAAbsmanBundle:RequestEntitledCategory")->getTakenForCategory($user, $entitledCategoryId);

            $entitlementsResult[] = array(
                "id" => $userEntitlement["id"],
                "name" => $userEntitlement["name"],
                "allocated" => $userEntitlement["allocated"],
                "taken" => $taken[0],
                "left" => $userEntitlement["left"],
                "ondemandtaken" => $taken[1],
                "ondemandleft" => $userEntitlement["ondemandleft"],
                "validto" => date_format($userEntitlement["validTo"], 'Y-m-d'),
                "enforcevalidity" => $userEntitlement["enforceValidity"]
            );

            $entitledLeft += $userEntitlement["left"];
        }

        // user stats

        $stats = array();

        // hcalendar

        $hcalendar = $adminShared->setHCalendar($em, $this->getUser());

        // pending

        $pendingCount = $em->getRepository("FAAbsmanBundle:Request")->getPendingCounters($this->getUser());
        $totalPendingCount = $pendingCount["total"];
        $pendingText = sprintf("Action Required: There %s %s pending action%s!",$totalPendingCount > 1 ? "are" : "is",$totalPendingCount, $totalPendingCount > 1 ? "s":"");



        return new JsonResponse(array(
            "success" => true,
            "data" => array(
                "hcalendar" => $hcalendar,
                "entitlements" => $entitlementsResult,
                "absenceunit" => $user->getCompany()->getAbsenceUnit(),
                "manageondemand" => $user->getCompany()->getManageOnDemand(),
                "userid" => $user->getId(),
                "stats" => $stats,
                "lastupdate" => $user->getLastUpdate()->getTimestamp(),
                "email" => $user->getEmail(),
                "company" => $company->getCompanyName(),
                "country" => $company->getCountry()->getCountryName(),
                "usernumber" => $user->getUserNumber(),
                "displayname" => $user->getDisplayName(),
                "workflowid" => $workflow->getId(),
                "approver" => $approver->getDisplayName(),
                "approverid" => $approver->getId(),
                "requirestandinapprover" => $workflow->getRequireStandInApprover(),
                "standinapprover" => $standInApprover ? $standInApprover->getDisplayName() : "",
                "standinapproverid" => $standInApprover ? $standInApprover->getId() : "",
                "requiresubstitute" => $workflow->getRequireSubstitute(),
                "substitute" => $substitute ? $substitute->getDisplayName() : "",
                "substituteid" => $substitute ? $substitute->getId() : "",
                "requirenotified" => $workflow->getRequireNotified(),
                "notified" => $notified ? $notified->getDisplayName() : "",
                "notifiedid" => $notified ? $notified->getId() : "",
                "notes" => $user->getNotes(),
                "entitledLeft" => $entitledLeft,
                "pendingcount" => $totalPendingCount,
                "pendingtext"=> $pendingText
            )
        ));
    }


    public function checkFormAction($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $user = $em->getRepository("FAAbsmanBundle:User")->find($id);

        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("User id %s does not exist.", $id)
            ));
        }

        $lastUpdate = $request->get("formTimestamp");

        if (null === $lastUpdate) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "PARAM_MISSING",
                "mess" =>"Missing required parameter."
            ));
        }

        $lastUpdate = (int) $lastUpdate;

        $lastUserUpdate =$user->getLastUpdate();

        //$latest = new \DateTime($lastUserUpdate);

        return new JsonResponse(array(
            "success" => true,
            "data" => array(
                "outdated" => $lastUserUpdate->getTimestamp() > $lastUpdate,
                "lastPosted" => $lastUpdate,
                "lastFound" => $lastUserUpdate->getTimestamp()
            )
        ));

    }


    public function updateProfileAction ($id, Request $request) {


        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $userManager = $this->container->get('fos_user.user_manager');

        $user = $userManager->findUserBy(array('id' => $id));

        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("User id %s does not exist.", $id)
            ));
        }

        $content = $request->getContent();

        if ( empty($content) ) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        $params = json_decode($content, true);

        $workflow = $user->getWorkflow();

        if (null === $workflow) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "WORKFLOW_NOT_FOUND",
                "mess" => "User record does not have workflow information."
            ));
        }

        $substitute = $userManager->findUserBy(array('id' => $request->get("substitute")));
        $notified = $userManager->findUserBy(array('id' => $request->get("notified")));
        $notes = $request->get("notes");

        if (null === $substitute  && $workflow->getRequireSubstitute() ) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Substitute id %s does not exist.", $request->get("substitute"))
            ));
        }

        if ( null === $notified  && $workflow->getRequireNotified() ) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Notified id %s does not exist.", $request->get("notified"))
            ));
        }

        $user
            ->setNotes($notes)
            ->setSubstitute($substitute)
            ->setNotified($notified)
            ->setLastUpdate(new \DateTime());

        $userManager->updateUser($user, false);

        $uow = $em->getUnitOfWork();
        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($user));
        $adminShared->addAction($em, $this->getUser(), "user", $user, "UPDATEUSER", "User Home profile updated" . " (" . count($changeSet) . ").", $changeSet);

        $em->flush();

        return new JsonResponse(array(
            "success" => true,
            "lastUpdate"=>$user->getLastUpdate()->getTimestamp(),
            "mess"=>"Profile has been saved!"
        ));



    }
}
