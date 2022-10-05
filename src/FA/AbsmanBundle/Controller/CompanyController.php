<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\Company;
use FA\AbsmanBundle\Entity\CompanyAdmin;
use FA\AbsmanBundle\Entity\UGroup;
use FA\AbsmanBundle\Entity\UGroupAdmin;
use FA\AbsmanBundle\Entity\DeletedItems;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class CompanyController extends Controller
{
    public function getFormAction($id)
    {

        $isNewRecord = substr($id,0,2) == "0-";
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $list = array_map( function ($displayNameFormat) {

            return array($displayNameFormat["id"], $displayNameFormat["format"]);

        }, $em->getRepository("FAAbsmanBundle:DisplayNameFormat")->getFormats());

        $workflow = array_map( function ($workflowItem) {

            return array($workflowItem["id"], $workflowItem["workflowName"], $workflowItem["workflowText"]);

        }, $em->getRepository("FAAbsmanBundle:Workflow")->getWorkflows());


        if ($isNewRecord) {

            $country = $em->getRepository("FAAbsmanBundle:Country")->find(substr($id, 2));
            if (null === $country) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Country id " . substr($id, 2) . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "country", $country);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the create operation have been denied."
                    );

                } else {

                    $response = array(
                        "id" => $id,
                        "name" => "New Entity",
                        "absenceunit" => 0,
                        "hoursperday" => 8,
                        "hoursperday" => 8,
                        "minabsencelength" => 50,
                        "workingdays" => "0,100,100,100,100,100,0",
                        "countryid" => $country->getId(),
                        "lastupdate" => "0",
                        "isdeletable" => false,
                        "isreadonly" => false,
                        "displaynameformat" => 2,
                        "workflow" => 1,
                        "lists" => array("displaynameformat" => $list, "workflow" => $workflow),
                        "isfavorite" => false
                    );
                }
            }
        } else {

            $company = $em->getRepository("FAAbsmanBundle:Company")->find($id);
            if (null === $company) {

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
                        "mess" => "Access for read operation has been denied!"
                    );

                } else {

                    $response = array(
                        "id" => $company->getId(),
                        "name" => $company->getCompanyName(),
                        "absenceunit" => $company->getAbsenceUnit(),
                        "hoursperday" => $company->getHoursPerDay(),
                        "minabsencelength" => $company->getMinRatio(),
                        "manageondemand" => $company->getManageOnDemand(),
                        "workingdays" => $company->getWorkingDays(),
                        "countryid" => $company->getCountry()->getId(),
                        "lastupdate" => $company->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($company),
                        "isfavorite" => $this->isFavorite($company->getId()),
                        "displaynameformat" => $company->getDisplayNameFormat()->getId(),
                        "workflow" =>$company->getWorkflow()->getId(),
                        "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company),
                        "lists" => array("displaynameformat" => $list, "workflow" => $workflow),
                        "success" => true
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    public function saveFormAction ($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $isNewRecord = substr($id,0,2) === "0-";
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
            $displayNameFormat = $em->getRepository("FAAbsmanBundle:DisplayNameFormat")->find($params['displaynameformat']);
            $workflow = $em->getRepository("FAAbsmanBundle:Workflow")->find($params['workflow']);

            if ( $isNewRecord ) {

                $country = $em->getRepository("FAAbsmanBundle:Country")->find(substr($id, 2));
                if (null === $country) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Country id " . substr($id, 2) . " does not exist."
                    );

                } else {

                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "country", $country);

                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the create operation have been denied."
                        );

                    } else {

                        $isDuplicateName = $em->getRepository("FAAbsmanBundle:Company")->isDuplicateNameForInsert($country, $params['name']);

                        if ($isDuplicateName) {

                            $response = array(
                                "success" => false,
                                "reason" => "DUPLICATE_NAME",
                                "mess" => "A Company record with name '" . $params["name"] . "' already exists"
                            );

                        } else {

                            $company = new Company();
                            $em->persist($company);
                            $company->setCountry($country);

                            $defaultGroup = new UGroup();
                            $em->persist($defaultGroup);

                            $defaultGroup->setGroupName('Default Group')
                                ->setCompany($company)
                                ->setLastUpdate(new \DateTime());

                            $company->setDefaultGroup($defaultGroup)
                                ->setCompanyName($params['name'])
                                ->setWorkingDays($params['workingdays'])
                                ->setAbsenceUnit($params['absenceunit'])
                                ->setHoursPerDay($params['hoursperday'])
                                ->setMinRatio($params['minabsencelength'])
                                ->setManageOnDemand($params['manageondemand'])
                                ->setWorkflow($workflow)
                                ->setDisplayNameFormat($displayNameFormat)
                                ->setLastUpdate(new \DateTime());

                            $adminRole = $em->getRepository('FAAbsmanBundle:Role')->findOneBy(array('role' => 'admin'));

                            $companyAdmin = New CompanyAdmin();
                            $em->persist($companyAdmin);
                            $companyAdmin->setUser($this->getUser())
                                ->setRole($adminRole)
                                ->SetCompany($company);

                            $groupAdmin = New UGroupAdmin();
                            $em->persist($groupAdmin);
                            $groupAdmin->setUser($this->getUser())
                                ->setRole($adminRole)
                                ->SetUGroup($defaultGroup);

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $companyChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($company));
                            $companyAdminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($companyAdmin));
                            $groupChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($defaultGroup));
                            $groupAdminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($groupAdmin));

                            $adminShared->addAction($em, $this->getUser(), "country", $country, "NEWCOMPANY", "Entity Created with name " . $company->getCompanyName() . " (" . count($companyChangeSet) . ").", $companyChangeSet)
                                ->addAction($em, $this->getUser(), "company", $company, "NEWCOMPANY", "Entity Created with name " . $company->getCompanyName() . " (" . count($companyChangeSet) . ").", $companyChangeSet)
                                ->addAction($em, $this->getUser(), "company", $company, "NEWADMIN", "Entity Admin " . $this->getUser()->getDisplayName() . " added with role " . $companyAdmin->getRole()->getRoleName() . ".", $companyAdminChangeSet)
                                ->addAction($em, $this->getUser(), "company", $company, "NEWGROUP", "Default Group Created with name " . $defaultGroup->getGroupName() . " (" . count($groupChangeSet) . ").", $groupChangeSet)
                                ->addAction($em, $this->getUser(), "ugroup", $defaultGroup, "NEWGROUP", "Default Group Created with name " . $defaultGroup->getGroupName() . " (" . count($groupChangeSet) . ").", $groupChangeSet)
                                ->addAction($em, $this->getUser(), "ugroup", $defaultGroup, "NEWADMIN", "Group Admin " . $this->getUser()->getDisplayName() . " added with role " . $groupAdmin->getRole()->getRoleName() . ".", $groupAdminChangeSet);

                            $response = array(
                                "success" => true,
                                "lastupdate" => $company->getLastUpdate()->getTimestamp(),
                                "isdeletable" => $this->isDeletable($company),
                                "id" => $company->getId(),
                                "countryid" => $company->getCountry()->getId(),
                                "newnode" => $adminShared->getCompanyNode($company->getId(), $company->getCompanyName(), false),
                                "mess" => "Company '" . $company->getCompanyName() . "' has been created.'"
                            );
                        }
                    }
                }
            } else {

                $company = $em->getRepository("FAAbsmanBundle:Company")->find($id);

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
                            "mess" => "Access for the update operation have been denied."
                        );

                    } else {

                        $isDuplicateName = $em->getRepository("FAAbsmanBundle:Company")->isDuplicateNameForUpdate($company, $params['name']);

                        if ($isDuplicateName) {

                            $response = array(
                                "success" => false,
                                "reason" => "DUPLICATE_NAME",
                                "mess" => "A Company record with name '" . $params["name"] . "' already exists"
                            );

                        } else {

                            $company->setCompanyName($params['name'])
                                ->setWorkingDays($params['workingdays'])
                                ->setAbsenceUnit($params['absenceunit'])
                                ->setMinRatio($params['minabsencelength'])
                                ->setHoursPerDay($params['hoursperday'])
                                ->setManageOnDemand($params['manageondemand'])
                                ->setWorkflow($workflow)
                                ->setDisplayNameFormat($displayNameFormat)
                                ->setLastUpdate(new \DateTime());

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $companyChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($company));

                            $adminShared->addAction($em, $this->getUser(), "company", $company, "UPDATECOMPANY", "Entity Update " . $company->getCompanyName() . " (" . count($companyChangeSet) . ").", $companyChangeSet);

                            $response = array(
                                "success" => true,
                                "lastupdate" => $company->getLastUpdate()->getTimestamp(),
                                "isdeletable" => $this->isDeletable($company),
                                "id" => $company->getId(),
                                "countryid" => $company->getCountry()->getId(),
                                "mess" => "Company '" . $company->getCompanyName() . "' has been updated.'"
                            );
                        }
                    }
                }
            }
        }
        $em->flush();

        return new Response(json_encode($response));

    }

    public function deleteFormAction ($id)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');

        $company = $em->getRepository("FAAbsmanBundle:Company")->find($id);

        if (null === $company) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Company id " . $id . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "company", $company);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {

                if (!$this->isDeletable($company)) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_DELETABLE",
                        "mess" => "The record can't be deleted."
                    );

                } else {

                    $defaultGroup = $em->getRepository("FAAbsmanBundle:UGroup")->find($company->getDefaultGroup());

                    if (null === $defaultGroup) {

                        $response = array(
                            "success" => false,
                            "reason" => "NOT_FOUND",
                            "mess" => "DefaultGroup for company id " . $id . " does not exist."
                        );

                    } else {

                        $companyArray = $em->getRepository("FAAbsmanBundle:Company")->getArrayCompany($company);
                        $companyHistory = $em->getRepository("FAAbsmanBundle:Action")->getFullCompanyActions($company, 0, 250);
                        $companyAdmins = $em->getRepository("FAAbsmanBundle:CompanyAdmin")->getAdmins($company, 0, 250, "");

                        $companyBackup = new DeletedItems();
                        $em->persist($companyBackup);
                        $companyBackup->setEntityName("Company " . $company->getCompanyName())
                            ->setDeleteDate(new \DateTime())
                            ->setPreviousData(json_encode(array(
                                "company" => $companyArray,
                                "admins" => $companyAdmins,
                                "history" => $companyHistory
                            )));

                        $defaultGroupArray = $em->getRepository("FAAbsmanBundle:UGroup")->getArrayUGroup($defaultGroup);
                        $defaultGroupHistory = $em->getRepository("FAAbsmanBundle:Action")->getFullUGroupActions($defaultGroup, 0, 250, "");
                        $defaultGroupAdmins = $em->getRepository("FAAbsmanBundle:UGroupAdmin")->getAdmins($defaultGroup, 0, 250, "");

                        $defaultGroupBackup = new DeletedItems();
                        $em->persist($defaultGroupBackup);
                        $defaultGroupBackup->setEntityName("Default Group " . $defaultGroup->getGroupName())
                            ->setDeleteDate(new \DateTime())
                            ->setPreviousData(json_encode(array(
                                "group" => $defaultGroupArray,
                                "admins" => $defaultGroupAdmins,
                                "history" => $defaultGroupHistory
                            )));

                        $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('com-' . $id);
                        $em->getRepository("FAAbsmanBundle:CompanyAdmin")->removeAdmins($company);
                        $em->getRepository("FAAbsmanBundle:Action")->removeCompanyActions($company);

                        $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('gro-' . $id);
                        $em->getRepository("FAAbsmanBundle:UGroupAdmin")->removeAdmins($defaultGroup);
                        $em->getRepository("FAAbsmanBundle:Action")->removeUGroupActions($defaultGroup);

                        $adminShared->addAction($em, $this->getUser(), "country", $company->getCountry(), "DELETECOMPANY", "Company " . $company->getCompanyName() . " has been deleted.", NULL);

                        $em->remove($company);
                        $em->remove($defaultGroup);

                        $em->flush();

                        $response = array(
                            "success" => true,
                            "mess" => "Company has been deleted."
                        );
                    }
                }
            }
        }

        return new Response(json_encode($response));

    }

    public function checkFormAction($id, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $oodSubForms = Array();
        $lastupdate = $request->get('lastupdate');
        $loadedSubForms = (array) json_decode($request->get("subforms"));
        $company = $this->getDoctrine()->getManager()->getRepository('FAAbsmanBundle:Company')->find($id);

        if (null === $company) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Company id " . $id . " does not exist."
            );
        }
        else {

            foreach ($loadedSubForms as $formType => $oldestTimeStamp) {

                if ($adminShared->subFormIsOutOfDate($em, $company, $formType, $oldestTimeStamp)) {

                    $oodSubForms[] = $formType;
                }
            }

            $currentTimeStamp = $company->getLastUpdate()->getTimestamp();

            $response = array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($company),
                "oodSubForms" => $oodSubForms
            );
        }

        return new Response(json_encode($response));

    }


    private function isDeletable($company)
    {
        $em = $this->getDoctrine()->getManager();
        $groupRepository = $em->getRepository('FAAbsmanBundle:UGroup');
        $userRepository = $em->getRepository('FAAbsmanBundle:User');

        return ($groupRepository->getGroupCount($company, $company->getDefaultGroup()) === 0 && $userRepository->getUserCount($company) === 0);
    }


    private function isFavorite($id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository= $em->getRepository('FAAbsmanBundle:Favorite');
        return $repository->favoriteExists($this->getUser(),"com-" . $id);

    }


}