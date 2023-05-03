import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlaceSuggestionModel} from "../../../core/models/maps-models/place-suggestion-model";
import {TripOrderBy} from "../../../core/enums/trip-order-by";
import {SearchTripModel} from "../../../core/models/trip-models/search-trip-model";
import {Router} from "@angular/router";
import {IonModal, RangeCustomEvent} from "@ionic/angular";

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent  implements OnInit {
  @Input() trip: SearchTripModel = { countOfSeats: 1, startTime: new Date().toString() } as SearchTripModel;
  @ViewChild(IonModal) modal!: IonModal;
  dateNow: string = new Date().toISOString();
  counterActive: boolean = false;
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }
  counterAcive(): void {
    this.counterActive = !this.counterActive;
  }
  counterAdd(): void {
    if (this.trip.countOfSeats == 8) return;
    this.trip.countOfSeats = +this.trip.countOfSeats + 1;
  }
  counterRemove(): void {
    if (this.trip.countOfSeats == 1) return;
    this.trip.countOfSeats = +this.trip.countOfSeats - 1;
  }
  search(): void {
    this.router.navigate(['/user/search'], {
      queryParams: {
        startPlace: this.trip.startPlace,
        endPlace: this.trip.endPlace,
        startTime: this.trip.startTime,
        seats: this.trip.countOfSeats,
        orderBy: TripOrderBy.EarliestDepartureTime,
        startLat: this.trip.startLat,
        startLon: this.trip.startLon,
        endLat: this.trip.endLat,
        endLon: this.trip.endLon
      }
    });
  }
  startPlaceChanged(value: PlaceSuggestionModel) {
    this.trip.startLat = value.data.lat;
    this.trip.startLon = value.data.lon;
    this.trip.startPlace = value.data.formatted
  }
  endPlaceChanged(value: PlaceSuggestionModel) {
    this.trip.endLat = value.data.lat;
    this.trip.endLon = value.data.lon;
    this.trip.endPlace = value.data.formatted
  }

  pinFormatter(value: number): string {
    return `${value}`;
  }

  onRangeChange(ev: Event): void {
    this.trip.countOfSeats = +(ev as RangeCustomEvent).detail.value.toString();
  }

  onDateChange(ev: Event): void {
    this.trip.startTime = (ev as RangeCustomEvent).detail.value.toString();
  }

  confirm(): void {
    this.modal.dismiss(null, 'confirm');
  }

}
