<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\EGroup;
use FA\AbsmanBundle\Entity\EGroupMember;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class EGroupController extends Controller
{

    public function getMyStaffAction($userId)
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

        $myStaffList = $em->getRepository('FAAbsmanBundle:User')->getMyStaff($user);

        $defaultGroup = $em->getRepository('FAAbsmanBundle:EGroup')->findOneBy(array("user" => $user, "isDefault" => true));


        if (null === $defaultGroup) {

            //first fetch: creating default group with direct reports

            $eGroup = new EGroup();
            $em->persist($eGroup);

            $eGroup
                ->setGroupName(" My direct reports")
                ->setIsStaff(true)
                ->setIsDefault(true)
                ->setUser($this->getUser())
                ->setLastUpdate(new \DateTime());

            $orderIndex = 0;

            foreach ($myStaffList as $staffMember) {

                $member = $em->getRepository('FAAbsmanBundle:User')->find($staffMember->getId());

                $eGroupMember = new EGroupMember();
                $em->persist($eGroupMember);

                $eGroupMember
                    ->setEGroup($eGroup)
                    ->setEGroupMember($member)
                    ->setDisplayOrder(++$orderIndex);


                $eGroup->addEGroupMember($eGroupMember);
            }

            $em->flush();

        } else {

            // check for update on default group

            $defaultGroupMembers = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $defaultGroup), array("displayOrder" => "ASC"));

            $defaultGroupMemberIds = array_map(function ($member) {
                return $member->getEGroupMember()->getId();
            }, $defaultGroupMembers);

            $staffMembersIds = array_map(function ($member) {
                return $member->getId();
            }, $myStaffList);

            $toRemove = array_diff($defaultGroupMemberIds, $staffMembersIds);
            $toAdd = array_diff($staffMembersIds, $defaultGroupMemberIds);

            foreach ($toRemove as $userId) {

                $member = $em->getRepository('FAAbsmanBundle:User')->find($userId);

                if (null === $member) {

                    return new JsonResponse(array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "User id " . $userId . " does not exist."
                    ));
                }

                $eGroupMember = $em->getRepository("FAAbsmanBundle:EGroupMember")->findOneBy(array("eGroupMember" => $member, "eGroup" => $defaultGroup));

                $em->remove($eGroupMember);
            }

            $displayOrder = count($defaultGroupMemberIds) + count($toRemove) + count($toAdd) + 1;

            foreach ($toAdd as $userId) {

                $member = $em->getRepository('FAAbsmanBundle:User')->find($userId);

                if (null === $member) {

                    return new JsonResponse(array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "User id " . $userId . " does not exist."
                    ));
                }

                $eGroupMember = new EGroupMember();
                $em->persist($eGroupMember);

                $eGroupMember
                    ->setEGroup($defaultGroup)
                    ->setEGroupMember($member)
                    ->setDisplayOrder(++$displayOrder);

                $defaultGroup->addEGroupMember($eGroupMember);
            }

            $em->flush();
        }

        $myStaffGroupsRaw = $em->getRepository('FAAbsmanBundle:EGroup')->findBy(array("user" => $user), array("isDefault" => "DESC", "groupName" => "ASC"));
        $myStaffGroups = array();

        foreach ($myStaffGroupsRaw as $groupItem) {

            $groupMembersRaw = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $groupItem), array("displayOrder" => "ASC"));

            $groupMembers = array();

            foreach ($groupMembersRaw as $member) {

                $groupMembers[] = array(
                    "leaf" => true,
                    "iconCls" => "x-fa fa-user",
                    "text" => $member->getEGroupMember()->getDisplayName(),
                    "userId" => $member->getEGroupMember()->getId(),
                    "id" => $member->getId()

                );
            }

            $myStaffGroups[] = array(
                "id" => $groupItem->getId(),
                "text" => $groupItem->getGroupName(),
                "iconCls" => "x-fa fa-users",
                "children" => $groupMembers
            );
        }


        $lastUpdate = new \DateTime('now');

        $response = array(
            "success" => true,
            "data" => array(
                "groups" => $myStaffGroups,
                "lastupdate" => $lastUpdate->getTimestamp()
            )
        );

        return new JsonResponse($response);
    }


    public function saveGroupAction($groupId, Request $request)
    {

        $isNewRecord = $groupId == "newGroupId";
        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $content = $request->getContent();

        if (empty($content)) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        if ($isNewRecord) {

            $params = json_decode($content, true);

            $eGroup = new EGroup();
            $em->persist($eGroup);

            $eGroup
                ->setGroupName($params["text"])
                ->setIsStaff(true)
                ->setIsDefault(false)
                ->setUser($this->getUser())
                ->setLastUpdate(new \DateTime());

            $em->flush();

            $response = array(
                "success" => true,
                "mess" => "Group has been added!",
                "data" => array(
                    "newId" => $eGroup->getId(),
                    "text" => $eGroup->getGroupName()
                ),
            );

        } else {

            $params = json_decode($content, true);

            $eGroup = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);

            if (null === $eGroup) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => sprintf("Group id %s does not exist.", $groupId)
                ));

            }

            $eGroup
                ->setGroupName($params["text"])
                ->setLastUpdate(new \DateTime());

            $em->flush();

            $response = array(
                "success" => true,
                "mess" => "Group has been saved!",
                "data" => array("lastupdate" => $eGroup->getLastUpdate()->getTimestamp())
            );

        }

        return new JsonResponse($response);
    }


    public function deleteGroupAction($groupId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $eGroup = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);

        if (null === $eGroup) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Group id %s does not exist.", $groupId)
            ));
        }

        $content = $request->getContent();

        if (empty($content)) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        $params = json_decode($content, true);

        $groupMembers = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $eGroup));

        foreach ($groupMembers as $member) {

            $em->remove($member);
        }

        $em->remove($eGroup);
        $em->flush();

        return new JsonResponse(array(
            "success" => true,
            "mess" => "Group has been deleted!"
        ));

    }


    public function getGroupMembersAction($groupId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $eGroup = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);

        if (null === $eGroup) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Group id %s does not exist!", $groupId)
            ));
        }

        $groupMembers = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $eGroup));

        $response = array();

        foreach ($groupMembers as $member) {

            $response[] = array(
                "leaf" => true,
                "iconCls" => "x-fa fa-user",
                "text" => $member->getEGroupMember()->getDisplayName(),
                "userId" => $member->getEGroupMember()->getId(),
                "id" => $member->getId()
            );
        }

        return new JsonResponse($response);
    }


    public function addGroupMembersAction($groupId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();
        $eGroup = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);

        if (null === $eGroup) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Group id %s does not exist!", $groupId)
            ));
        }

        $newGroupMembers = json_decode($request->get("members"));

        if (empty($newGroupMembers)) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        $newMembers = array();

        if ($newGroupMembers === "all") {

            $newMembers = $em->getRepository('FAAbsmanBundle:User')->getMyStaff($this->getUser());

        } else if ($newGroupMembers === "reports") {

            $approverId = json_decode($request->get("approver"));

            if (empty($approverId)) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NO_FORM_DATA",
                    "mess" => "No data." . $approverId
                ));
            }

            $approver = $em->getRepository('FAAbsmanBundle:User')->find($approverId);

            if (null === $approver) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => sprintf("Approver id %s does not exist!", $approverId)
                ));
            }

            $newMembers = $em->getRepository('FAAbsmanBundle:User')->getReports($approver);

        } else {

            foreach ($newGroupMembers as $memberId) {

                $newMembers[] = $em->getRepository('FAAbsmanBundle:User')->find($memberId);

            }

        }

        $groupMembers = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $eGroup), array("displayOrder" => "ASC"));

        $orderIndex = 0;

        $memberIds = array();

        foreach ($groupMembers as $member) {

            $memberIds[] = $member->getEGroupMember()->getId();
        }

        $addedCount = 0;
        foreach ($newMembers as $newMember) {

            if (array_search($newMember->getId(), $memberIds) === false) {

                $member = $em->getRepository('FAAbsmanBundle:User')->find($newMember->getId());

                $eGroupMember = new EGroupMember();
                $em->persist($eGroupMember);

                $eGroupMember
                    ->setEGroup($eGroup)
                    ->setEGroupMember($member)
                    ->setDisplayOrder(++$orderIndex);

                $eGroup->addEGroupMember($eGroupMember);
                $addedCount++;
            }
        }

        $orderIndex = count($newMembers);

        foreach ($groupMembers as $groupMember) {

            $groupMember->setDisplayOrder(++$orderIndex);
        }


        $em->flush();

        $groupMembers = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $eGroup), array("displayOrder" => "ASC"));

        $response = array();

        foreach ($groupMembers as $member) {

            $response[] = array(
                "leaf" => true,
                "iconCls" => "x-fa fa-user",
                "text" => $member->getEGroupMember()->getDisplayName(),
                "userId" => $member->getEGroupMember()->getId(),
                "id" => $member->getId()
            );
        }

        $response = array(
            "success" => true,
            "mess" => sprintf("Group members has been saved, added count: %s", $addedCount),
            "data" => array("members" => $response)
        );

        return new JsonResponse($response);
    }


    public function orderGroupMemberAction($groupId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $eGroup = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);

        if (null === $eGroup) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Group id %s does not exist!", $groupId)
            ));
        }

        $ids = $request->get("ids");

        if (empty($ids)) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        $ids = json_decode($ids);

        $groupMembers = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $eGroup));

        foreach ($groupMembers as $member) {

            $member->setDisplayOrder(array_search($member->getId(), $ids) + 1);
        }

        $em->flush();

        $response = array(
            "success" => true,
            "mess" => "Member has been ordered!"
        );

        return new JsonResponse($response);
    }


    public function removeGroupMemberAction($userId, $groupId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();
        $eGroup = $em->getRepository("FAAbsmanBundle:EGroup")->find($groupId);
        $user = $em->getRepository("FAAbsmanBundle:User")->find($userId);

        if (null === $eGroup || null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => sprintf("Group id %s or user id %s does not exist!", $groupId, $userId)
            ));
        }

        $groupMember = $em->getRepository("FAAbsmanBundle:EGroupMember")->findOneBy(Array("eGroupMember" => $user, "eGroup" => $eGroup));

        if (null === $groupMember) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Group member not found!"
            ));
        }

        $em->remove($groupMember);
        $em->flush();

        $response = array(
            "success" => true,
            "mess" => "Member has been removed!"
        );

        return new JsonResponse($response);
    }


    public function checkMyStaffAction($userId, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $user = $em->getRepository('FAAbsmanBundle:User')->find($userId);

        if (null === $user) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "User id " . $userId . " does not exist."
            ));

        }

        $lastUpdate = json_decode($request->get("formTimestamp"));
        $eGroupIds = json_decode($request->get("ids"));

        if (empty($lastUpdate) || empty($eGroupIds)) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        foreach ($eGroupIds as $eGroupId) {

            $eGroup = $em->getRepository('FAAbsmanBundle:EGroup')->find($eGroupId);

            if (null === $eGroup) {

                return new JsonResponse(array(
                    "success" => false,
                    "reason" => "EGROUP_UNKNOWN",
                    "mess" => "Unknown group."
                ));
            }

            $members = $em->getRepository("FAAbsmanBundle:EGroupMember")->findBy(array("eGroup" => $eGroup));

            foreach ($members as $member) {

                if ($member->getEGroupMember()->getLastUpdate()->getTimestamp() > $lastUpdate) {

                    return new JsonResponse(array(
                        "success" => true,
                        "outdated" => true
                    ));
                }
            }
        }

        return new JsonResponse(array(
            "success" => true,
            "outdated" => false
        ));

    }

}