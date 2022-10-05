<?php

namespace FA\AbsmanBundle\Controller;


use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FA\AbsmanBundle\Entity\User;
use FA\AbsmanBundle\Entity\Company;
use FA\AbsmanBundle\Entity\RequestEntitledCategory;
use FA\AbsmanBundle\Entity\RequestLeaveCategory;
use FA\AbsmanBundle\Entity\EMail;
use FA\AbsmanBundle\Entity\Request as AbsmanRequest;
use Symfony\Component\Validator\Constraints\DateTime;


class RequestController extends Controller
{

    public function getAbsenceFormAction($userId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $user = $em->getRepository("FAAbsmanBundle:User")->find($userId);
        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $userId . " does not exist."
            ));
        }

        $company = $user->getCompany();
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

        $targetUserWorkingDays = explode(",", $user->getWorkingDays());


        $response = array(
            "userid" => $userId,
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
            "absenceunit" => $company->getAbsenceUnit(),
            "minabsencelength" => $company->getMinRatio(),
            "manageondemand" => $company->getManageOnDemand(),
            "leavetime" => 0,
            "returntime" => 0,
            "lastupdate" => $user->getLastUpdate()->getTimestamp(),
            "workingDays" => $targetUserWorkingDays
        );


        $userEntitlements = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserEntitledCategory($user);
        $entitlementsResult = [];

        //todo hidden and valid from to


        $entitlementLastUpdate = new \DateTime('1920-01-01 0000');
        foreach ($userEntitlements as $userEntitlement) {

            $entitlementsResult[] = array(
                "id" => $userEntitlement["id"],
                "name" => $userEntitlement["name"],
                "left" => $userEntitlement["left"],
                "ondemandleft" => $userEntitlement["ondemandleft"],
                "useondemand" => false, //todo check why forced
                "take" => 0
            );
            $entitlementLastUpdate = $userEntitlement["lastUpdate"] > $entitlementLastUpdate ? $userEntitlement["lastUpdate"] : $entitlementLastUpdate;
        }

        $response["entitled"] = $entitlementsResult;
        $response["entitledlastupdate"] = $entitlementLastUpdate->getTimestamp();

        $userLeaves = $em->getRepository("FAAbsmanBundle:LeaveCategory")->getUserLeaveCategoryDetails($user);
        $otherResult = [];

        //todo hidden and valid from to


        $otherResult[] = array(
            "id" => "publicDaysId",
            "name" => "Public Days",
            "take" => 0,
            "justification" => "",
            "text" => "Automatically selected"
        );

        foreach ($userLeaves as $leave) {

            $otherResult[] = array(
                "id" => $leave["id"],
                "name" => $leave["name"],
                "maxvalue" => $leave["maxvalue"],
                "autoapprovable" => $leave["autoapprovable"],
                "justificationnotrequired" => $leave["justificationnotrequired"],
                "justification" => $leave["justificationnotrequired"] ? $leave["text"] : "",
                "text" => $leave["text"],
                "take" => 0
            );
        }

        $response["other"] = $otherResult;

        $dateRatio = $adminShared->getDateRatioFromCompany($company);

        $response["leavetimes"] = $dateRatio["leaveTime"];
        $response["returntimes"] = $dateRatio["returnTime"];

        $response["hcalendar"] = $adminShared->setHCalendar($em, $user);
        $response["context"] = $adminShared->getContext($user);;

        return new JsonResponse(array(
            "success" => true,
            "data" => $response
        ));
    }


    public function checkAbsenceFormAction($userId, Request $request)
    {


        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');


        $user = $em->getRepository("FAAbsmanBundle:User")->find($userId);
        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $userId . " does not exist."
            ));
        }

        //todo hidden and valid from to

        //todo review as long as user is now updated on each change on user props and requests

        $outdatedUser = false;
        $outdatedEntitled = false;
        $outdatedRequest = false;

        $postedUserTS = $request->get('userlastupdate');
        if ($postedUserTS) {

            $outdatedUser = ($user->getLastUpdate()->getTimestamp() != $postedUserTS);
        }

        $postedEntitledTS = $request->get('entitledlastupdate');
        if ($postedEntitledTS) {
            $entitlementLastUpdate = new \DateTime('@' . $postedEntitledTS);
            $userEntitlements = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserEntitledCategory($user);

            foreach ($userEntitlements as $userEntitlement) {

                if ($userEntitlement["lastUpdate"] > $entitlementLastUpdate) {
                    $entitlementLastUpdate = $userEntitlement["lastUpdate"];
                }
            }
            $outdatedEntitled = ($entitlementLastUpdate->getTimestamp() != $postedEntitledTS);
        }

        $postedRequestTS = $request->get('requestlastupdate');
        if ($postedRequestTS) {

            //todo check is 24bin
            $absRequestId = $request->get('absRequest');
            if (null === $absRequestId) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Request id " . $absRequestId . "is invalid."
                ));
            }

            $absRequest = $em->getRepository("FAAbsmanBundle:Request")->find($absRequestId);

            if (null === $absRequest) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Request id " . $absRequestId . " does not exist."
                ));
            }
            $outdatedRequest = ($absRequest->getLastUpdate()->getTimestamp() != $postedRequestTS);
        }


        $lastUpdate = $request->get("requestListLastUpdate");

        if (null === $lastUpdate) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "PARAM_MISSING",
                "mess" =>"Missing required parameter."
            ));
        }

        $lastUpdate = json_decode($lastUpdate);

        $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getUserRequestLastUpdate($user);

        $latest = new \DateTime($mostRecent);

        $outdatedRequestList = $lastUpdate != 0 ? $latest->getTimestamp() > $lastUpdate : false ;

        //var_dump($latest->getTimestamp(),$outdatedRequestList,$lastUpdate,$mostRecent);

        return new JsonResponse(array(
            "success" => true,
            "lastupdate" => $lastUpdate,
            "data" => array(
                "outdated" => $outdatedEntitled || $outdatedUser || $outdatedRequest || $outdatedRequestList
            )
        ));

    }


    private function _setHCalendar($em, $user)
    {

        $begin = new \DateTime();
        $beginInterval = \DateInterval::createFromDateString('-4 months');
        $begin = $begin->add($beginInterval)->modify('first day of this month');
        $end = new \DateTime();
        $endInterval = \DateInterval::createFromDateString('10 months');
        $end = $end->add($endInterval)->modify('last day of this month');

        $workingDays = explode(",", $user->getWorkingDays());

        $userPublicDays = $em->getRepository("FAAbsmanBundle:PublicDay")->getUserPublicDaysOnPeriod($user, $begin, $end);

        $publicDays = [];
        foreach ($userPublicDays as $userPublicDay) {
            $publicDays[] = array($userPublicDay["publicDayDate"]->format("Y-m-d"), $userPublicDay["name"], $userPublicDay["publicDayLength"]);
        }

        $rawRequests = $em->getRepository("FAAbsmanBundle:Request")->getValidUserRequestsOnPeriod($user, $begin, $end);
        $requests = array_map(function (&$item) {
            $item["startDate"] = $item["startDate"]->format("Y-m-d");
            $item["endDate"] = $item["endDate"]->format("Y-m-d");
            return ($item);
        }, $rawRequests);

        $hCalendar = array(
            "begin" => $begin->format("Y-m-d"),
            "end" => $end->format("Y-m-d"),
            "requests" => $requests,
            "workingDays" => $workingDays,
            "publicDays" => $publicDays
        );

        return $hCalendar;


    }


    public function checkSimpleRequestAction($userId, Request $request)
    {

        //TODO CHECK SUBSTITUTE NOT OFF FOR THE PERIOD
        //TODO CHECK IF NOT ALREADY SUBSTITUTE FOR THE PERIOD
        //TODO CHECK APPROVER ABLE TO APPROVE IF CURRENTLY OFF?

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $requestIsValid = true;
        $requestValidationMessages = [];
        $begin = new \DateTime($request->get('leavedate'));
        $end = new \DateTime($request->get('returndate'));


        $targetUser = $em->getRepository("FAAbsmanBundle:User")->find($userId);

        if (null == $targetUser) {

            $response = array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Target user for the new request can't be found!"
            );

            return new JsonResponse($response);

        }

        $isOverlapping = $em->getRepository("FAAbsmanBundle:Request")->isOverlapping($targetUser, $begin, $end);

        if ($isOverlapping) {

            $response = array(
                "success" => false,
                "reason" => "REQUEST_OVERLAP",
                "mess" => "New request is overlapping on an existing request!"
            );

            return new JsonResponse($response);

        }

        // compute days

        $targetUserWorkingDays = explode(",", $targetUser->getWorkingDays());

        $endInterval = new \DateTime($request->get('returndate'));
        $interval = \DateInterval::createFromDateString('1 day');
        $period = new \DatePeriod($begin, $interval, $endInterval->modify('+1 day'));
        $totalCount = 0;

        foreach ($period as $dt) {

            $totalCount += (float)$targetUserWorkingDays[$dt->format("w")] / 100;
        }

        $context = $adminShared->getContext($targetUser);

        if ($context["unit"] == 1) {

            $totalCount = $totalCount * $context["hpd"];

        }

        // validate used absence types

        $publicDays = $em->getRepository("FAAbsmanBundle:PublicDay")->getUserPublicDaysOnPeriod($targetUser, $begin, $end);

        $publicDaysCount = 0;
        foreach ($publicDays as $publicDay) {

            $publicDaysCount += $publicDay["publicDayLength"] == 0 ? 1 : 0.5;
        }

        if ($context["unit"] == 1) {
            $publicDaysCount *= $context["hpd"];
        }

        $totalEntitled = $totalCount  - $publicDaysCount;

        $entitledCategories = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserEntitledCategoryDetailsByExpiration($targetUser);

        $usableUserEntitlements = [];
        $postedCategoryFound = false;
        $postedCategory = $request->get('category');


        foreach ($entitledCategories as $entitledCategory) {

            $validFrom = $entitledCategory["validFrom"];
            $validTo = $entitledCategory["validTo"];

            if ($entitledCategory["left"] >= $totalEntitled && !(($begin > $validTo || $begin < $validFrom || $end > $validTo || $end < $validFrom) && $entitledCategory["enforceValidity"])) {

                $usableUserEntitlements[] = $entitledCategory;
                if ($entitledCategory["id"] == $postedCategory)  $postedCategoryFound = true;
            }
        }



        //var_dump($postedCategory);

        $suggestedCategory = count($usableUserEntitlements) ? $usableUserEntitlements[0]["id"] : null;

        $response = array(
            "success" => true,
            "data" => array(
                "totalCount" => $totalCount,
                "totalEntitledDays" => $totalEntitled,
                "publicDays" => $publicDays,
                "publicDaysCount" => $publicDaysCount,
                "usableCategories" => $usableUserEntitlements,
                "suggestedCategory" => $postedCategoryFound ? ($postedCategory ? $postedCategory : $suggestedCategory) : $suggestedCategory
            )
        );

        return new JsonResponse($response);


    }


    public function checkRequestAction($userId, Request $request)
    {

        //TODO CHECK SUBSTITUTE NOT OFF FOR THE PERIOD
        //TODO CHECK IF NOT ALREADY SUBSTITUTE FOR THE PERIOD
        //TODO CHECK APPROVER ABLE TO APPROVE IF CURRENTLY OFF?

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $requestIsValid = true;
        $requestValidationMessages = [];
        $begin = new \DateTime($request->get('leavedate'));
        $end = new \DateTime($request->get('returndate'));


        $targetUser = $em->getRepository("FAAbsmanBundle:User")->find($userId);

        if (null == $targetUser) {

            $response = array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Target user for the new request can't be found!"
            );

            return new JsonResponse($response);

        }

        $isOverlapping = $em->getRepository("FAAbsmanBundle:Request")->isOverlapping($targetUser, $begin, $end);

        if ($isOverlapping) {

            $response = array(
                "success" => false,
                "reason" => "REQUEST_OVERLAP",
                "mess" => "New request is overlapping on an existing request!"
            );

            return new JsonResponse($response);

        }

        // compute days

        $targetUserWorkingDays = explode(",", $targetUser->getWorkingDays());

        $endInterval = new \DateTime($request->get('returndate'));
        $interval = \DateInterval::createFromDateString('1 day');
        $period = new \DatePeriod($begin, $interval, $endInterval->modify('+1 day'));
        $totalCount = 0;

        foreach ($period as $dt) {

            $totalCount += (float)$targetUserWorkingDays[$dt->format("w")] / 100;
        }

        $context = $adminShared->getContext($targetUser);

        $leaveTime = (float)$request->get('leavetime');
        $returnTime = (float)$request->get('returntime');


        if ($context["unit"] == 1) {

            $totalCount = $totalCount * $context["hpd"];
            $totalCount -= $leaveTime != 0 ? $context["hpd"] - $leaveTime : 0;
            $totalCount -= $returnTime != 0 ? $context["hpd"] - $returnTime : 0;

        } else {

            $totalCount -= $leaveTime != 0 ? 1 - $leaveTime : 0;
            $totalCount -= $returnTime != 0 ? 1 - $returnTime : 0;
        }


        // validate used absence types

        $otherCategoriesRequested = json_decode($request->get('others'));
        $otherCategories = $em->getRepository("FAAbsmanBundle:LeaveCategory")->getUserLeaveCategoryDetails($targetUser);
        $isPublicDaysRequested = in_array("publicDaysId", array_column($otherCategoriesRequested, 0));
        $publicDays = $em->getRepository("FAAbsmanBundle:PublicDay")->getUserPublicDaysOnPeriod($targetUser, $begin, $end);

        $publicDayCount = 0;
        foreach ($publicDays as $publicDay) {

            $publicDayCount += $publicDay["publicDayLength"] == 0 ? 1 : 0.5;
        }

        if ($context["unit"] == 1) {
            $publicDayCount *= $context["hpd"];
        }

        $otherCount = 0;
        foreach ($otherCategories as $otherCategory) {


            foreach ($otherCategoriesRequested as $otherCategoryRequested) {

                if ($otherCategoryRequested[0] == $otherCategory["id"]) {

                    $otherCount += $otherCategoryRequested[1];

                    if (trim($otherCategoryRequested[2]) == "" && $otherCategoryRequested[1] > 0 && !$otherCategory["autoapprovable"]) {

                        $requestIsValid = false;
                        $requestValidationMessages[] = "Please provide justification for leave category " . $otherCategory["name"];
                    }

                    if ($otherCategory["autoapprovable"]) {

                        $maxAllowedCategories = $isPublicDaysRequested ? 2 : 1;

                        if ((count($otherCategoriesRequested) > $maxAllowedCategories) || count(json_decode($request->get('entitleds')))) {

                            $requestIsValid = false;
                            $requestValidationMessages[] = "Leave category " . $otherCategory["name"] . " should be used exclusively in a request";
                        }
                    }

                    if ($otherCategoryRequested[1] > $otherCategory["maxvalue"] && $otherCategory["maxvalue"] != 0) {

                        $requestIsValid = false;
                        $requestValidationMessages[] = "Leave category " . $otherCategory["name"] . " maximum allowed is: " . $otherCategory["maxvalue"];
                    }
                }
            }
        }

        $entitledCategories = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserEntitledCategoryDetails($targetUser);
        $entitledCategoriesRequested = json_decode($request->get('entitleds'));
        $unusableUserEntitlementIds = [];
        $entitledCount = 0;

        foreach ($entitledCategories as $entitledCategory) {

            $validFrom = $entitledCategory["validFrom"];
            $validTo = $entitledCategory["validTo"];

            if (($begin > $validTo || $begin < $validFrom || $end > $validTo || $end < $validFrom) && $entitledCategory["enforceValidity"]) {

                $unusableUserEntitlementIds[] = $entitledCategory["id"];
            }

            foreach ($entitledCategoriesRequested as $entitledCategoryRequested) {

                if ($entitledCategoryRequested[0] == $entitledCategory["id"]) {

                    $entitledCount += $entitledCategoryRequested[1];

                    if ($entitledCategoryRequested[2] && $otherCount > 0) {

                        $requestIsValid = false;
                        $requestValidationMessages[] = "Entitled category On Demand " . $entitledCategory["name"] . " needs to be taken exclusively";
                    }
                }
            }
        }

        $otherCount += $publicDayCount;


        if ($totalCount != $entitledCount + $otherCount || $totalCount == $publicDayCount || $totalCount == 0) $requestIsValid = false;

        $response = array(
            "success" => true,
            "data" => array(
                "totalCount" => $totalCount,
                "entitledCount" => $entitledCount,
                "otherCount" => $otherCount,
                "publicDayCount" => $publicDayCount,
                "publicDays" => $publicDays,
                "unusableCategories" => $unusableUserEntitlementIds,
                "requestIsValid" => $requestIsValid,
                "requestValidationMessages" => $requestValidationMessages
            )
        );

        return new JsonResponse($response);

    }


    public function submitRequestAction($userId, Request $request)
    {

        //TODO Check role can request ??

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $targetUser = $em->getRepository("FAAbsmanBundle:User")->find($userId);
        $requestedBy = $this->getUser();
        $approver = $em->getRepository("FAAbsmanBundle:User")->find($request->get('approverid'));
        $standInApprover = $em->getRepository("FAAbsmanBundle:User")->find($request->get('standinapproverid'));
        $substitute = $em->getRepository("FAAbsmanBundle:User")->find($request->get('substituteid'));
        $notified = $em->getRepository("FAAbsmanBundle:User")->find($request->get('notifiedid'));

        $workflow = $targetUser->getWorkflow();

        //test workflow users

        if (null == $request->get('leavedate')){

            return new JsonResponse(array(
                "success" => false,
                "reason" => "INVALID_DATE",
                "mess" => "Invalid Start Date!"
            ));
        }

        $begin = new \DateTime($request->get('leavedate'));


        if (null == $request->get('returndate')){

            return new JsonResponse(array(
                "success" => false,
                "reason" => "INVALID_DATE",
                "mess" => "Invalid End Date!"
            ));
        }

        $end = new \DateTime($request->get('returndate'));


        if (null == $requestedBy) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Requester for the new request can't be found!"
            ));
        }

        if (null == $targetUser) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Target user for the new request can't be found!"
            ));
        }

        if (null == $approver) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Approver for the new request can't be found!"
            ));
        }

        if ($workflow->getRequireStandInApprover() && null == $standInApprover) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Approver for the new request can't be found!"
            ));
        }

        if ($workflow->getRequireSubstitute() && null == $substitute) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Substitute for the new request can't be found!"
            ));
        }

        if ($workflow->getRequireNotified() && null == $notified) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "USER_NOT_FOUND",
                "mess" => "Notified for the new request can't be found!"
            ));
        }

        $requestStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("SUBMITTED");
        if (null == $requestStatus) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "REQUEST_STATUS_NOT_FOUND",
                "mess" => "Request Status Not Found."
            ));
        }

        $isOverlapping = $em->getRepository("FAAbsmanBundle:Request")->isOverlapping($targetUser, $begin, $end);

        if ($isOverlapping) {

            $response = array(
                "success" => false,
                "reason" => "REQUEST_OVERLAP",
                "mess" => "New request is overlapping on an existing request!"
            );

            return new JsonResponse($response);

        }


        $reqDate = new \DateTime();
        $newReq = new AbsmanRequest();
        $em->persist($newReq);

        $newReq
            ->setRequestDate($reqDate)
            ->setLastUpdate($reqDate)
            ->setStartDate($begin)
            ->setEndDate($end)
            ->setStartDateRatio($request->get('leavetime'))
            ->setEndDateRatio($request->get('returntime'))
            ->setTotalRequest($request->get('totalrequest'))
            ->setRequestStatus($requestStatus)
            ->setRequestText($request->get('comments'))
            ->setWorkflow($workflow)
            ->setUser($targetUser)
            ->setRequestedBy($requestedBy)
            ->setApprover($approver)
            ->setStandInApprover($standInApprover)
            ->setSubstitute($substitute)
            ->setNotified($notified)
            ->SetRequestContext(json_encode($adminShared->getContext($targetUser)));

        $targetUser
            ->setLastupdate($reqDate);


        foreach (json_decode($request->get("publicdaysids")) as $publicDayId) {

            $publicDay = $em->getRepository("FAAbsmanBundle:PublicDay")->findOneById($publicDayId);

            if (null == $publicDay) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "PUBLICDAY_NOT_FOUND",
                    "mess" => "Public Day Id " . $publicDayId . " does not exits."
                ));
            }

            $newReq->addPublicDay($publicDay);
        }


        $uow = $em->getUnitOfWork();
        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($newReq));
        $adminShared->addAction($em, $this->getUser(), "request", $newReq, "SUBMITREQUEST", "New absence request submitted.", $changeSet);

        $entitleds = json_decode($request->get('entitleds'), true);

        foreach ($entitleds as $entitled) {

            $newEntitledReq = new RequestEntitledCategory();
            $em->persist($newEntitledReq);
            $userEntitlement = $em->getRepository("FAAbsmanBundle:UserEntitlement")->find($entitled["categoryId"]);

            if (null === $userEntitlement) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => " Category id " . $entitled["categoryId"] . " does not exist."
                ));
            }

            $entitledCategory = $userEntitlement->getEntitledCategory();
            $taken = $entitled["periodQuantity"];

            $newEntitledReq->setStartDate(new \DateTime($entitled["periodStart"]))
                ->setStartDateRatio(100)
                ->setEndDate(new \DateTime($entitled["periodEnd"]))
                ->setEndDateRatio(100)
                ->setTaken($taken)
                ->setRequest($newReq)
                ->setEntitledCategory($entitledCategory);

            // update user entitlements  TODO same with ondemand...

            $left = $userEntitlement->getLeft() - $taken;

            if ($left < 0) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "LEFT_NOT_VALID",
                    "mess" => " Left value " . $left . " is not valid."
                ));
            }

            $userEntitlement->setLeft($left)
                ->setLastUpdate(new \DateTime());


            $uow->computeChangeSets();
            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($newEntitledReq));
            $changeSetUserEntitlement = $adminShared->parseChangeSet($uow->getEntityChangeSet($userEntitlement));

            $adminShared->addAction($em, $this->getUser(), "request", $newReq, "SUBMITREQUESTENTITLED", "New absence request submitted using entitled category).", Array("EntitledRequest" => $changeSet, "UserEntitlement" => $changeSetUserEntitlement))
                ->addAction($em, $this->getUser(), "user", $targetUser, "UPDATEUSERENTITLEMENT", "User entitlement update on request submitted.", $changeSetUserEntitlement);


        }

        $others = json_decode($request->get('others'), true);

        foreach ($others as $other) {

            $newLeaveReq = new RequestLeaveCategory();
            $em->persist($newLeaveReq);
            $category = $em->getRepository("FAAbsmanBundle:LeaveCategory")->find($other["categoryId"]);

            if (null === $category) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => " Category id " . $other["categoryId"] . " does not exist."
                ));
            }

            $newLeaveReq->setStartDate(new \DateTime($other["periodStart"]))
                ->setStartDateRatio(100)
                ->setEndDate(new \DateTime($other["periodEnd"]))
                ->setEndDateRatio(100)
                ->setTaken($other["periodQuantity"])
                ->setRequest($newReq)
                ->setLeaveCategory($category)
                ->setJustification($other["justification"]);

            $uow->computeChangeSets();
            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($newLeaveReq));
            $adminShared->addAction($em, $this->getUser(), "request", $newReq, "SUBMITREQUESTOTHER", "New absence request submitted  using other category(" . count($changeSet) . ").", $changeSet);


        }

        $em->flush();

        $this->routeRequest($em, $newReq, $requestStatus);

        $requestStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("PENDING_APPROVER");
        if (null == $requestStatus) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "REQUEST_STATUS_NOT_FOUND",
                "mess" => "Request Status Not Found."
            ));
        }

        $newReq->setRequestStatus($requestStatus);

        $em->flush();;

        $response = array(
            "success" => true,
            "data" => array("newRequestId" => $newReq->getId())
        );


        return new JsonResponse($response);

    }


    private function routeRequest($em, $absRequest, $requestStatus, $notifiedStatus = null)
    {


        $adminShared = $this->get('fa_absman.admin.shared');
        $currentStatus = $requestStatus->getRequestStatus();
        $notifiedStatus =  $notifiedStatus ? $notifiedStatus->getRequestStatus() : null;
        $workflow = $absRequest->getWorkflow();
        $emailsSent = Array();

        switch ($currentStatus) {

            case "SUBMITTED":

                //select approver

                $emailsSent[] = $adminShared->sendNotification("NEW_TO_APPROVE", $absRequest);

                if ($workflow->getRequireSubstitute()) {

                    $emailsSent[] = $adminShared->sendNotification("NEW_TO_CHECK", $absRequest);

                }
                if ($workflow->getRequireNotified()) {

                    $emailsSent[] = $adminShared->sendNotification("NEW_AS_INFO", $absRequest);

                }
                break;


            case "PENDING_APPROVER":

                switch ($notifiedStatus) {

                    case "ACCEPTED_SUBSTITUTE":

                        $emailsSent[] = $adminShared->sendNotification("ACK_TO_APPROVER", $absRequest);
                        $emailsSent[] = $adminShared->sendNotification("ACK_TO_USER", $absRequest);

                        if ($workflow->getRequireNotified()) {

                            $emailsSent[] = $adminShared->sendNotification("ACK_TO_NOTIFIED", $absRequest);

                        }

                        break;


                    case "REJECTED_SUBSTITUTE":

                        $emailsSent[] = $adminShared->sendNotification("NACK_TO_APPROVER", $absRequest);
                        $emailsSent[] = $adminShared->sendNotification("NACK_TO_USER", $absRequest);

                        if ($workflow->getRequireNotified()) {

                            $emailsSent[] = $adminShared->sendNotification("NACK_TO_NOTIFIED", $absRequest);

                        }
                        break;

                    default:

                        break;
                }

                break;

            case "APPROVED":

                $emailsSent[] = $adminShared->sendNotification("APPROVED_TO_REQUESTER", $absRequest);

                if ($workflow->getRequireSubstitute()) {

                    $emailsSent[] = $adminShared->sendNotification("APPROVED_TO_SUBSTITUTE", $absRequest);

                }
                if ($workflow->getRequireNotified()) {

                    $emailsSent[] = $adminShared->sendNotification("APPROVED_TO_NOTIFIED", $absRequest);

                }
                break;

            case "REJECTED":

                $emailsSent[] = $adminShared->sendNotification("REJECTED_TO_REQUESTER", $absRequest);

                if ($workflow->getRequireSubstitute()) {

                    $emailsSent[] = $adminShared->sendNotification("REJECTED_TO_SUBSTITUTE", $absRequest);

                }
                if ($workflow->getRequireNotified()) {

                    $emailsSent[] = $adminShared->sendNotification("REJECTED_TO_NOTIFIED", $absRequest);

                }


                break;


            case "CANCELED":

                $emailsSent[] = $adminShared->sendNotification("CANCELED_TO_APPROVER", $absRequest);

                if ($workflow->getRequireSubstitute()) {

                    $emailsSent[] = $adminShared->sendNotification("CANCELED_TO_SUBSTITUTE", $absRequest);

                }
                if ($workflow->getRequireNotified()) {

                    $emailsSent[] = $adminShared->sendNotification("CANCELED_TO_NOTIFIED", $absRequest);

                }
                break;





        }

        $system = $em->getRepository("FAAbsmanBundle:User")->findOneByUsername("System");

        foreach ($emailsSent as $emailSent) {

            $email = new EMail();
            $em->persist($email);

            $email
                ->setEmailDate(new \DateTime())
                ->setEmailTo($emailSent["to"])
                ->setEmailSubject($emailSent["subject"])
                ->setEmailBody($emailSent["body"]);

            $newEmailId = $email->getId();

            $details = array("emailId" => $newEmailId, "from" => $system->getDisplayName(), "to" => $emailSent["to"]->getDisplayName(), "subject" => $emailSent["subject"], "body" => $emailSent["body"]);

            $adminShared->addAction($em, $system, "request", $absRequest, "EMAILSENT", "Email Sent to " . $emailSent["to"]->getDisplayName(), $details);

        }

        return;

    }


    public function displayRequestAction($requestId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $absRequest = $em->getRepository("FAAbsmanBundle:Request")->find($requestId);

        if (null === $absRequest) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Request id %s does not exist.", $requestId)
            ));
        }

        $role = $this->getRoles($em, $this->getUser(), $absRequest);

        if (!$this->isGrantedFor($em, "form", $absRequest)) {
            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_AUTHORIZED",
                "mess" => "You are not authorized to view this request.",
                "role" => $role  //TODO remove for prod
            ));
        }

        $requestedBy = $absRequest->getRequestedBy() ? $absRequest->getRequestedBy()->getId() : null;
        $requestStatus = $absRequest->getRequestStatus();
        $workflow = $absRequest->getWorkflow();
        $approver = $absRequest->getApprover();
        $standInApprover = $absRequest->getStandInApprover();
        $substitute = $absRequest->getSubstitute();
        $notified = $absRequest->getNotified();
        $user = $absRequest->getUser();
        $requestContext = json_decode($absRequest->getRequestContext());

        $entitleds = $em->getRepository("FAAbsmanBundle:RequestEntitledCategory")->getRequestCategories($absRequest);
        $entitlementLastUpdate = new \DateTime();

        foreach ($entitleds as $userEntitlement) {
            $entitlementLastUpdate = $userEntitlement["entitledlastupdate"] > $entitlementLastUpdate ? $userEntitlement["lastUpdate"] : $entitlementLastUpdate;
        }

        $others = $em->getRepository("FAAbsmanBundle:RequestLeaveCategory")->getRequestCategories($absRequest);
        $publicDays = [];

        foreach ($absRequest->getPublicDays() as $publicDay) {
            $publicDays[] = array(
                "name" => $publicDay->getPublicDayName(),
                "date" => $publicDay->getPublicDayDate()->format("Y-m-d"),
                "length" => $publicDay->getPublicDayLength()
            );
        }

        $usedCategories = [];

        foreach ($entitleds as $userEntitlement) {
            $usedCategories[] = array(
                "name" => $userEntitlement["name"],
                "taken" => $userEntitlement["taken"],
                "justification" => $userEntitlement["ondemandtaken"] ? '($userEntitlement["ondemandtaken"]) On Demand': null,
            );

        }

        foreach ($others as $other) {
            $usedCategories[] = array(
                "name" => $other["name"],
                "taken" => $other["taken"],
                "justification" => $other["justification"],
            );

        }

        foreach ($absRequest->getPublicDays() as $publicDay) {
            $usedCategories[] = array(
                "name" => $publicDay->getPublicDayName(),
                "justification" => $publicDay->getPublicDayDate()->format("D j F Y"),
                "taken" => $publicDay->getPublicDayLength() === 0 ? 1 : 0.5
            );
        }

        return new JsonResponse(array(
            "success" => true,
            "data" => array(
                "requestdate"=> $absRequest->getRequestDate()->format("c"),
                "leavedate" => $absRequest->getStartDate()->format("Y-m-d"),
                "leavetime" => $absRequest->getStartDateRatio(),
                "returndate" => $absRequest->getEndDate()->format("Y-m-d"),
                "returntime" => $absRequest->getEndDateRatio(),
                "comments" => $absRequest->getRequestText(),
                "totalrequest" => $absRequest->getTotalRequest(),
                "statusid" => $requestStatus->getId(),
                "statustext" => $requestStatus->getRequestStatusText(),
                "status" => $requestStatus->getRequestStatus(),
                "workflowid" => $workflow->getId(),
                "approver" => $approver->getDisplayName(),
                "approverid" => $approver->getId(),
                "requirestandinapprover" => $workflow->getRequireStandInApprover(),
                "standinapprover" => $standInApprover ? $standInApprover->getDisplayName() : "",
                "standinapproverid" => $standInApprover ? $standInApprover->getId() : "",
                "approvalby"=>$absRequest->getApprovalBy() ? $absRequest->getApprovalBy()->getDisplayName() : "",
                "approvaltext"=>$absRequest->getApprovalText(),
                "canceltext"=>$absRequest->getCancelText(),
                "approvaldate"=>$absRequest->getApprovalDate() ? $absRequest->getApprovalDate()->format("c") : "",
                "requiresubstitute" => $workflow->getRequireSubstitute(),
                "substitute" => $substitute ? $substitute->getDisplayName() : "",
                "substituteid" => $substitute ? $substitute->getId() : "",
                "substituteack" => $absRequest->getSubstituteAck(),
                "substituteacktext" => $absRequest->getSubstituteAckText(),
                "substituteackdate" => $absRequest->getSubstituteAckDate() ? $absRequest->getSubstituteAckDate()->format("c") : "",
                "requirenotified" => $workflow->getRequireNotified(),
                "notified" => $notified ? $notified->getDisplayName() : "",
                "notifiedid" => $notified ? $notified->getId() : "",
                "userid" => $user->getId(),
                "username" => $user->getDisplayName(),
                "requestedbyid" => $requestedBy,
                "requestedby" => $absRequest->getRequestedBy()->getDisplayName(),
                "entitleds" => $this->isGrantedFor($em, "categoryDetails", $absRequest) ?  $entitleds : [],
                "others" => $this->isGrantedFor($em, "categoryDetails", $absRequest) ?  $others : [],
                "usedcategories" => $this->isGrantedFor($em, "categoryDetails", $absRequest) ? $usedCategories : [],
                "publicDays" => $publicDays,
                "dateRatio" => $adminShared->getDateRatioFromContext($requestContext->unit, $requestContext->min, $requestContext->hpd),
                "requestcontext" => $requestContext,
                "lastupdate" => $absRequest->getLastUpdate() ? $absRequest->getLastUpdate()->getTimestamp() : 0,
                "entitledlastupdate" => $entitlementLastUpdate->getTimestamp(),
                "hcalendar" => $this->isGrantedFor($em, "hcalendar", $absRequest) ? $adminShared->setHCalendar($em, $user) : $adminShared->setHCalendar($em, $this->getUser()),
                "history" => $this->getRequestHistory($absRequest, $em),
                "role" => $role,
                "roleActionText" => $this->getroleActionText($absRequest, $role, $em)
                )
            )
        );

    }


    public function getGCalendarAction( $groupId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $gCalendar = array();


        $group = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);

        if (null === $group) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("EGroup id %s does not exist.", $groupId)
            ));
        }

        $members = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $group), array("displayOrder" => "ASC"));

        foreach ($members as $member) {

            $user = $member->getEGroupMember();

            $gCalendar[] = array(
                "id" => $user->getId(),
                "name" => $user->getDisplayName(),
                "lastupdate" => $user->getLastUpdate()->getTimestamp(),
                "schedule" => $adminShared->setHCalendar($em, $user)
            );
        }

        return new JsonResponse($gCalendar);
    }


    public function requestListAction($listType, $userId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();

        if ('null' === $userId) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("User id %s does not exist.", $userId)
            ));
        }

        $targetUser = $em->getRepository("FAAbsmanBundle:User")->find($userId);

        if (null === $targetUser) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("User id %s does not exist.", $userId)
            ));
        }

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


        switch ($listType) {

            case "user":

                $requestList = $em->getRepository("FAAbsmanBundle:Request")->getUserRequestList($targetUser, $request->get("start"), $request->get("limit"), $sort, $filters);
                $requestListCount = $em->getRepository("FAAbsmanBundle:Request")->getUserRequestListCount($targetUser, $filters);
                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getUserRequestLastUpdate($targetUser);

                break;

            case "staff":
            case "pending":

                $requestList = $em->getRepository("FAAbsmanBundle:Request")->getStaffRequestList($targetUser, $request->get("start"), $request->get("limit"), $sort, $filters);
                $requestListCount = $em->getRepository("FAAbsmanBundle:Request")->getStaffRequestListCount($targetUser, $filters);
                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getStaffRequestLastUpdate($targetUser);

                break;

           case "standin-pending":

                $requestList = $em->getRepository("FAAbsmanBundle:Request")->getStandinRequestList($targetUser, $request->get("start"), $request->get("limit"), $sort, $filters);
                $requestListCount = $em->getRepository("FAAbsmanBundle:Request")->getStandinRequestListCount($targetUser, $filters);
                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getStandinRequestLastUpdate($targetUser);

                break;

           case "substitute-pending":

                $requestList = $em->getRepository("FAAbsmanBundle:Request")->getSubstituteRequestList($targetUser, $request->get("start"), $request->get("limit"), $sort, $filters);
                $requestListCount = $em->getRepository("FAAbsmanBundle:Request")->getSubstituteRequestListCount($targetUser, $filters);
                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getSubstituteRequestLastUpdate($targetUser);

                break;

           case "notified":

                $requestList = $em->getRepository("FAAbsmanBundle:Request")->getNotifiedRequestList($targetUser, $request->get("start"), $request->get("limit"), $sort, $filters);
                $requestListCount = $em->getRepository("FAAbsmanBundle:Request")->getNotifiedRequestListCount($targetUser, $filters);
                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getNotifiedRequestLastUpdate($targetUser);

                break;


            default:

                $requestList = [];
                $requestListCount = 0;
                $mostRecent = null;


        }

        foreach ($requestList as &$listItem) {

            $listItem["requestdate"] = $listItem["requestdate"]->format("c");
            $listItem["leavedate"] = $listItem["leavedate"]->format("Y-m-d");
            $listItem["returndate"] = $listItem["returndate"]->format("Y-m-d");
        }



        if ($mostRecent) {

            $d = new \DateTime($mostRecent);
            $latest = $d->getTimestamp();
        } else {

            $latest = 0;
        }


        return new JsonResponse(array(
            "success" => true,
            "total"=>$requestListCount,
            "data" => $requestList,
            "lastupdate" => $latest
        ));

    }


    public function checkRequestListAction($listType, $userId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $targetUser = $em->getRepository("FAAbsmanBundle:User")->find($userId);

        if (null === $targetUser) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("User id %s does not exist.", $userId)
            ));
        }

        $lastUpdate = $request->get("requestListLastUpdate");

        if (null === $lastUpdate) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "PARAM_MISSING",
                "mess" =>"Missing required parameter."
            ));
        }


        switch ($listType) {

            case "user":

                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getUserRequestLastUpdate($targetUser);

                break;

            case "staff":
            case "pending":

                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getStaffRequestLastUpdate($targetUser);

                break;

            case "standin-pending":

                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getStandinRequestLastUpdate($targetUser);

                break;

            case "substitute-pending":

                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getSubstituteRequestLastUpdate($targetUser);

                break;

            case "notified":

                $mostRecent = $em->getRepository("FAAbsmanBundle:Request")->getNotifiedRequestLastUpdate($targetUser);
                break;


            default:

                $mostRecent = null;

        }


        $lastUpdate = (int) $lastUpdate;

        if ($mostRecent) {

            $d = new \DateTime($mostRecent);
            $latest = $d->getTimestamp();
        } else {

            $latest = 0;
        }


        return new JsonResponse(array(
            "success" => true,
            "data" => array(
                "outdated" => $latest > $lastUpdate,
                "lastPosted" => $lastUpdate,
                "lastFound" => $latest
            )
        ));

    }


    private function isGrantedFor($em, $topic, $absRequest)
    {

        //TODO make this an object we may need to let notified or substitute able to see request private details

        $role = $this->getRoles($em, $this->getUser(), $absRequest);


        if ($topic == "history") {

            return $role["isApprover"] || $role["isRequestedFor"] || (!$role["isSubstitute"] && !$role["isNotified"]) || $role["isAbsProxy"] || $role["isAdmin"];

        } else if ($topic == "historyDetails") {

            return $role["isApprover"] || $role["isRequestedFor"] || (!$role["isSubstitute"] && !$role["isNotified"]) || $role["isAbsProxy"] || $role["isAdmin"];

       } else if ($topic == "categoryDetails") {

            return $role["isApprover"] || $role["isRequestedFor"] || (!$role["isSubstitute"] && !$role["isNotified"]) || $role["isAbsProxy"] || $role["isAdmin"];

        } else if ($topic == "hcalendar") {

            return $role["isApprover"] || $role["isRequestedFor"] || !$role["isNotified"] || $role["isAbsProxy"] || $role["isAdmin"];

        } else if ($topic == "form") {

            return $role["isRequestedFor"] || $role["isApprover"] || $role["isSubstitute"] || $role["isAdmin"] || $role["isAbsProxy"] || $role["isNotified"];

        } else if ($topic == "summaryDetails") {

            return $role["isApprover"] || $role["isRequestedFor"] || !$role["isSubstitute"] || !$role["isNotified"] || $role["isAbsProxy"] || $role["isAdmin"];

        }

        return false;

    }


    private function getRoles($em, $user, $absRequest)
    {

        $adminShared = $this->get('fa_absman.admin.shared');

        return array(
            "isApprover" => $absRequest->getApprover() === $user || $absRequest->getStandInApprover() === $user,
            "isRequestedFor" => $absRequest->getUser() === $user,
            "isSubstitute" => $absRequest->getSubstitute() === $user,
            "isNotified" => $absRequest->getNotified() === $user,
            "isAbsProxy" => $absRequest->getUser()->getAbsProxy() === $user,
            "isAdmin" => $adminShared->isAdminWithRoleForTarget($em, $user, "admin", "user", $absRequest->getUser())
        );
    }


    private function getRoleActionText ($absRequest, $role, $em) {

        $requestStatus = $absRequest->getRequestStatus()->getRequestStatus();
        $response = array();

        $actionTextForRole = array(
            "isApprover" => $requestStatus === "PENDING_APPROVER" ?  "Please choose action for this request." : "You have already actioned on this request.",
            "isRequestedFor" => $requestStatus !== "CANCELED" ? "You can still cancel this request." : "No action is required.",
            "isSubstitute" => $requestStatus === "PENDING_APPROVER" ? ($absRequest->getSubstituteAck() === null ? "Please acknowledge on your availability" : "You can still change your choice." ) : "No action is required.",
            "isNotified" => "No action is required.",
            "isAbsProxy" => $requestStatus !== "CANCELED" ? "You can still cancel this request." : "No action is required.",
            "isAdmin" => "As Administrator you may select any action available"
        );

        foreach ($role as $roleName => $value) {

            if ($value) $response[] = $actionTextForRole[$roleName];

        }

        return $response;


    }

    public function cancelRequestAction($requestId, Request $request)
    {

        // set canceled, adjust figures, notify, TODO check role can cancel


        $em = $this->getDoctrine()->getManager();
        $uow = $em->getUnitOfWork();
        $adminShared = $this->get('fa_absman.admin.shared');

        $absRequests = $em->getRepository("FAAbsmanBundle:Request")->getActive($requestId);

        if (count($absRequests) != 1) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Uncanceled Request id %s does not exist.", $requestId)
            ));
        }

        $absRequest = $absRequests[0];
        $interval = $absRequest->getStartDate()->diff( new \DateTime());
        $comments = $request->get('confirmComments');

        if ((int) $interval->format('%R%a') > 0 && strlen($comments) == 0) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "COMMENTS_REQUIRED",
                "mess" => "Comments are required"
            ));
        }


        $cancelStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("CANCELED");

        if (null == $cancelStatus) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "REQUEST_STATUS_NOT_FOUND",
                "mess" => "Request Status Not Found."
            ));
        }

        $targetUser = $absRequest->getUser();
        $cancelDate = new \DateTime();

        $absRequest
            ->setRequestStatus($cancelStatus)
            ->setIsCanceledOrRejected(1)
            ->setCancelDate($cancelDate)
            ->setLastupdate($cancelDate)
            ->setCancelText($comments);

        $targetUser
            ->setLastupdate($cancelDate);


        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($absRequest));
        $adminShared->addAction($em, $this->getUser(), "request", $absRequest, "CANCELREQUEST", "Absence request canceled", $changeSet);

        $this->restoreEntitlements($em, $absRequest, $targetUser, $uow, $adminShared);

        $this->routeRequest($em, $absRequest, $cancelStatus);

        $em->flush();;

        return new JsonResponse(array(
            "success" => true,
            "data" =>  "canceled " . $absRequest->getId(),
            "mess" => "Request has been canceled."
        ));

    }


    public function rejectRequestAction($requestId, Request $request)
    {

        // set canceled, adjust figures, notify, TODO check role can reject


        $em = $this->getDoctrine()->getManager();
        $uow = $em->getUnitOfWork();
        $adminShared = $this->get('fa_absman.admin.shared');

        $absRequests = $em->getRepository("FAAbsmanBundle:Request")->getActive($requestId);

        if (count($absRequests) != 1) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Active Request id %s does not exist.", $requestId)
            ));
        }

        $absRequest = $absRequests[0];
        $comments = $request->get('confirmComments');

        if (strlen($comments) == 0) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "COMMENTS_REQUIRED",
                "mess" => "Comments are required"
            ));
        }


        $rejectStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("REJECTED");

        if (null == $rejectStatus) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "REQUEST_STATUS_NOT_FOUND",
                "mess" => "Request Status Not Found."
            ));
        }

        $targetUser = $absRequest->getUser();
        $rejectDate = new \DateTime();

        $absRequest
            ->setRequestStatus($rejectStatus)
            ->setIsCanceledOrRejected(1)
            ->setApprovalDate($rejectDate)
            ->setApprovalBy($this->getUser())
            ->setLastupdate($rejectDate)
            ->setApprovalText($comments);

        $targetUser
            ->setLastupdate($rejectDate);

        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($absRequest));
        $adminShared->addAction($em, $this->getUser(), "request", $absRequest, "REJECTREQUEST", "Absence request disapproved", $changeSet);

        $this->restoreEntitlements($em, $absRequest, $targetUser, $uow, $adminShared);

        $this->routeRequest($em, $absRequest, $rejectStatus);

        $em->flush();;

        return new JsonResponse(array(
            "success" => true,
            "data" =>  "disapproved " . $absRequest->getId(),
            "mess" => "Request has been disapproved."
        ));

    }


    public function approveRequestAction($requestId, Request $request)
    {

        // set approved,  notify, TODO check role can approve


        $em = $this->getDoctrine()->getManager();
        $uow = $em->getUnitOfWork();
        $adminShared = $this->get('fa_absman.admin.shared');

        $absRequests = $em->getRepository("FAAbsmanBundle:Request")->getActivePending($requestId);

        if (count($absRequests) != 1) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Active Request id %s does not exist.", $requestId)
            ));
        }

        $absRequest = $absRequests[0];

        $approveStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("APPROVED");

        if (null == $approveStatus) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "REQUEST_STATUS_NOT_FOUND",
                "mess" => "Request Status Not Found."
            ));
        }

        $targetUser = $absRequest->getUser();
        $approveDate = new \DateTime();
        $comments = $request->get('confirmComments');


        $absRequest
            ->setRequestStatus($approveStatus)
            ->setApprovalDate($approveDate)
            ->setApprovalBy($this->getUser())
            ->setLastupdate($approveDate)
            ->setApprovalText($comments);

        $targetUser
            ->setLastupdate($approveDate);


        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($absRequest));
        $adminShared->addAction($em, $this->getUser(), "request", $absRequest, "APPROVEREQUEST", "Absence request approved", $changeSet);

        $this->routeRequest($em, $absRequest, $approveStatus);

        $em->flush();;

        return new JsonResponse(array(
            "success" => true,
            "data" =>  "approved " . $absRequest->getId(),
            "mess" => "Request has been approved."
        ));

    }


    public function ackRequestAction($requestId, Request $request)
    {

        // set approved,  notify, TODO check role can ack


        $em = $this->getDoctrine()->getManager();
        $uow = $em->getUnitOfWork();
        $adminShared = $this->get('fa_absman.admin.shared');

        $absRequests = $em->getRepository("FAAbsmanBundle:Request")->getActivePending($requestId);

        if (count($absRequests) != 1) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Active Request id %s does not exist.", $requestId)
            ));
        }

        $absRequest = $absRequests[0];


        $targetUser = $absRequest->getUser();
        $ackDate = new \DateTime();
        $comments = $request->get('confirmComments');


        $absRequest
            ->setSubstituteAck(true)
            ->setSubstituteAckDate($ackDate)
            ->setLastupdate($ackDate)
            ->setSubstituteAckText($comments);

        $targetUser
            ->setLastupdate($ackDate);


        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($absRequest));
        $adminShared->addAction($em, $this->getUser(), "request", $absRequest, "ACKREQUEST", "Absence request substitute acknowledgement", $changeSet);

        $ackStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("ACCEPTED_SUBSTITUTE");

        $this->routeRequest($em, $absRequest, $absRequest->getRequestStatus(), $ackStatus);

        $em->flush();;

        return new JsonResponse(array(
            "success" => true,
            "data" =>  "Acknowledged " . $absRequest->getId(),
            "mess" => "Request has been acknowledged."
        ));

    }


    public function nackRequestAction($requestId, Request $request)
    {

        // set approved,  notify, TODO check role can ack


        $em = $this->getDoctrine()->getManager();
        $uow = $em->getUnitOfWork();
        $adminShared = $this->get('fa_absman.admin.shared');

        $absRequests = $em->getRepository("FAAbsmanBundle:Request")->getActivePending($requestId);

        if (count($absRequests) != 1) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Active Request id %s does not exist.", $requestId)
            ));
        }

        $absRequest = $absRequests[0];


        $targetUser = $absRequest->getUser();
        $ackDate = new \DateTime();
        $comments = $request->get('confirmComments');


        $absRequest
            ->setSubstituteAck(false)
            ->setSubstituteAckDate($ackDate)
            ->setLastupdate($ackDate)
            ->setSubstituteAckText($comments);

        $targetUser
            ->setLastupdate($ackDate);


        $uow->computeChangeSets();
        $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($absRequest));
        $adminShared->addAction($em, $this->getUser(), "request", $absRequest, "NACKREQUEST", "Absence request substitute non acknowledgement", $changeSet);

        $ackStatus = $em->getRepository("FAAbsmanBundle:RequestStatus")->findOneByRequestStatus("REJECTED_SUBSTITUTE");

        $this->routeRequest($em, $absRequest, $absRequest->getRequestStatus(), $ackStatus);

        $em->flush();

        return new JsonResponse(array(
            "success" => true,
            "data" =>  "Not Acknowledged " . $absRequest->getId(),
            "mess" => "Request has been non acknowledged."
        ));

    }


    private function restoreEntitlements ($em, $absRequest, $targetUser, $uow, $adminShared) {

        $entitleds = $em->getRepository("FAAbsmanBundle:RequestEntitledCategory")->findByRequest($absRequest);

        foreach ($entitleds as $entitled) {

            $entitledCategory = $entitled->getEntitledCategory();
            $userEntitlement = $em->getRepository("FAAbsmanBundle:UserEntitlement")->getUserCategoryEntitlement($entitledCategory, $targetUser);

            if (null === $userEntitlement) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => sprintf(" Category id %s does not exist.", $entitled->getEntitledCategory()->getId())
                ));
            }

            $taken = $entitled->getTaken();
            $onDemandTaken = $entitled->getOnDemandTaken();

            $currentLeft = $userEntitlement->getLeft();
            $currentOnDemandLeft = $userEntitlement->getOnDemandLeft();

            $newLeft = $currentLeft + $taken;
            $newOnDemandLeft = $currentOnDemandLeft + $onDemandTaken;

            $entitled
                ->setIsCanceledOrRejected(1);

            $userEntitlement
                ->setLeft($newLeft)
                ->setOnDemandLeft($newOnDemandLeft)
                ->setLastUpdate(new \DateTime());


            $uow->computeChangeSets();
            $changeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($userEntitlement));
            $adminShared->addAction($em, $this->getUser(), "user", $targetUser, "UPDATEUSERENTITLEMENT", "User entitlement update on request disapproved or cancelled", $changeSet);

        }

    }


    private function getRequestHistory($absRequest, $em)
    {
        $history = array();

        if ( $this->isGrantedFor($em, "history", $absRequest) ) {

            $fullHistory = $em->getRepository("FAAbsmanBundle:Action")->getRequestActions($absRequest);


            $rootRequestActions = array("SUBMITREQUEST", "CANCELREQUEST", "REJECTREQUEST", "APPROVEREQUEST", "EMAILSENT", "ACKREQUEST", "NACKREQUEST");
            foreach ($fullHistory as $historyItem) {

                if (array_search($historyItem["actionType"], $rootRequestActions) !== false) {

                    $history[] = array(
                        "id" => $historyItem["id"],
                        "date" => $historyItem["date"]->format("c"),
                        "action" => $historyItem["actionType"],
                        "actionText" => $historyItem["actionTypeText"],
                        "actionBy" => $historyItem["actionBy"],
                        "text" => $historyItem["text"]
                    );
                }
            }
        }
        else {

            $history[] = array(
                "id" => "dummyId",
                "date" => $absRequest->getRequestDate()->format("c"),
                "action" => "dummyAction",
                "actionText" => "History details are not available",
                "actionBy" => "History details are not available",
                "text" => "History details are not available"
            );
        }


        return $history;


    }


    public function getHistoryDetailsAction($historyId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();

        $action = $em->getRepository("FAAbsmanBundle:Action")->find($historyId);
        if (null === $action) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("History id %s does not exist.", $historyId)
            ));
        }

        //todo hidden and valid from to


        //TODO check authorized to see such details

        switch ($request->get('actionType')) {

            case "EMAILSENT":

                $email = $action->getActionDetails();

                $result = sprintf("<p>From: %s<br>To: %s<br>Subject: %s</p>%s", $email["from"], $email["to"], $email["subject"], $email["body"]);

                break;

            case "SUBMITREQUEST":

                $absRequest = $action->getRequest()[0];

                if ($this->isGrantedFor($em, "historyDetails", $absRequest)) {

                    $submitHistory = $em->getRepository("FAAbsmanBundle:Action")->getRequestActions($absRequest);

                    $result = [];

                    // TODO ondemand

                    foreach ($submitHistory as $historyItem) {

                        //var_dump($historyItem["details"]);

                        if ($historyItem["actionType"] == "SUBMITREQUESTENTITLED") {

                            $entitledRequest = array_key_exists("EntitledRequest", $historyItem["details"]) ? $historyItem["details"]["EntitledRequest"] : null;
                            $userEntitlement = array_key_exists("UserEntitlement", $historyItem["details"]) ? $historyItem["details"]["UserEntitlement"] : null;

                            if ($entitledRequest && $userEntitlement) {
                                $result[] = sprintf("%s %s%s using %s from %s to %s, left is %d (was %d)",
                                    $entitledRequest["taken"][1],
                                    json_decode($absRequest->getRequestContext())->unit == 0 ? "day" : "hour",
                                    $entitledRequest["taken"][1] > 1 ? "s" : "",
                                    $entitledRequest["entitledCategory"][1],
                                    date_format(date_create($entitledRequest["startDate"][1]), "d M Y"),
                                    date_format(date_create($entitledRequest["endDate"][1]), "d M Y"),
                                    $userEntitlement["left"][1],
                                    $userEntitlement["left"][0]
                                );
                            }
                        } else if ($historyItem["actionType"] == "SUBMITREQUESTOTHER") {

                            $otherRequest = $historyItem["details"];
                            $result[] = sprintf("%s %s%s using %s from %s to %s",
                                $otherRequest["taken"][1],
                                json_decode($absRequest->getRequestContext())->unit == 0 ? "day" : "hour",
                                $otherRequest["taken"][1] > 1 ? "s" : "",
                                $otherRequest["leaveCategory"][1],
                                date_format(date_create($otherRequest["startDate"][1]), "d M Y"),
                                date_format(date_create($otherRequest["endDate"][1]), "d M Y")
                            );
                        }
                    }
                }

                break;

            case "CANCELREQUEST":

                $result = [];
                foreach ($action->getActionDetails() as $key => $value) {

                    switch ($key) {

                        case "cancelDate" :

                            $result[] = sprintf("Cancel Date (GMT): %s", date_format(new \DateTime($value[1]["date"]), "D j M Y H:i:s"));

                            break;

                        case "cancelText" :

                            $result[] = sprintf("Cancel comments : %s", $value[1]);

                            break;

                        case "requestStatus" :

                            $result[] = sprintf("Request Status : %s (was %s)", ucwords(str_replace("_", " ", strtolower($value[1]))), ucwords(str_replace("_", " ", strtolower($value[0]))));

                            break;

                    }
                }

                break;

            case "REJECTREQUEST":

                $result = [];
                foreach ($action->getActionDetails() as $key => $value) {

                    switch ($key) {

                        case "approvalDate" :

                            $result[] = sprintf("Reject Date (GMT): %s", date_format(new \DateTime($value[1]["date"]), "D j M Y H:i:s"));

                            break;

                        case "approvalText" :

                            $result[] = sprintf("Reject comments : %s", $value[1]);

                            break;

                        case "approvalBy" :

                            $result[] = sprintf("Rejected by : %s", $value[1]);

                            break;

                        case "requestStatus" :

                            $result[] = sprintf("Request Status : %s (was %s)", ucwords(str_replace("_", " ", strtolower($value[1]))), ucwords(str_replace("_", " ", strtolower($value[0]))));

                            break;

                    }
                }

                break;


            case "APPROVEREQUEST":

                $result = [];
                foreach ($action->getActionDetails() as $key => $value) {

                    switch ($key) {

                        case "approvalDate" :

                            $result[] = sprintf("Approval Date (GMT): %s", date_format(new \DateTime($value[1]["date"]), "D j M Y H:i:s"));

                            break;

                        case "approvalText" :

                            $result[] = sprintf("Approval comments : %s", $value[1]);

                            break;

                        case "approvalBy" :

                            $result[] = sprintf("Approved by : %s", $value[1]);

                            break;

                        case "requestStatus" :

                            $result[] = sprintf("Request Status : %s (was %s)", ucwords(str_replace("_", " ", strtolower($value[1]))), ucwords(str_replace("_", " ", strtolower($value[0]))));

                            break;

                    }
                }

                break;


            case "ACKREQUEST":



                $result = [];
                foreach ($action->getActionDetails() as $key => $value) {

                    switch ($key) {

                        case "substituteAckDate" :

                            $result[] = sprintf("Acknowledgement Date (GMT): %s", date_format(new \DateTime($value[1]["date"]), "D j M Y H:i:s"));

                            break;

                        case "substituteAckText" :

                            $result[] = sprintf("Acknowledgement comments : %s", $value[1]);

                            break;

                        case "substitute" :

                            $result[] = sprintf("Acknowledgement by : %s", $value[1]);

                            break;

                        case "requestStatus" :

                            $result[] = sprintf("Request Status : %s (was %s)", ucwords(str_replace("_", " ", strtolower($value[1]))), ucwords(str_replace("_", " ", strtolower($value[0]))));

                            break;

                    }
                }

                break;


            case "NACKREQUEST":

                $result = [];
                foreach ($action->getActionDetails() as $key => $value) {

                    switch ($key) {

                        case "substituteAckDate" :

                            $result[] = sprintf("Non Acknowledgement Date (GMT): %s", date_format(new \DateTime($value[1]["date"]), "D j M Y H:i:s"));

                            break;

                        case "substituteAckText" :

                            $result[] = sprintf("Non Acknowledgement comments : %s", $value[1]);

                            break;

                        case "substitute" :

                            $result[] = sprintf("Non Acknowledgement by : %s", $value[1]);

                            break;

                        case "requestStatus" :

                            $result[] = sprintf("Request Status : %s (was %s)", ucwords(str_replace("_", " ", strtolower($value[1]))), ucwords(str_replace("_", " ", strtolower($value[0]))));

                            break;

                    }
                }

                break;

            default:

                $result = $action->getActionDetails();

                break;

        }

        return new JsonResponse(array(
            "success" => true,
            "details" => $result
        ));

    }


    public function getPendingDetailsAction (Request $request)
    {

        $pendingCount = $this->getDoctrine()->getManager()->getRepository("FAAbsmanBundle:Request")->getPendingCounters($this->getUser());


        return new JsonResponse(array(
            "success" => true,
            "data" => array(
                array(
                    'total' => $pendingCount["total"],
                    'approver' => $pendingCount["approver"],
                    'standIn' => $pendingCount["standIn"],
                    'substitute' => $pendingCount["substitute"]
                )
            )
        ));

    }

}