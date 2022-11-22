import { Controller, Get } from '@nestjs/common';
import { ScalingConditionsService } from './scaling-conditions.service';

@Controller('scaling-conditions')
export class ScalingConditionsController {
    constructor(private readonly scalingConditionsService: ScalingConditionsService) { }

    @Get()
    async getScalingConditions() {
        return this.scalingConditionsService.getAllScalingConditions();
    }
}
