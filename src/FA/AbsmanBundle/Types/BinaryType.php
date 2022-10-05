<?php

namespace FA\AbsmanBundle\Types;

use Doctrine\DBAL\Types\Type;
use Doctrine\DBAL\Platforms\AbstractPlatform;
class BinaryType extends Type
{
    const BINARY = 'binary';

    public function getSqlDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        return sprintf('BINARY(%d)', $fieldDeclaration['length']);
    }

    public function getName()
    {
        return self::BINARY;
    }

    public function convertToPhpValue($value, AbstractPlatform $platform)
    {

        if ($value !== null) {
            $value= unpack('H*', $value->hex);
            return array_shift($value);
        }
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if ($value !== null) {
            //return strtoupper(str_replace("-","",$value->hex));
            return pack('H*',strtoupper(str_replace("-","",$value->hex)));
        }
    }

}