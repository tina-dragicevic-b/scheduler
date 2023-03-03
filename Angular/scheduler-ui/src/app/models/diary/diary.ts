export class Diary {
    id!: string;
    dateTimeGenerated!: Date;
    dateTimeModified!: Date;
    text!: string;
    displayDiaryDiv!: boolean;
    dateGeneratedFormat: string = "";
    timeGeneratedFormat: string = "";
    dateModifiedFormat: string = "";
    timeModifiedFormat: string = "";
}
