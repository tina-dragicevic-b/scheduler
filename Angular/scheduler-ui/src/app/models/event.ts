import { Repetition } from "./enum/repetition";
import { Weekdays } from "./enum/weekdays";
import { Group } from "./group/group";

export class Event {
    id!: string;
    name: string | undefined;
    description!: string;
    startTime: string | undefined;
    endTime!: string;
    startDate!: Date;
    endDate!: Date;
    fromDate!: string;
    toDate!: string;
    group!: Group;
    selectedRepetition: Array<string> = [];
    weekDays: Weekdays[] = [];
    status!: string;
    repetition!: Repetition

    constructor(){}
}