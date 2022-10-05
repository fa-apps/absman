<?php

namespace FA\AbsmanBundle\EventListener;


use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class RequestListener
{
    private $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public function onRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        if (!$request->isXmlHttpRequest()) {
            return; //we dismiss requests other than ajax
        }

        //now you check if user is authenticated/session expired/whatever you need       throw new SessionExpired();
        $token = $this->tokenStorage->getToken();
        if ($token === null) {
            //now you create response which you would expect in your js doing ajax, for example JsonResponse
            $response = new JsonResponse("yo"); //you should give some content here
            $event->setResponse($response); //now you override response which will be sent to user
        }

    }
}
