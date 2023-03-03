export class Todo {
    id!: string
    name!: string
    userEmail!: string;
    dateTimeGenerated!: Date;
    items: Map<string, boolean> = new Map();
    dateGeneratedFormat: string = "";
    timeGeneratedFormat: string = "";
}
