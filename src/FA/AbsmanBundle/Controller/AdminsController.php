<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\CountryAdmin;
use FA\AbsmanBundle\Entity\CompanyAdmin;
use FA\AbsmanBundle\Entity\UGroupAdmin;
use FA\AbsmanBundle\Entity\Action;
use FA\AbsmanBundle\Entity\Role;
use FA\AbsmanBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class AdminsController extends Controller
{
    public function getAdminsAction($targetType, $targetId, Request $request)
    {
        $sort = array();

        $sortString = $request->get("sort");
        if ($sortString) {
            $sort = json_decode($sortString, true);
        }
        $em = $this->getDoctrine()->getManager();


        switch ($targetType) {
            case "cou":
                $targetEntity = $em->getRepository("FAAbsmanBundle:Country")->find($targetId);
                $targetRepository = $em->getRepository("FAAbsmanBundle:CountryAdmin");
                break;

            case "com":
                $targetEntity = $em->getRepository("FAAbsmanBundle:Company")->find($targetId);
                $targetRepository = $em->getRepository("FAAbsmanBundle:CompanyAdmin");
                break;

            case "gro":
                $targetEntity = $em->getRepository("FAAbsmanBundle:UGroup")->find($targetId);
                $targetRepository = $em->getRepository("FAAbsmanBundle:UGroupAdmin");
                break;
        }

        $admins = $targetRepository->getAdmins($targetEntity, $request->get("start"), $request->get("limit"), $sort);
        $adminsCount = $targetRepository->getAdminsCount($targetEntity);


        foreach ($admins as &$admin) {

            $admin = array_merge($admin, array("isdeletable"=>true, "iseditable"=>true));
        }

        return new Response(json_encode(array(
            "success" => true,
            "total" => $adminsCount,
            "data" => $admins
        )));
    }


    public function getAdminsRolesAction()
    {
        $adminRoles = array();
        $roles = $this->getDoctrine()->getManager()->getRepository("FAAbsmanBundle:Role")->findAll();
        foreach ($roles as $role) {
            $adminRoles[] = array("id"=>$role->getId(),"name"=>$role->getRoleName());
        }

        return new Response(json_encode(array(
            "success" => true,
            "data" => $adminRoles
        )));
    }


    public function isAdminAction($targetType, $targetId, $adminId)
    {
        $em = $this->getDoctrine()->getManager();

        switch ($targetType) {
            case "cou":
                $targetEntity = $em->getRepository("FAAbsmanBundle:Country")->find($targetId);
                $targetRepository = $em->getRepository("FAAbsmanBundle:CountryAdmin");
                break;

            case "com":
                $targetEntity = $em->getRepository("FAAbsmanBundle:Company")->find($targetId);
                $targetRepository = $em->getRepository("FAAbsmanBundle:CompanyAdmin");
                break;

            case "gro":
                $targetEntity = $em->getRepository("FAAbsmanBundle:UGroup")->find($targetId);
                $targetRepository = $em->getRepository("FAAbsmanBundle:UGroupAdmin");
                break;
        }

        $admin = $em->getRepository("FAAbsmanBundle:User")->find($adminId);

        $isAdmin = $targetRepository->isAdminForTarget($admin,$targetEntity);

        return new Response(json_encode(array(
            "success" => true,
            "isAdmin" => $isAdmin
        )));
    }


    public function saveAdminAction($targetType, $targetId, $adminId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = $request->getContent();
        $currentAdmin = $this->getUser();
        $targetEntity = null;
        $admin = null;
        $targetTypeName = null;

        if ( empty($content) ) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $params = json_decode($content, true);
            $role = $em->getRepository("FAAbsmanBundle:Role")->find($params["roleid"]);
            $adminShared = $this->get('fa_absman.admin.shared');

            switch ($targetType) {

                case "cou":

                    $admin = $em->getRepository("FAAbsmanBundle:CountryAdmin")->find($adminId);

                    if ( null !== $admin ) {

                        $targetEntity = $admin->getCountry();
                        $actionText = "Country Admin " . $admin->getUser()->getDisplayName() . " updated with role " . $role->getRoleName() . ".";
                        $targetTypeName = "country";
                    }
                    break;

                case "com":

                    $admin = $em->getRepository("FAAbsmanBundle:CompanyAdmin")->find($adminId);

                    if ( null !== $admin ) {

                        $targetEntity = $admin->getCompany();
                        $actionText = "Company Admin " . $admin->getUser()->getDisplayName() . " updated with role " . $role->getRoleName() . ".";
                        $targetTypeName = "company";
                    }
                    break;

                case "gro":

                    $admin = $em->getRepository("FAAbsmanBundle:UGroupAdmin")->find($adminId);

                    if ( null !== $admin ) {

                        $targetEntity = $admin->getUGroup();
                        $actionText = "Company Admin " . $admin->getUser()->getDisplayName() . " updated with role " . $role->getRoleName() . ".";
                        $targetTypeName = "ugroup";
                    }
                    break;

            }

            if ( null === $admin ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Admin id " . $adminId . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $currentAdmin, "admin", $targetTypeName, $targetEntity);

                if ( !$isAdmin ) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the update operation have been denied."
                    );

                } else {

                    $admin->setRole($role);

                    $uow = $em->getUnitOfWork();
                    $uow->computeChangeSets();
                    $adminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($admin));

                    $adminShared->addAction($em, $this->getUser(), $targetTypeName, $targetEntity, "UPDATEADMIN", $actionText, $adminChangeSet);

                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => $actionText
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    public function addAdminAction($targetType, $targetId, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $content = $request->getContent();
        $currentAdmin = $this->getUser();

        if (empty($content)) {

            $response = array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            );

        } else {

            $isAdmin = false;
            $targetEntity = null;
            $admin = null;
            $targetTypeName = null;
            $params = json_decode($content, true);
            $adminShared = $this->get('fa_absman.admin.shared');

            $adminUser = $em->getRepository("FAAbsmanBundle:User")->find($params["userid"]);
            if ( null === $adminUser ) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "User id " . $params["userid"] . " does not exist."
                );

            } else {

                $role = $em->getRepository("FAAbsmanBundle:Role")->find($params["roleid"]);

                switch ($targetType) {

                    case "cou":

                        $targetTypeName = "country";
                        $targetEntity = $em->getRepository("FAAbsmanBundle:Country")->find($targetId);

                        if ( null !== $targetEntity ) {

                            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $currentAdmin, "admin", $targetTypeName, $targetEntity);

                            if ( $isAdmin ) {

                                $admin = new CountryAdmin();
                                $em->persist($admin);
                                $admin->setCountry($targetEntity);
                                $actionText = "Country Admin " . $adminUser->getDisplayName() . " added with role " . $role->getRoleName() . ".";
                            }
                        }
                        break;

                    case "com":

                        $targetTypeName = "company";
                        $targetEntity = $em->getRepository("FAAbsmanBundle:Company")->find($targetId);

                        if ( null !== $targetEntity ) {

                            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $currentAdmin, "admin", $targetTypeName, $targetEntity);

                            if ($isAdmin) {

                                $admin = new CompanyAdmin();
                                $em->persist($admin);
                                $admin->setCompany($targetEntity);
                                $actionText = "Company Admin " . $adminUser->getDisplayName() . " added with role " . $role->getRoleName() . ".";
                            }
                        }
                        break;

                    case "gro":

                        $targetTypeName = "ugroup";
                        $targetEntity = $em->getRepository("FAAbsmanBundle:UGroup")->find($targetId);

                        if ( null !== $targetEntity ) {

                            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $currentAdmin, "admin", $targetTypeName, $targetEntity);

                            if ($isAdmin) {

                                $admin = new UGroupAdmin();
                                $em->persist($admin);
                                $admin->setUGroup($targetEntity);
                                $actionText = "Group Admin " . $adminUser->getDisplayName() . " added with role " . $role->getRoleName() . ".";
                            }
                        }
                        break;
                }

                if (null === $targetEntity) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Entity / id " . $targetTypeName . " / " . $params["userid"] . " does not exist."
                    );

                } else if ( !$isAdmin ) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for the create operation have been denied!"
                    );

                } else {

                    $admin->setUser($adminUser);
                    $admin->setRole($role);

                    $uow = $em->getUnitOfWork();
                    $uow->computeChangeSets();
                    $adminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($admin));

                    $adminShared->addAction($em, $this->getUser(), $targetTypeName, $targetEntity, "NEWADMIN", $actionText, $adminChangeSet);

                    $em->flush();

                    $response = array(
                        "success" => true,
                        "newid" => $admin->getId(),
                        "target" => $targetId,
                        "mess" => $actionText
                    );
                }
            }
        }

        return  new Response(json_encode($response));
    }

    public function removeAdminAction($targetType, $targetId, $adminId)
    {
        $em = $this->getDoctrine()->getManager();
        $adminShared = $this->get('fa_absman.admin.shared');
        $currentAdmin = $this->getUser();
        $targetEntity = null;
        $admin = null;
        $targetTypeName = null;

        switch ($targetType) {


            case "cou":

                $targetTypeName = "country";
                $admin = $em->getRepository("FAAbsmanBundle:CountryAdmin")->find($adminId);

                if ( null !== $admin ) {

                    $targetEntity = $em->getRepository("FAAbsmanBundle:Country")->find($targetId);
                    $actionText = "Country Admin " . $admin->getUser()->getDisplayName() . " removed.";
                }
                break;

            case "com":

                $targetTypeName = "company";
                $admin = $em->getRepository("FAAbsmanBundle:CompanyAdmin")->find($adminId);

                if ( null !== $admin ) {

                    $targetEntity = $em->getRepository("FAAbsmanBundle:Company")->find($targetId);
                    $actionText = "Company Admin " . $admin->getUser()->getDisplayName() . " removed.";
                }
                break;

            case "gro":

                $targetTypeName = "ugroup";
                $admin = $em->getRepository("FAAbsmanBundle:UGroupAdmin")->find($adminId);

                if ( null !== $admin ) {

                    $targetEntity = $em->getRepository("FAAbsmanBundle:UGroup")->find($targetId);
                    $actionText = "Group Admin " . $admin->getUser()->getDisplayName() . " removed.";
                }
                break;

        }

        if ( null === $admin ) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => $targetTypeName ." Admin id " . $adminId . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $currentAdmin, "admin", $targetTypeName, $targetEntity);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied!"
                );

            } else {

                $em->remove($admin);

                $uow = $em->getUnitOfWork();
                $uow->computeChangeSets();
                $adminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($admin));

                $adminShared->addAction($em, $this->getUser(), $targetTypeName, $targetEntity, "DELETEADMIN", $actionText, $adminChangeSet);

                $em->flush();

                $response = array(
                    "success" => true,
                    "mess" => $actionText
                );
            }
        }

        return new Response(json_encode($response));
    }
}