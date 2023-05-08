import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GeocodingFeatureProperties} from "../../../../core/models/maps-models/place-suggestion-model";
import {Subject, takeUntil} from "rxjs";
import {TripModel} from "../../../../core/models/trip-models/trip-model";
import {HttpErrorResponse} from "@angular/common/http";
import {TripUserModel} from "../../../../core/models/trip-models/trip-user-model";
import {SafeUrl} from "@angular/platform-browser";
import {MapsService} from "../../../../core/services/maps-service/maps.service";
import {ImgSanitizerService} from "../../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {Router} from "@angular/router";
import {TripService} from "../../../../core/services/trip-service/trip.service";
import {TripsResponseModel} from "../../../../core/models/trip-models/trips-response-model";
import {CarType} from "../../../../core/enums/car-type";
import {IonModal} from "@ionic/angular";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'app-booked-trips-list',
  templateUrl: './booked-trips-list.component.html',
  styleUrls: ['./booked-trips-list.component.scss'],
})
export class BookedTripsListComponent  implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  trips: TripsResponseModel = { totalTrips: 0, trips: [] = [] };
  public isFullListDisplayed: boolean = false;
  totalTrips!: number;
  private Skip!: number;
  private Take!: number;
  isSpinner: boolean = false;
  noData = false;
  carType = CarType;
  @ViewChild(IonModal) modal!: IonModal;
  tripToDelete: TripModel | undefined
  constructor(
              private tripService: TripService,
              private router: Router,
              private imgSanitaze: ImgSanitizerService,
               private mapsService: MapsService,
              private alertService: AlertService,) { }

  ngOnInit(): void {
    this.totalTrips = 0;
    this.Skip = 0;
    this.Take = 5;
    this.getUserBookedTrips();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        if (this.tripToDelete) {
          this.deleteBookedTrip(this.tripToDelete);
        }
      },
    },
  ]

  sanitizeUserImg(img: string): SafeUrl {
    return this.imgSanitaze.sanitiizeUserImg(img);
  }

  getUserBookedTrips(): void {
    if (this.Skip <= this.totalTrips) {
      this.isSpinner = true;
      this.tripService.getUserBookedTrips(this.Take, this.Skip).pipe(takeUntil(this.unsubscribe$)).subscribe(
        response => {
          if (response != null) {
            response.trips.forEach(
              x => {
                if (x.startLat! > 0) {
                  this.getPlaces(x);
                }
              });
            this.trips.trips = this.trips.trips.concat(response.trips);
            if (this.totalTrips == 0)
              this.totalTrips = response.totalTrips!;

            this.noData = false;
          }
          else {
            if (this.totalTrips == 0) this.noData = true;
          }
          this.isSpinner = false;
        },
        (error: HttpErrorResponse) => { console.log(error.error); this.isSpinner = false; }
      );
    }
    else {
      this.isFullListDisplayed = true;
    }
    this.Skip += this.Take;
  }
  deleteBookedTrip(trip: TripModel): void {
    this.tripService.deleteBookedTrip(trip).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.trips.trips = this.trips.trips.filter(x => x.id != trip.id);
        this.alertService.showMessage({show: true, message: "Booking was canceled!", error: false});
      },
      (error: HttpErrorResponse) => { this.alertService.showMessage({show: true, message: "Something went wrong!", error: true});}
    );
  }
  deleteBookedSeat(tripUser: TripUserModel): void {
    this.tripService.deleteBookedSeat(tripUser).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.trips.trips.forEach(
          x => { x.tripUsers = x.tripUsers.filter(t => t.seatId != tripUser.seatId) }
        );
        this.alertService.showMessage({show: true, message: "Seat reservation was canceled!", error: false});
      },
      (error: HttpErrorResponse) => { this.alertService.showMessage({show: true, message: "Something went wrong!", error: true}); }
    );
  }
  isTripCompleted(endDate: Date): boolean {
    if (new Date(endDate) < new Date()) return true;
    return false
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
      trip.startPlace = placeSuggestions[0].data.city;
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
      trip.endPlace = placeSuggestions[0].data.city;

    }, err => {
      console.log(err);
    });
  }
}
