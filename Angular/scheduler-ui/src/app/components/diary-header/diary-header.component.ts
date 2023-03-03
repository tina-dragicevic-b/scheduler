import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-diary-header',
  templateUrl: './diary-header.component.html',
  styleUrls: ['./diary-header.component.sass']
})
export class DiaryHeaderComponent implements OnInit {
  @Output() goBack = new EventEmitter<string>();
  @Output() newDiary = new EventEmitter<string>();

  
  constructor() { }

  ngOnInit(): void {
  }

  callParentBack(): void {
    this.goBack.emit();
  }

  callParentDiary(): void {
    this.newDiary.emit();
  }
}
