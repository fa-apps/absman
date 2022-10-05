<?php


namespace FA\AbsmanBundle\Controller;


use FA\AbsmanBundle\Entity\Action;
use FA\AbsmanBundle\Entity\Actor;
use FA\AbsmanBundle\Entity\Country;
use FA\AbsmanBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class ActionController extends Controller
{

    public function getHistoryAction ($target, $id, Request $request)
    {
        $actions = array();
        $actionsCount = 0;
        $sort = array();
        $em = $this->getDoctrine()->getManager();

        $sortstring = $request->get("sort");
        if ($sortstring) {
            $sort = json_decode($sortstring, true);
        }

        switch ($target) {
            case "cou":
                $country = $em->getRepository("FAAbsmanBundle:Country")->find($id);
                $actions = $em->getRepository("FAAbsmanBundle:Action")->getCountryActions($country, $request->get("start"), $request->get("limit"), $sort);
                $actionsCount = $em->getRepository("FAAbsmanBundle:Action")->getCountryActionsCount($country);
                break;

            case "com":
                $company = $em->getRepository("FAAbsmanBundle:Company")->find($id);
                $actions = $em->getRepository("FAAbsmanBundle:Action")->getCompanyActions($company, $request->get("start"), $request->get("limit"), $sort);
                $actionsCount = $em->getRepository("FAAbsmanBundle:Action")->getCompanyActionsCount($company);
                break;

            case "gro":
                $group = $em->getRepository("FAAbsmanBundle:Ugroup")->find($id);
                $actions = $em->getRepository("FAAbsmanBundle:Action")->getUGroupActions($group, $request->get("start"), $request->get("limit"), $sort);
                $actionsCount = $em->getRepository("FAAbsmanBundle:Action")->getUGroupActionsCount($group);
                break;

            case "use":
                $user = $em->getRepository("FAAbsmanBundle:User")->find($id);
                $actions = $em->getRepository("FAAbsmanBundle:Action")->getUserActions($user, $request->get("start"), $request->get("limit"), $sort);
                $actionsCount = $em->getRepository("FAAbsmanBundle:Action")->getUserActionsCount($user);
                break;
        }

        foreach($actions as &$action) {

            $action["date"] = date_format($action["date"],DATE_W3C);
        }

        return new Response(json_encode(array(
            "success" => true,
            "total" => $actionsCount,
            "data" => $actions
        )));
    }

    public function getHistoryDetailsAction ($id)
    {
        $em = $this->getDoctrine()->getManager();
        $actionDetails = $em->getRepository("FAAbsmanBundle:Action")->find($id);

        $result = array();
        foreach($actionDetails->getActionDetails() as $key => $detail) {

            $result[] = array($key,$detail[0],$detail[1]);
        }

        return new Response(json_encode($result));
    }

}