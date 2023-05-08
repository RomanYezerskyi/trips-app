import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {UserTripsResponseModel} from "../../../../core/models/user-models/user-trips-response-model";
import {ImgSanitizerService} from "../../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {Router} from "@angular/router";
import {TripService} from "../../../../core/services/trip-service/trip.service";
import {MapsService} from "../../../../core/services/maps-service/maps.service";
import {SafeUrl} from "@angular/platform-browser";
import {HttpErrorResponse} from "@angular/common/http";
import {TripModel} from "../../../../core/models/trip-models/trip-model";
import {GeocodingFeatureProperties} from "../../../../core/models/maps-models/place-suggestion-model";
import {CarType} from "../../../../core/enums/car-type";
import {IonModal} from "@ionic/angular";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'app-user-trips-list',
  templateUrl: './user-trips-list.component.html',
  styleUrls: ['./user-trips-list.component.scss'],
})
export class UserTripsListComponent  implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  trips: UserTripsResponseModel = { trips: [] = [], totalTrips: 0 };
  public isFullListDisplayed: boolean = false;
  totalTrips: number = 0;
  private Skip: number = 0;
  private Take: number = 5;
  isSpinner: boolean = true;
  noData = false;
  carType = CarType;
  @ViewChild(IonModal) modal!: IonModal;
  tripIdToDelete: number | undefined
  constructor(
    private imgSanitaze: ImgSanitizerService,
    private router: Router,
    private tripService: TripService,
    private mapsService: MapsService,
    private alertService: AlertService,) { }

  ngOnInit(): void {
    this.getUserTrips();

  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        if (this.tripIdToDelete) {
          this.deleteTrip(this.tripIdToDelete);
        }
      },
    },
  ];

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  sanitizeUserImg(img: string): SafeUrl {
    return this.imgSanitaze.sanitiizeUserImg(img);
  }
  getUserTrips(): void {
    if (this.Skip <= this.totalTrips) {
    this.isSpinner = true;
    this.tripService.getUserTrips(this.Take, this.Skip).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        if (response != null) {
          response.trips.forEach(
            x => {
              if (x.startLat! > 0) {
                this.getPlaces(x);
              }
            }
          )
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
  deleteUserFromTrip(userId: string, tripId: number): void {
    let tripUser = {
      userId: userId,
      tripId: tripId
    };
    this.tripService.deleteUserFromTrip(tripUser).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.trips.trips.forEach(x => {
          if (x.id == tripId) { x.bookedTripUsers = x.bookedTripUsers.filter(b => b.userId != userId); }
        });
        this.alertService.showMessage({show: true, message: "User was removed from trip!", error: false});
      },
      (error: HttpErrorResponse) => { this.alertService.showMessage({show: true, message: "Something went wrong!", error: true});}
    );
  }

  refreshList(): void {
    this.totalTrips = 0;
    this.Skip = 0;
    this.Take = 5;
    this.trips.trips = [];
    this.getUserTrips();
  }
  deleteTrip(id: number): void {
    this.tripService.deleteTrip(id).pipe().subscribe(
      response => {
        this.refreshList();
        this.alertService.showMessage({show: true, message: "Trip was canceled!", error: false});
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
