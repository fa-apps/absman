<?php

namespace FA\AbsmanBundle\Shared;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FA\AbsmanBundle\Entity\Actor;
use FA\AbsmanBundle\Entity\User;
use FA\AbsmanBundle\Entity\CountryAdmin;
use FA\AbsmanBundle\Entity\Country;

use FA\AbsmanBundle\Entity\Action;
use FA\AbsmanBundle\Entity\UserEntitlement;
use FA\AbsmanBundle\Entity\Request;



class AdminShared
{

    public function getFavoriteNode($id, $target, $name)
    {

        return array(
            "name" => $name,
            "leaf" => true,
            "id" => $target . "-fav",
            "iconCls" => "x-fa fa-heart-o",
            "editable" => true
        );

    }

    public function getCountryNode($id, $name, $isNew = false)
    {
        return array(
            "name" => $name,
            "leaf" => $isNew,
            "id" => "cou-" . $id,
            "iconCls" => $isNew ? "x-fa fa-plus-circle" : "x-fa fa-globe",
            "editable" => false
        );

    }

    public function getCompanyNode($id, $name, $isNew = false)
    {

        return array(
            "name" => $name,
            "leaf" => $isNew,
            "id" => "com-" . $id,
            "iconCls" => $isNew ? "x-fa fa-plus-circle" : "x-fa fa-institution",
            "editable" => false
        );

    }

    public function getGroupNode($id, $name, $isNew = false)
    {

        return array(
            "name" => $name,
            "leaf" => true,
            "id" => "gro-" . $id,
            "iconCls" => $isNew ? "x-fa fa-plus-circle" : "x-fa fa-users",
            "editable" => false
        );

    }

    public function getUserNode($id, $name, $isNew = false)
    {

        return array(
            "name" => $name,
            "leaf" => true,
            "id" => "use-" . $id,
            "iconCls" => $isNew ? "x-fa fa-user-plus" : "x-fa fa-user",
            "editable" => false
        );

    }


    public function parseChangeSet($changeSet)
    {

        $keys = array_keys($changeSet);
        foreach ($keys as $key) {

            for ($i = 0; $i <= 1; $i++) {

                if (is_object($changeSet[$key][$i])) {

                    switch ($key) {
                        case "role":
                            $result = $changeSet[$key][$i]->getRoleName();
                            break;

                        case "user":
                        case "approver":
                        case "standInApprover":
                        case "substitute":
                        case "notified":
                        case "requestedBy":
                        case "approvalBy":
                            $result = $changeSet[$key][$i]->getDisplayName();
                            break;

                        case "country":
                            $result = $changeSet[$key][$i]->getCountryName();
                            break;

                        case "company":
                            $result = $changeSet[$key][$i]->getCompanyName();
                            break;

                        case "defaultGroup":
                            $result = $changeSet[$key][$i]->getGroupName();
                            break;

                        case "ugroup":
                            $result = $changeSet[$key][$i]->getGroupName();
                            break;

                        case "lastUpdate":
                        case "validFrom":
                        case "validTo":
                        case "hireDate":
                        case "birthDate":
                        case "startDate":
                        case "endDate":
                            $result = $changeSet[$key][$i]->format(DATE_W3C);
                            break;

                        case "displayNameFormat":
                            $result = $changeSet[$key][$i]->getFormat();
                            break;

                        case "requestStatus":
                            $result = $changeSet[$key][$i]->getRequestStatus();
                            break;

                        case "workflow":
                            $result = $changeSet[$key][$i]->getWorkflowName();
                            break;

                        case "leaveCategory":
                            $result = $changeSet[$key][$i]->getCategoryName();
                            break;

                        case "entitledCategory":
                            $result = $changeSet[$key][$i]->getCategoryName();
                            break;

                        default:
                            $result = $changeSet[$key][$i];
                            break;
                    }

                    $changeSet[$key][$i] = $result;

                    if ($i == 1 && $changeSet[$key][0] == $changeSet[$key][1]) {

                        unset($changeSet[$key]);
                    }
                } else if ($i == 1 && is_numeric($changeSet[$key][$i]) && $changeSet[$key][0] == $changeSet[$key][1]) {

                    unset($changeSet[$key]);
                }
            }
        }

        return $changeSet;
    }


