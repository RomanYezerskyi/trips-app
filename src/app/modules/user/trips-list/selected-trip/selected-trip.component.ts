import {Component, Input, OnInit} from '@angular/core';
import {SearchTripModel} from "../../../../core/models/trip-models/search-trip-model";
import {TripOrderBy} from "../../../../core/enums/trip-order-by";

@Component({
  selector: 'app-selected-trip',
  templateUrl: './selected-trip.component.html',
  styleUrls: ['./selected-trip.component.scss'],
})
export class SelectedTripComponent  implements OnInit {
  @Input() trip: SearchTripModel = { orderBy: TripOrderBy.EarliestDepartureTime } as SearchTripModel;
  constructor() { }

  ngOnInit() {}

}
