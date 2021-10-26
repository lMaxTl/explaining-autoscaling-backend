import { Controller, Get } from '@nestjs/common';

@Controller('set')
export class EventSetController {
    @Get('latest')
    getLatestSet() {

    }

    @Get()
    getAllSets() {

    }
}
