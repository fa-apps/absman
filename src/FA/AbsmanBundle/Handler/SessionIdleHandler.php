<?php


namespace FA\AbsmanBundle\Handler;

    use Symfony\Component\HttpFoundation\JsonResponse;
    use Symfony\Component\HttpKernel\HttpKernelInterface;
    use Symfony\Component\HttpKernel\Event\GetResponseEvent;
    use Symfony\Component\HttpFoundation\Session\SessionInterface;
    use Symfony\Component\Routing\RouterInterface;
    use Symfony\Component\HttpFoundation\RedirectResponse;
    use Symfony\Component\Security\Core\SecurityContextInterface;


class SessionIdleHandler
{

    protected $session;
    protected $securityContext;
    protected $router;
    protected $maxIdleTime;

    public function __construct(SessionInterface $session, SecurityContextInterface $securityContext, RouterInterface $router, $maxIdleTime = 0)
    {
        $this->session = $session;
        $this->securityContext = $securityContext;
        $this->router = $router;
        $this->maxIdleTime = $maxIdleTime;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {

        if (HttpKernelInterface::MASTER_REQUEST != $event->getRequestType()) {

            return;
        }
        if ($this->maxIdleTime > 0) {

            $this->session->start();
            $lapse = time() - $this->session->getMetadataBag()->getLastUsed();

            if ($lapse > $this->maxIdleTime) {

                $this->securityContext->setToken(null);
                $this->session->getFlashBag()->set('info', 'You have been logged out due to inactivity.');

                if ($event->getRequest()->isXmlHttpRequest()) {

                    $response = new JsonResponse(array(
                        "success" => false,
                        "code" => "SESSION_IDLE_TIMEOUT",
                        "mess" => "You have been logged out due to inactivity."
                    ));

                } else {

                    $response = new RedirectResponse($this->router->generate('fos_user_security_login'));
                }

                $event->setResponse($response);
            }
        }

    }
}