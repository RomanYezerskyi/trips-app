import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-current-trips',
  templateUrl: './current-trips.component.html',
  styleUrls: ['./current-trips.component.scss'],
})
export class CurrentTripsComponent  implements OnInit {
  @Input() tabSelected = 1;
  constructor() { }

  ngOnInit() {}
  changeTab(tab: number): void{
    this.tabSelected = tab;
  }

}
