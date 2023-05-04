import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SearchTripModel} from "../../../core/models/trip-models/search-trip-model";
import {TripOrderBy} from "../../../core/enums/trip-order-by";
import {TripModel} from "../../../core/models/trip-models/trip-model";
import {ActivatedRoute, Router} from "@angular/router";
import {MapsService} from "../../../core/services/maps-service/maps.service";
import {ImgSanitizerService} from "../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {TripService} from "../../../core/services/trip-service/trip.service";
import {Subject, takeUntil} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";
import {GeocodingFeatureProperties} from "../../../core/models/maps-models/place-suggestion-model";
import {HttpErrorResponse} from "@angular/common/http";
import {UserPermissionsTrip} from "../../../core/enums/user-permissions-trip";
import {IonModal} from "@ionic/angular";
import {BackGroundMapService} from "../../../core/services/maps-service/back-ground-map.service";
import {BookedTripModel} from "../../../core/models/trip-models/booked-trip-model";
import {SeatModel} from "../../../core/models/car-models/seat-model";

@Component({
  selector: 'app-selected-trip',
  templateUrl: './selected-trip.component.html',
  styleUrls: ['./selected-trip.component.scss'],
})
export class SelectedTripComponent  implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() id: number | undefined;
  selectedTrip: TripModel = {} as TripModel;
  @Input() isOpen: boolean = false;
  @Input() requestedSeats: number | undefined = 0;
  userPermission = UserPermissionsTrip;
  bookedtrip: BookedTripModel = { bookedSeats: [], id: 0, requestedSeats: 1, tripId: 0 };
  tabSelected = 1;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapsService: MapsService,
    private tripService: TripService,
    private imgSanitaze: ImgSanitizerService,
    private mapsBackgroundService: BackGroundMapService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sanitizeUserImg(img: string): SafeUrl {
    return this.imgSanitaze.sanitiizeUserImg(img);
  }

  cancel() {
    this.isOpen = false;
  }

  confirmBook(): void {
    if (this.requestedSeats != this.bookedtrip.bookedSeats.length) {
      return;
    }
    this.tripService.bookSeatsInTrip(this.bookedtrip).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {


      },
      (error: HttpErrorResponse) => {  }
    )

  }

  bookSeat(seatId: number): void {
    const seat: SeatModel = { id: seatId, carId: this.selectedTrip.car.id, seatNumber: 0, tripUsers: [] }
    if (this.bookedtrip.bookedSeats.find(x => x.id == seat.id)) {
      this.bookedtrip.bookedSeats = this.bookedtrip.bookedSeats.filter(x => x.id != seatId);
      this.changeSeatStatus(seatId);
      return;
    }
    if (this.bookedtrip.bookedSeats.length == this.requestedSeats) return;
    else {
      this.bookedtrip.bookedSeats.push(seat);
      this.changeSeatStatus(seatId);
    }
  }
  changeSeatStatus(seatId: number): void {
    this.selectedTrip.car.seats.forEach(seat => {
      if (seat.id == seatId) {
        if (seat.isSelected) { seat.isSelected = false; }
        else if (!seat.isSelected) { seat.isSelected = true; }
      }
    });
  }

  cheackSeat(item: SeatModel): boolean {
    return (!this.selectedTrip.availableSeats.some(x => x.seatId == item.id)
      || this.selectedTrip.availableSeats.find(x => x.seatId == item.id)?.availableSeatsType == 1);
  }

  searchData = () => {

    if(this.id) {
      this.tripService.getTripById(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe(
        response => {
          this.getPlaces(response);
          this.selectedTrip = response;
          this.generateMap();
        },
        (error: HttpErrorResponse) => { console.log(error.error); }
      );
    }
  }

  generateMap() {
    // this.mapsBackgroundService.getCurrentPosition().then((value) => {
    //   this.mapsBackgroundService._buildPlaceSuggestionBackGroundMap.next(
    //     { buildMap: true,
    //       lat: value.coords.latitude,
    //       lon: value.coords.longitude
    //     }
    //   );
    // });
debugger;
    this.mapsBackgroundService.buildRouteMapHandler(
      {
        buildMap: true,
        fromLat: this.selectedTrip.startLat,
        formLon: this.selectedTrip.startLon,
        toLat: this.selectedTrip.endLat,
        toLon: this.selectedTrip.endLon
      });
  }

  private getPlaces(trip: TripModel) {
    let text = `${trip.startLat}%20${trip.startLon}`;
    this.mapsService.getPlaceName(text).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      const placeSuggestions = data.features.map((feature: { properties: GeocodingFeatureProperties; }) => {
        const properties: GeocodingFeatureProperties = (feature.properties as GeocodingFeatureProperties);
        return {
          shortAddress: this.mapsService.generateShortAddress(properties),
          fullAddress: this.mapsService.generateFullAddress(properties),
          data: properties
        }
      });
      trip.startPlace = placeSuggestions[0].data.formatted;
      console.log(placeSuggestions);
    }, err => {
      console.log(err);
    });
    text = `${trip.endLat}%20${trip.endLon}`;
    this.mapsService.getPlaceName(text).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any) => {
      const placeSuggestions = data.features.map((feature: { properties: GeocodingFeatureProperties; }) => {
        const properties: GeocodingFeatureProperties = (feature.properties as GeocodingFeatureProperties);
        return {
          shortAddress: this.mapsService.generateShortAddress(properties),
          fullAddress: this.mapsService.generateFullAddress(properties),
          data: properties
        }
      });
      trip.endPlace = placeSuggestions[0].data.formatted;
      console.log(placeSuggestions);
    }, err => {
      console.log(err);
    });
  }


  changeTab(tab: number): void{
    this.tabSelected = tab;
  }

}
