import { Controller, Delete, Get, Query } from '@nestjs/common';
import { EventSetService } from './event-set.service';

@Controller('set')
export class EventSetController {
    constructor(private eventSetService: EventSetService) {}

    @Get('latest')
    getLatestSet(@Query('name')name :string,
    @Query('namespace') namespace: string) {
        return this.eventSetService.getLatestSet(name, namespace);
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
