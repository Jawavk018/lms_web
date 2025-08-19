import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {

  @Input() breadcrumbTitle: string | undefined;
  @Input() breadcrumbSubTitle: string | undefined;

  
  constructor() { }

  ngOnInit(): void {
  }

}
