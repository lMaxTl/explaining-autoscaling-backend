import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { HpaService } from './hpa.service';


@Controller('hpa')
export class HpaController {
    constructor(private readonly hpaService: HpaService) { }

    @Get() 
    getAllHpaConfigurations() {
        var allHpaConfigurations = this.hpaService.getAllHpaConfigurations();
        return allHpaConfigurations;
    }
    
}
