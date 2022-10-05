<?php

namespace FA\AbsmanBundle\Types;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Id\AbstractIdGenerator;

include_once("LibUUID.php");

class GuidGenerator extends AbstractIdGenerator
{
    public function generate(EntityManager $em, $entity)
    {
        $newid=\UUID::mint();
        $value = $newid->bytes;
/*
        if (null === $value) {
            return null;
        }

        if (is_string($value)) {
            $fp = fopen('php://temp', 'rb+');
            fwrite($fp, $value);
            fseek($fp, 0);
            $value = $fp;
        }

        if ( ! is_resource($value)) {
            throw ConversionException::conversionFailed($value, self::BINARY);
        }

        return $value;

*/

        //var_dump(hex2bin(strtoupper(str_replace("-","",$newid->string))));

        return strtoupper(str_replace("-","",$newid->string));
        //return hex2bin(strtoupper(str_replace("-","",$newid->string)));
    }
}