import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-courseinstructor',
  templateUrl: './courseinstructor.component.html',
  styleUrls: ['./courseinstructor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CourseinstructorComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