    public function addAction($em, $actor, $targetType, $targetEntity, $type, $text, $changeSet)
    {

        $actionType = $em->getRepository('FAAbsmanBundle:ActionType')->findOneBy(array('actionType' => $type));

        $action = New Action();
        $em->persist($action);

        $action->setActionDate(new \DateTime())
            ->setUser($actor)
            ->setActionType($actionType)
            ->setActionText($text)
            ->setActionDetails($changeSet);

        switch ($targetType) {

            case "country":
                $action->addCountry($targetEntity);
                break;

            case "company":
                $action->addCompany($targetEntity);
                break;

            case "ugroup":
                $action->addUGroup($targetEntity);
                break;

            case "user":
                $action->addTargetUser($targetEntity);
                break;

            case "userEntitlement":
                $action->addUserEntitlement($targetEntity);
                break;

            case "request":
                $action->addRequest($targetEntity);
                break;

            default:
                break;

        }

        return $this;
    }


    public function addUserEntitlement($em, $user, $entitlement, $admin)
    {
        $userEntitlement = $em->getRepository('FAAbsmanBundle:UserEntitlement')->findBy(array(
            "entitledCategory" => $entitlement,
            "user" => $user
        ));

        if (NULL == $userEntitlement) {

            $userEntitlement = new UserEntitlement();
            $em->persist($userEntitlement);

            $userEntitlement->setUser($user);
            $userEntitlement->setEntitledCategory($entitlement);
            $userEntitlement->setAllocated($entitlement->getDefaultValue());
            $userEntitlement->setLeft($entitlement->getDefaultValue());
            $userEntitlement->setOnDemandAllocated($entitlement->getOnDemandDefaultValue());
            $userEntitlement->setOnDemandLeft($entitlement->getOnDemandDefaultValue());
            $userEntitlement->setHidden(0);
            $userEntitlement->setLastUpdate(new \DateTime());

            $this->addAction($em, $admin, "user", $user, "NEWUSERENTITLEMENT", "User Entitlement " . $entitlement->getCategoryName() . " Added ", null);
        }

        return $userEntitlement;
    }


    public function removeUserEntitlement($em, $user, $group, $entitlement, $admin)
    {

        $affectedUser = false;
        $entitlementUsedInRequest = $em->getRepository('FAAbsmanBundle:RequestEntitledCategory')->isEntitlementUsedInRequest($user, $entitlement);
        $entitlementDefinedInOtherGroup = $em->getRepository('FAAbsmanBundle:EntitledCategory')->isEntitlementDefinedInOtherGroup($user, $group, $entitlement);

        //var_dump($entitlementUsedInRequest);

        if (!$entitlementUsedInRequest && !$entitlementDefinedInOtherGroup) {

            $userEntitlement = $em->getRepository('FAAbsmanBundle:UserEntitlement')->findOneBy(array(
                "entitledCategory" => $entitlement,
                "user" => $user
            ));

            $user->removeUserEntitlement($userEntitlement);
            $entitlement->removeUserEntitlement($userEntitlement);

            $em->remove($userEntitlement);

            $this->addAction($em, $admin, "user", $user, "DELETEUSERENTITLEMENT", "User Entitlement " . $entitlement->getCategoryName() . " Deleted ", null);
            $affectedUser = true;

        }

        return $affectedUser;
    }


