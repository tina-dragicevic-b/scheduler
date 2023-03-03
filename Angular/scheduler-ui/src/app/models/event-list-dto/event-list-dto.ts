export class EventListDto {
    name: string | undefined;
    description!: string;
    startTime: string | undefined;
    endTime!: string;
    startDate!: Date;
    endDate!: Date;
    fromDate!: string;
    toDate!: string;
    groupName!: string;
    icon!: string;
    color!: string;
    selectedRepetition: Array<string> = [];
    status!: string;
}
