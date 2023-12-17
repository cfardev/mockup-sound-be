import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prismaHandleError } from '../../prisma/utils/prisma-handle-error';

export function CRUDPrismaCatchError(error: any, logger: Logger) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    prismaHandleError(error);
  } else {
    switch (error.status) {
      case 403:
        throw new ForbiddenException(error.message);
      case 404:
        throw new NotFoundException(error.message);
      default:
        logger.error(error.message);
        throw new InternalServerErrorException(error.message);
    }
  }
}