    public function subFormIsOutOfDate($em, $target, $formType, $oldestTimeStamp, $oldestLinkedTimeStamp = 0)
    {

        $isOutOfDate = false;
        switch ($formType) {

            case "uep":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:EntitledCategory')->hasNewerTimeStampForUser($target, $oldestTimeStamp);
                if ($oldestLinkedTimeStamp != 0)
                    $isOutOfDate = $isOutOfDate || $em->getRepository('FAAbsmanBundle:UserEntitlement')->hasNewerTimeStampForUser($target, $oldestLinkedTimeStamp);
                break;

            case "gep":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:EntitledCategory')->hasNewerTimeStampForCompany($target->getCompany(), $oldestTimeStamp);
                break;

            case "ent":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:EntitledCategory')->hasNewerTimeStampForCompany($target, $oldestTimeStamp);
                break;

            case "ulp":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:LeaveCategory')->hasNewerTimeStampForUser($target, $oldestTimeStamp);
                break;

            case "glp":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:LeaveCategory')->hasNewerTimeStampForCompany($target->getCompany(), $oldestTimeStamp);
                break;

            case "lea":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:LeaveCategory')->hasNewerTimeStampForCompany($target, $oldestTimeStamp);
                break;

            case "upd":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:PublicDay')->hasNewerTimeStampForUser($target, $oldestTimeStamp);
                break;

            case "gpd":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:PublicDay')->hasNewerTimeStampForCompany($target->getCompany(), $oldestTimeStamp);
                break;

            case "pub":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:PublicDay')->hasNewerTimeStampForCompany($target, $oldestTimeStamp);
                break;

            case "mem":
                $isOutOfDate = $em->getRepository('FAAbsmanBundle:User')->hasNewerTimeStampForGroup($target, $oldestTimeStamp);
                break;
        }

        return $isOutOfDate;
    }


    public function isAdminWithRoleForTarget($em, $currentUser, $accessType, $targetType, $target)
    {

        $isAdmin = false;

        switch ($targetType) {

            case "user":

                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CountryAdmin')->isAdminWithRoleForUser($currentUser, $accessType, $target) : $isAdmin;
                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CompanyAdmin')->isAdminWithRoleForUser($currentUser, $accessType, $target) : $isAdmin;
                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:UGroupAdmin')->isAdminWithRoleForUser($currentUser, $accessType, $target) : $isAdmin;

                break;

            case "ugroup":

                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CountryAdmin')->isAdminWithRoleForGroup($currentUser, $accessType, $target) : $isAdmin;
                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CompanyAdmin')->isAdminWithRoleForGroup($currentUser, $accessType, $target) : $isAdmin;
                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:UGroupAdmin')->isAdminWithRoleForGroup($currentUser, $accessType, $target) : $isAdmin;

                break;

            case "company":

                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CountryAdmin')->isAdminWithRoleForCompany($currentUser, $accessType, $target) : $isAdmin;
                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CompanyAdmin')->isAdminWithRoleForCompany($currentUser, $accessType, $target) : $isAdmin;

                break;

            case "country":

                $isAdmin = !$isAdmin ? $em->getRepository('FAAbsmanBundle:CountryAdmin')->isAdminWithRoleForCountry($currentUser, $accessType, $target) : $isAdmin;

                break;

        }

        return $isAdmin;

    }


    public function getContext($user)
    {

        $company = $user->getCompany();
        return array(
            "unit" => $company->getAbsenceUnit(),
            "min" => $company->getMinRatio(),
            "hpd" => $company->getHoursPerDay(),
            "mod" => $company->getManageOnDemand(),
            "wds" => $user->getWorkingDays()
        );

    }


    public function getDateRatioFromCompany($company)
    {

        return $this->getDateRatioFromContext($company->getAbsenceUnit(), $company->getMinRatio(), $company->getHoursPerDay());
    }


