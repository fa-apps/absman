<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\CountryAdmin;
use FA\AbsmanBundle\Entity\Country;
use FA\AbsmanBundle\Entity\DeletedItems;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class CountryController extends Controller
{

    public function getFormAction($id)
    {

        $isNewRecord = substr($id,0,2) === "0-";

        if ($isNewRecord) {

            //todo user access granted?
            $response = array(
                "name" =>  "New Country",
                "id" => "0-" ,
                "lastupdate" => "0",
                "isdeletable" => false,
                "isfavorite" => false,
                "isreadonly" => false,
                "success" => true
            );
        }
        else {

            $adminShared = $this->get('fa_absman.admin.shared');
            $em = $this->getDoctrine()->getManager();
            $country = $em->getRepository("FAAbsmanBundle:Country")->find($id);

            if (null === $country) {

                $response = array(
                    "success" => false,
                    "reason" => "NOT_FOUND",
                    "mess" => "Country id " . $id . " does not exist."
                );

            } else {

                $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "reader", "country", $country);

                if (!$isAdmin) {

                    $response = array(
                        "success" => false,
                        "reason" => "ACCESS_DENIED",
                        "mess" => "Access for read operation have been denied."
                    );

                } else {

                    $response = array(
                        "name" => $country->getCountryName(),
                        "id" => $country->getId(),
                        "lastupdate" => $country->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($country),
                        "isfavorite" => $this->isFavorite($country->getId()),
                        "isreadonly" => !$adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "country", $country),
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

            if ($isNewRecord) {

                $country = $em->getRepository("FAAbsmanBundle:Country")->findOneByCountryName($params['name']);

                if (null !== $country) {

                    $response = array(
                        "success" => false,
                        "reason" => "DUPLICATE_NAME",
                        "mess" => "A Country record with name '". $params["name"] ."' already exists"
                    );

                } else {

                    $country = new Country();
                    $em->persist($country);
                    $country->setCountryName($params['name'])
                        ->setLastUpdate(new \DateTime());

                    $adminRole = $em->getRepository('FAAbsmanBundle:Role')->findOneBy(array('role' => 'admin'));

                    $admin = New CountryAdmin();
                    $em->persist($admin);
                    $admin->setUser($this->getUser())
                        ->setRole($adminRole)
                        ->SetCountry($country);

                    $uow = $em->getUnitOfWork();
                    $uow->computeChangeSets();
                    $adminChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($admin));
                    $countryChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($country));

                    $adminShared->addAction($em, $this->getUser(), "country", $country, "NEWCOUNTRY", "Country Created with name " . $country->getCountryName() . " (" . count($countryChangeSet) . ").", $countryChangeSet)
                        ->addAction($em, $this->getUser(), "country", $country, "NEWADMIN", "Country Admin " . $this->getUser()->getDisplayName() . " added with role " . $admin->getRole()->getRoleName() . ".", $adminChangeSet);

                    $response = array(
                        "success" => true,
                        "lastupdate" => $country->getLastUpdate()->getTimestamp(),
                        "isdeletable" => $this->isDeletable($country),
                        "id" => $country->getId(),
                        "newnode" => $adminShared->getCountryNode($country->getId(), $country->getCountryName(), false),
                        "mess" => "Country '" . $country->getCountryName() . "' has been created."
                    );
                }

            } else {

                $country = $em->getRepository('FAAbsmanBundle:Country')->find($id);

                if (null === $country) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_FOUND",
                        "mess" => "Country id " . $id . " does not exist."
                    );

                } else {

                    $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "country", $country);
//var_dump($isAdmin);
                    if (!$isAdmin) {

                        $response = array(
                            "success" => false,
                            "reason" => "ACCESS_DENIED",
                            "mess" => "Access for the update operation have been denied."
                        );

                    } else {

                        $isDuplicateName = $em->getRepository("FAAbsmanBundle:Country")->isDuplicateName($country, $params['name']);

                        if ($isDuplicateName) {

                            $response = array(
                                "success" => false,
                                "reason" => "DUPLICATE_NAME",
                                "mess" => "A Country record with name '". $params["name"] ."' already exists"
                            );

                        } else {

                            $country->setCountryName($params['name'])
                                ->setLastUpdate(new \DateTime());

                            $uow = $em->getUnitOfWork();
                            $uow->computeChangeSets();
                            $countryChangeSet = $adminShared->parseChangeSet($uow->getEntityChangeSet($country));

                            $adminShared->addAction($em, $this->getUser(), "country", $country, "UPDATECOUNTRY", "Country Update " . $country->getCountryName() . " (" . count($countryChangeSet) . ").", $countryChangeSet);

                            $response = array(
                                "success" => true,
                                "lastupdate" => $country->getLastUpdate()->getTimestamp(),
                                "isdeletable" => $this->isDeletable($country),
                                "id" => $country->getId(),
                                "mess" => "Country '" . $country->getCountryName() . "' has been updated."
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
        $country = $em->getRepository("FAAbsmanBundle:Country")->find($id);

        if (null === $country) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Country id " . $id . " does not exist."
            );

        } else {

            $isAdmin = $adminShared->isAdminWithRoleForTarget($em, $this->getUser(), "editor", "country", $country);

            if (!$isAdmin) {

                $response = array(
                    "success" => false,
                    "reason" => "ACCESS_DENIED",
                    "mess" => "Access for the remove operation have been denied."
                );

            } else {

                if (!$this->isDeletable($country)) {

                    $response = array(
                        "success" => false,
                        "reason" => "NOT_DELETABLE",
                        "mess" => "The record can't be deleted."
                    );

                } else {

                    $countryArray = $em->getRepository("FAAbsmanBundle:Country")->getArrayCountry($country);
                    $countryHistory = $em->getRepository("FAAbsmanBundle:Action")->getFullCountryActions($country, 0, 250);
                    $countryAdmins = $em->getRepository("FAAbsmanBundle:CountryAdmin")->getAdmins($country, 0, 250, "");

                    $backup = new DeletedItems();
                    $em->persist($backup);
                    $backup->setEntityName("Country " . $country->getCountryName())
                        ->setDeleteDate(new \DateTime())
                        ->setPreviousData(json_encode(array(
                            "country" => $countryArray,
                            "admins" => $countryAdmins,
                            "history" => $countryHistory
                        )));

                    $em->getRepository("FAAbsmanBundle:Favorite")->removeFavoriteAllUsers('cou-' . $id);
                    $em->getRepository("FAAbsmanBundle:CountryAdmin")->removeAdmins($country);
                    $em->getRepository("FAAbsmanBundle:Action")->removeCountryActions($country);
                    $em->remove($country);
                    $em->flush();

                    $response = array(
                        "success" => true,
                        "mess" => "Country has been deleted."
                    );
                }
            }
        }

        return new Response(json_encode($response));
    }


    public function checkFormAction($id, Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $country = $em->getRepository('FAAbsmanBundle:Country')->find($id);

        if (null === $country) {

            $response = array(
                "success" => false,
                "reason" => "NOT_FOUND",
                "mess" => "Country id " . $id . " does not exist."
            );

        } else {

            $lastupdate = $request->get('lastupdate');
            $currentTimeStamp = $country->getLastUpdate()->getTimestamp();
            $response = json_encode(array(
                "success" => true,
                "isoutdated" => $currentTimeStamp <> $lastupdate,
                "lastupdate" => $currentTimeStamp,
                "isdeletable" => $this->isDeletable($country)
            ));
        }

        return new Response($response);
    }


    private function isDeletable($country)
    {

        return $this->getDoctrine()->getManager()->getRepository('FAAbsmanBundle:Company')->getCompanyCount($country) === 0;
    }

    private function isFavorite($id)
    {

        return $this->getDoctrine()->getManager()->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(),"cou-" . $id);
    }


}