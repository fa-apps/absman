<?php


namespace FA\AbsmanBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;


class AjaxAuthenticationListener
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $request = $event->getRequest();


        $format = $request->getRequestFormat();
        $exception = $event->getException();

        var_dump($format);
        var_dump($exception);
        if ('json' !== $format || (!$exception instanceof AuthenticationException && !$exception instanceof AccessDeniedException)) {
            return;
        }

        var_dump($format);
        var_dump($exception);
        $response = new JsonResponse($this->translator->trans($exception->getMessage()), $exception->getCode());
        $event->setResponse($response);
        $event->stopPropagation();
    }


}