    public function getDateRatioFromContext($unit, $length, $hoursPerDay)
    {

        $i = $length / 100;

        $leaveTime = [];
        $returnTime = [];

        $leaveTime[] = array(0, "End of previous working day");
        $returnTime[] = array(0, "Begin of next working day");

        if ($unit === 0) {
            while ($i < 1) {
                $leaveTime[] = array($i, $i . " day before end of day");
                $returnTime[] = array($i, $i . " day after begin of day");
                $i += $length / 100;
            }
        } else {
            while ($i < $hoursPerDay) {
                $hours = $i >= 2 ? "hours" : "hour";
                $leaveTime[] = array($i, $i . " " . $hours . " before end of day");
                $returnTime[] = array($i, $i . " " . $hours . " after begin of day");
                $i += $length / 100;
            }
        }

        return array(
            "leaveTime" => $leaveTime,
            "returnTime" => $returnTime
        );

    }


    public function sendNotification($subject, $absRequest)
    {

        $from = "Absence Management";
        $to = "None";
        $mail_subject = "None";
        $mail_body = "None";
        //$mail_template = "<P>From: %s<\BR>To: %s<\BR></P><H3>%s</H3><\BR><DIV>%s</DIV>";

        switch ($subject) {

            case "NEW_TO_APPROVE":

                $to = $absRequest->getApprover();
                $mail_subject = sprintf("New absence request from %s requires your approval.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just submitted a new absence request.</P><BR><P>Please approve!</P>",
                    $absRequest->getApprover()->getFirstName(), $absRequest->getUser()->getDisplayName());
                break;

            case "NEW_TO_CHECK":

                $to = $absRequest->getSubstitute();
                $mail_subject = sprintf("New absence request from %s requires your attention.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just submitted a new absence request.</P><BR><P>Please check and advise!</P>",
                    $absRequest->getSubstitute()->getFirstName(), $absRequest->getUser()->getDisplayName());
                break;

            case "NEW_AS_INFO":

                $to = $absRequest->getNotified();
                $mail_subject = sprintf("New absence request from %s has been submitted.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just submitted a new absence request.</P><BR><P>Just for your information!</P>",
                    $absRequest->getNotified()->getFirstName(), $absRequest->getUser()->getDisplayName());
                break;

            case "CANCELED_TO_APPROVER":

                $to = $absRequest->getApprover();
                $alert = "Please check if necessary!";
                if ($absRequest->getEndDate() < new \DateTime()) {
                    $alert = "<span style='color:red;'>Warning ! This cancellation occurs while the absence has already completed!</span>";
                }
                $mail_subject = sprintf("Absence request from %s has been canceled.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just canceled absence request from %s to %s.</P><BR><P>%s</P>",
                    $absRequest->getApprover()->getFirstName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"), $alert);
                break;

            case "CANCELED_TO_SUBSTITUTE":

                $to = $absRequest->getSubstitute();
                $mail_subject = sprintf("Absence request from %s has been canceled.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just canceled absence request from %s to %s.</P><BR><P>No further action required!</P>",
                    $absRequest->getSubstitute()->getFirstName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "CANCELED_TO_NOTIFIED":

                $to = $absRequest->getNotified();
                $mail_subject = sprintf("Absence request from %s has been canceled.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just canceled absence request from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getNotified()->getFirstName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "REJECTED_TO_REQUESTER":

                $to = $absRequest->getUser();
                $mail_subject = sprintf("Absence request from %s to %s has been disapproved.",
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just disapproved absence request from %s to %s.</P><BR><P>No further action required!</P>",
                    $absRequest->getUser()->getFirstName(), $absRequest->getApprovalBy()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "REJECTED_TO_SUBSTITUTE":

                $to = $absRequest->getSubstitute();
                $mail_subject = sprintf("Absence request for %s has been disapproved.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just disapproved absence request for %s from %s to %s.</P><BR><P>No further action required!</P>",
                    $absRequest->getSubstitute()->getFirstName(), $absRequest->getApprovalBy()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "REJECTED_TO_NOTIFIED":

                $to = $absRequest->getNotified();
                $mail_subject = sprintf("Absence request for %s has been disapproved.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just disapproved absence request for %s from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getNotified()->getFirstName(), $absRequest->getApprovalBy()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "APPROVED_TO_REQUESTER":

                $to = $absRequest->getUser();
                $mail_subject = sprintf("Absence request from %s to %s has been approved.",
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just approved absence request from %s to %s.</P><BR><P>No further action required!</P>",
                    $absRequest->getUser()->getFirstName(), $absRequest->getApprovalBy()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "APPROVED_TO_SUBSTITUTE":

                $to = $absRequest->getSubstitute();
                $mail_subject = sprintf("Absence request for %s has been approved.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just approved absence request for %s from %s to %s.</P><BR><P>No further action required!</P>",
                    $absRequest->getSubstitute()->getFirstName(), $absRequest->getApprovalBy()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "APPROVED_TO_NOTIFIED":

                $to = $absRequest->getNotified();
                $mail_subject = sprintf("Absence request for %s has been approved.", $absRequest->getUser()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>%s has just approved absence request for %s from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getNotified()->getFirstName(), $absRequest->getApprovalBy()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "ACK_TO_APPROVER":

                $to = $absRequest->getApprover();
                $mail_subject = sprintf("Absence request for %s has been acknowledged by substitute %s.", $absRequest->getUser()->getDisplayName(), $absRequest->getSubstitute()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>Substitute %s has just confirm availability for absence request for %s from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getApprover()->getFirstName(), $absRequest->getSubstitute()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "NACK_TO_APPROVER":

                $to = $absRequest->getApprover();
                $mail_subject = sprintf("Absence request for %s has been rejected by substitute %s.", $absRequest->getUser()->getDisplayName(), $absRequest->getSubstitute()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>Substitute %s has just informed unavailability for absence request for %s from %s to %s.</P><BR><P>You may need to check before approve!</P>",
                    $absRequest->getApprover()->getFirstName(), $absRequest->getSubstitute()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "ACK_TO_USER":

                $to = $absRequest->getUser();
                $mail_subject = sprintf("Absence request has been acknowledged by substitute %s.", $absRequest->getSubstitute()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>Substitute %s has just confirm availability for absence request for %s from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getUser()->getFirstName(), $absRequest->getSubstitute()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "NACK_TO_USER":

                $to = $absRequest->getUser();
                $mail_subject = sprintf("Absence request has been rejected by substitute %s.", $absRequest->getSubstitute()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>Substitute %s has just informed unavailability for absence request for %s from %s to %s.</P><BR><P>You may need to action!</P>",
                    $absRequest->getUser()->getFirstName(), $absRequest->getSubstitute()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "ACK_TO_NOTIFIED":

                $to = $absRequest->getNotified();
                $mail_subject = sprintf("Absence request for %s has been acknowledged by substitute %s.", $absRequest->getUser()->getDisplayName(), $absRequest->getSubstitute()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>Substitute %s has just confirm availability for absence request for %s from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getNotified()->getFirstName(), $absRequest->getSubstitute()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

            case "NACK_TO_NOTIFIED":

                $to = $absRequest->getNotified();
                $mail_subject = sprintf("Absence request for %s has been rejected by substitute %s.", $absRequest->getUser()->getDisplayName(), $absRequest->getSubstitute()->getDisplayName());
                $mail_body = sprintf("<P>Dear %s.</P><P>Substitute %s has just informed unavailability for absence request for %s from %s to %s.</P><BR><P>Just for your information!</P>",
                    $absRequest->getNotified()->getFirstName(), $absRequest->getSubstitute()->getDisplayName(), $absRequest->getUser()->getDisplayName(),
                    $absRequest->getStartDate()->format("d M Y"), $absRequest->getEndDate()->format("d M Y"));
                break;

        }

        return array("from" => "System", "to" => $to, "subject" => $mail_subject, "body" => $mail_body);


    }


    public function setHCalendar($em, $user)
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

}