<?php

namespace FA\AbsmanBundle\Types;

use Doctrine\DBAL\Types\Type;
use Doctrine\DBAL\Platforms\AbstractPlatform;

class UuidType extends Type
{
    const BINARY = 'binary';

    public function getSqlDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        return 'BINARY(16)';
    }

    public function getName()
    {
        return self::BINARY;
    }

    public function convertToPhpValue($value, AbstractPlatform $platform)
    {

        if ($value !== null) {
            $value= unpack('H*', $value);
            return strtoupper(array_shift($value));
        }
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        if ($value !== null) {
            return pack('H*',strtoupper(str_replace("-","",$value)));
        }
    }

}