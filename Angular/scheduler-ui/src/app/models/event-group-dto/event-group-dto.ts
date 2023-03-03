import { Event } from "../event";
import { Group } from "../group/group";

export class EventGroupDto {
    groupName!: string;
    group!: Group;
    eventList: Event[] = [];
}
