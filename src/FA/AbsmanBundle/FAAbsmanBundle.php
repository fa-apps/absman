<?php

namespace FA\AbsmanBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Doctrine\DBAL\Types\Type;

class FAAbsmanBundle extends Bundle

{

    public function boot()
    {
        //Type::addType('binary', 'FA\AbsmanBundle\Types\BinaryType');
        //Type::addType('uuid', 'FA\AbsmanBundle\Types\UuidType');
        date_default_timezone_set("GMT");
    }



}
