<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\Favorite;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class FavoriteController extends Controller
{

    public function addAction($id, Request $request)
    {
        $newNode = null;
        $em = $this->getDoctrine()->getManager();
        $favoriteExists = $em->getRepository('FAAbsmanBundle:Favorite')->favoriteExists($this->getUser(), $id);

        if (!$favoriteExists) {

            $favorite = new Favorite();
            $em->persist($favorite);
            $favorite
                ->setTarget($id)
                ->setText(($request->get('text')))
                ->setUser($this->getUser())
                ->setDisplayOrder(0);

            $em->flush();

            $shared = $this->get('fa_absman.admin.shared');
            $newNode = $shared->getFavoriteNode($favorite->getId(), $id, $favorite->getText());
        }

        return new JsonResponse(array(
            "success" => true,
            "newnode" => $newNode
        ));

    }


    public function editAction(Request $request)
    {

        $favoriteTarget = substr($request->get('nodeId'), 0, -4);
        $params = array();
        $content = $this->get("request")->getContent();
        if (!empty($content)) {
            $params = json_decode($content, true);
        }

        $em = $this->getDoctrine()->getManager();
        $favorite = $em->getRepository('FAAbsmanBundle:Favorite')->findOneBy(array('target' => $favoriteTarget, 'user' => $this->getUser()));
        $favorite->setText($params['name']);
        $em->flush();

        return new JsonResponse(array(
            "success" => true,
            "mess" => sprintf("Favorite %s Saved.",$params["name"])
        ));

    }


    public function deleteAction($nodeId, Request $request)
    {

        $favoriteTarget = substr($nodeId, 0, -4);
        $em = $this->getDoctrine()->getManager();

        $favorite = $em->getRepository('FAAbsmanBundle:Favorite')->findOneBy(array('target' => $favoriteTarget, 'user' => $this->getUser()));

        if ($favorite) {
            $em->remove($favorite);
            $em->flush();
        }

        return new JsonResponse(array(
            "success" => true
        ));
    }


    public function getAction($nodeId, Request $request)
    {

        $curNode = explode("-", $nodeId);
        $response = array();
        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();


        switch ($nodeType = $curNode[0]) {

            case "root":

                $favorites = array();
                $listFavorites = $em->getRepository('FAAbsmanBundle:Favorite')->getFavorites($this->getUser());
                foreach ($listFavorites as $favorite) {
                    $favorites[] = $adminShared->getFavoriteNode($favorite->getId(), $favorite->getTarget(), $favorite->getText());
                }

                $response[] = array(
                    "name" => "Favorites...",
                    "editable" => false,
                    "iconCls" => "x-fa fa fa-heart",
                    "id" => "favorites",
                    "children" => $favorites,
                    "expanded" => true
                );

                $response[] = array(
                    "name" => "Browse...",
                    "editable" => false,
                    "iconCls" => "x-fa fa-folder",
                    "id" => "browse");

                break;


            case "favorites":
                $listFavorites = $em->getRepository('FAAbsmanBundle:Favorite')->getFavorites($this->getUser());
                foreach ($listFavorites as $favorite) {
                    $response[] = $adminShared->getFavoriteNode($favorite->getId(), $favorite->getTarget(), $favorite->getText());
                }
                break;

            case "browse":
                $listCountries = $em->getRepository('FAAbsmanBundle:Country')->getCountries($this->getUser());
                $response[] = $adminShared->getCountryNode("0-", "New Country...", true);
                foreach ($listCountries as $country) {
                    $response[] = $adminShared->getCountryNode($country->getId(), $country->getCountryName());
                }
                break;

            case "cou":

                $countryId = $curNode[1];
                $country = $em->getRepository('FAAbsmanBundle:Country')->find($countryId);
                $adminLevel = $em->getRepository('FAAbsmanBundle:CountryAdmin')->getAdminRoleForTarget($this->getUser(), $country);
                $childAdminRole = true;
                if ($adminLevel !== false || $childAdminRole) {
                    $listCompanies = $em->getRepository('FAAbsmanBundle:Company')->getCompanies($country);
                    if ($adminLevel == "admin" || $adminLevel == "editor") {
                        $response[] = $adminShared->getCompanyNode("0-" . $countryId, "New Entity...", true);
                    }
                    foreach ($listCompanies as $company) {
                        $response[] = $adminShared->getCompanyNode($company->getId(), $company->getCompanyName());
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
                        $response[] = $adminShared->getUserNode("0-" . $companyId, "New User...", true);
                        $response[] = $adminShared->getGroupNode("0-" . $companyId, "New Group...", true);
                    }
                    foreach ($listGroups as $group) {
                        $response[] = $adminShared->getGroupNode($group->getId(), $group->getGroupName());
                    }
                }
                break;

            default:
                $response = "[]";
                break;

        }

        return new JsonResponse($response);

    }


    public function orderAction($userId, Request $request)
    {

        $adminShared = $this->get('fa_absman.admin.shared');
        $em = $this->getDoctrine()->getManager();

        $targets = $request->get("targets");

        if (empty($targets)) {

            return new JsonResponse(array(
                "success" => false,
                "reason" => "NO_FORM_DATA",
                "mess" => "No data."
            ));
        }

        $targets = json_decode($targets);

        $favorites = $em->getRepository('FAAbsmanBundle:Favorite')->getFavorites($this->getUser());

        foreach ($favorites as $favorite) {

            $favorite->setDisplayOrder(array_search($favorite->getTarget(),$targets)+1);
        }

        $em->flush();

        return new JsonResponse(array(
            "success" => true,
            "mess" => "Member has been ordered!"
        ));
    }

}