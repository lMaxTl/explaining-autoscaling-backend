import { Controller, Delete, Get, Query } from '@nestjs/common';
import { EventSetService } from './event-set.service';

@Controller('set')
export class EventSetController {
    constructor(private eventSetService: EventSetService) {}

    @Get('latest')
    getLatestSet() {
        return this.eventSetService.getLatestSet();
    }

    @Get()
    getAllSets() {
        return this.eventSetService.getAllSets();
    }

    @Delete()
    deleteAllSets() {
        return this.eventSetService.deleteAllSets();
    }
}
