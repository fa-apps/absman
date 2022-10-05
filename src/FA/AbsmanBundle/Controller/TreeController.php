<?php

namespace FA\AbsmanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


class TreeController extends Controller
{

    public function getNodesAction($nodeId, Request $request)
    {

        $curNode = explode("-", $nodeId);
        $return = array();
        $adminShared = $this->get('fa_absman.admin.shared');
        $em=$this->getDoctrine()->getManager();

        if ("GET" == $request->getMethod()) {

            switch ($nodeType = $curNode[0]) {

                case "root":

                    $favorites = array();
                    $listFavorites = $em->getRepository('FAAbsmanBundle:Favorite')->getFavorites($this->getUser());
                    foreach ($listFavorites as $favorite) {
                        $favorites[] = $adminShared->getFavoriteNode($favorite->getId(), $favorite->getTarget(), $favorite->getText());
                    }

                    $return[] = array(
                        "name" => "Favorites...",
                        "editable" => false,
                        "iconCls" => "x-fa fa fa-heart",
                        "id" => "favorites",
                        "children" => $favorites,
                        "expanded" => true
                    );

                    $return[] = array(
                        "name" => "Browse...",
                        "editable" => false,
                        "iconCls" => "x-fa fa-folder",
                        "id" => "browse");

                    break;


                case "favorites":
                    $listFavorites = $em->getRepository('FAAbsmanBundle:Favorite')->getFavorites($this->getUser());
                    foreach ($listFavorites as $favorite) {
                        $return[] = $adminShared->getFavoriteNode($favorite->getId(), $favorite->getTarget(), $favorite->getText());
                    }
                    break;

                case "browse":
                    $listCountries = $em->getRepository('FAAbsmanBundle:Country')->getCountries($this->getUser());
                    $return[] = $adminShared->getCountryNode("0-", "New Country...", true);
                    foreach ($listCountries as $country) {
                        $return[] = $adminShared->getCountryNode($country->getId(), $country->getCountryName());
                    }
                    break;

                case "cou":

                    $countryId = $curNode[1];
                    $country =  $em->getRepository('FAAbsmanBundle:Country')->find($countryId);
                    $adminLevel = $em->getRepository('FAAbsmanBundle:CountryAdmin')->getAdminRoleForTarget($this->getUser(), $country);
                    $childAdminRole = true;
                    if ($adminLevel !== false || $childAdminRole) {
                        $listCompanies = $em->getRepository('FAAbsmanBundle:Company')->getCompanies($country);
                        if ($adminLevel == "admin" || $adminLevel == "editor") {
                            $return[] = $adminShared->getCompanyNode("0-" . $countryId, "New Entity...", true);
                        }
                        foreach ($listCompanies as $company) {
                            $return[] = $adminShared->getCompanyNode($company->getId(), $company->getCompanyName());
                        }
                    }
                    break;

                case "com":
                    $companyId = $curNode[1];
                    $company = $em->getRepository('FAAbsmanBundle:Company')->find($companyId);
                    $adminLevel = $em->getRepository('FAAbsmanBundle:CompanyAdmin')->getAdminRoleForTarget($this->getUser(), $company);
                    $adminLevelCountry = $em->getRepository('FAAbsmanBundle:CountryAdmin')->getAdminRoleForTarget($this->getUser(), $company->getCountry());
                    if ($adminLevel || $adminLevelCountry) {
                        $listGroups = $em->getRepository('FAAbsmanBundle:UGroup')->getGroups($company);
                        if ($adminLevel == "admin" || $adminLevel == "editor" || $adminLevelCountry == "admin" || $adminLevelCountry == "editor") {
                            $return[] = $adminShared->getUserNode("0-" . $companyId, "New User...", true);
                            $return[] = $adminShared->getGroupNode("0-" . $companyId, "New Group...", true);
                        }
                        foreach ($listGroups as $group) {
                            $return[] = $adminShared->getGroupNode($group->getId(), $group->getGroupName());
                        }
                    }
                    break;

                default:
                    $return = "[]";
                    break;

            }
        } elseif ("PUT" == $request->getMethod()) {

            switch ($nodeType = $curNode[0]) {

                case "cou":
                    //$return = $this->forward('FAAbsmanBundle:Favorite:edit', array( 'request' => $request, 'id' => $curNode[1]));
                    break;

                default:
                    $return = "[]";
                    break;
            }
        }

        return new Response(json_encode($return));

    }

}