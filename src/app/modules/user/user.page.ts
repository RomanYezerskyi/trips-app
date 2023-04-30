import { Component, OnInit } from '@angular/core';
import {SearchTripModel} from "../../core/models/trip-models/search-trip-model";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  trip: SearchTripModel = { countOfSeats: 1 } as SearchTripModel;
  constructor() { }

  ngOnInit() {
  }

}
