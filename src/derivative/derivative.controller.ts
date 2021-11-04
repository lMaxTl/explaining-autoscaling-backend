import { Controller, Get, Query } from '@nestjs/common';
import { DerivativeService } from './derivative.service';

@Controller('derivative')
export class DerivativeController {
    constructor(private derivativeService : DerivativeService) {}

    @Get()
    calculateDerivative(@Query('name')name :string, @Query('namespace')namespace :string, @Query('firstEvent')firstEvent: number, @Query('lastEvent')lastEvent: number) {
        return this.derivativeService.calculateDerivative(name, namespace, firstEvent, lastEvent);
    }
}
