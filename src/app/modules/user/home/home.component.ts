import { Component, OnInit } from '@angular/core';
import {SearchTripModel} from "../../../core/models/trip-models/search-trip-model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {
  trip: SearchTripModel = { countOfSeats: 1 } as SearchTripModel;
  constructor() { }

  ngOnInit() {}

}
