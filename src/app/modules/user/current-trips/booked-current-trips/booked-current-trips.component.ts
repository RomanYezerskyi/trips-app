import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TripService} from "../../../../core/services/trip-service/trip.service";
import {Router} from "@angular/router";
import {ImgSanitizerService} from "../../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {MapsService} from "../../../../core/services/maps-service/maps.service";
import {AlertService} from "../../../../core/services/alert.service";
import {Subject, takeUntil} from "rxjs";
import {TripsResponseModel} from "../../../../core/models/trip-models/trips-response-model";
import {CarType} from "../../../../core/enums/car-type";
import {IonModal} from "@ionic/angular";
import {TripModel} from "../../../../core/models/trip-models/trip-model";
import {SafeUrl} from "@angular/platform-browser";
import {HttpErrorResponse} from "@angular/common/http";
import {TripUserModel} from "../../../../core/models/trip-models/trip-user-model";
import {GeocodingFeatureProperties} from "../../../../core/models/maps-models/place-suggestion-model";
import {SelectedTripModalService} from "../../../../core/services/trip-service/selected-trip-modal.service";

@Component({
  selector: 'app-booked-current-trips',
  templateUrl: './booked-current-trips.component.html',
  styleUrls: ['./booked-current-trips.component.scss'],
})
export class BookedCurrentTripsComponent  implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  trips: TripsResponseModel = {totalTrips: 0, trips: [] = []};
  public isFullListDisplayed: boolean = false;
  totalTrips!: number;
  private Skip!: number;
  private Take!: number;
  isSpinner: boolean = false;
  noData = false;
  carType = CarType;
  selectedTripId: number | undefined;
  constructor(
    private tripService: TripService,
    private router: Router,
    private imgSanitaze: ImgSanitizerService,
    private mapsService: MapsService,
    private alertService: AlertService,
    private selectedTripModalService: SelectedTripModalService) {
  }

  ngOnInit(): void {
    this.totalTrips = 0;
    this.Skip = 0;
    this.Take = 5;
    this.getUserBookedStartedTrips();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  navigateToTripPage(id: number): void {
    const trip = this.trips.trips.find(x=>x.id == id);
    if (trip) {
      this.selectedTripId = trip.id;
      this.selectedTripModalService._modalOpened.next(true);
    }
  }

  sanitizeUserImg(img: string): SafeUrl {
    return this.imgSanitaze.sanitiizeUserImg(img);
  }

  getUserBookedStartedTrips(): void {
    if (this.Skip <= this.totalTrips) {
      this.isSpinner = true;
      this.tripService.getUserStartedBookedTrips(this.Take, this.Skip).pipe(takeUntil(this.unsubscribe$)).subscribe(
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
          } else {
            if (this.totalTrips == 0) this.noData = true;
          }
          this.isSpinner = false;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this.isSpinner = false;
        }
      );
    } else {
      this.isFullListDisplayed = true;
    }
    this.Skip += this.Take;
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
