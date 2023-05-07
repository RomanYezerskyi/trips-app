import {Component, OnInit, ViewChild} from '@angular/core';
import {GeocodingFeatureProperties} from "../../../core/models/maps-models/place-suggestion-model";
import {Subject, takeUntil} from "rxjs";
import {SearchTripModel} from "../../../core/models/trip-models/search-trip-model";
import {TripModel} from "../../../core/models/trip-models/trip-model";
import {HttpErrorResponse} from "@angular/common/http";
import {TripOrderBy} from "../../../core/enums/trip-order-by";
import {SafeUrl} from "@angular/platform-browser";
import {MapsService} from "../../../core/services/maps-service/maps.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TripService} from "../../../core/services/trip-service/trip.service";
import {ImgSanitizerService} from "../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {TripsResponseModel} from "../../../core/models/trip-models/trips-response-model";
import {IonModal} from "@ionic/angular";
import {SelectedTripModalService} from "../../../core/services/trip-service/selected-trip-modal.service";
import {CarType} from "../../../core/enums/car-type";

@Component({
  selector: 'app-trips-list',
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.scss'],
})
export class TripsListComponent  implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @ViewChild(IonModal) modal!: IonModal;
  trips: TripsResponseModel = {} as TripsResponseModel;
  trip: SearchTripModel = { orderBy: TripOrderBy.EarliestDepartureTime } as SearchTripModel;
  selectedTripId: number | undefined;
  selectedTripSeats: number | undefined;
  totalTrips: number = 0;
  private Skip: number = 0;
  private Take: number = 5;
  isTrips: boolean = true;
  isSpinner: boolean = false;
  public isFullListDisplayed: boolean = false;
  carType = CarType;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService,
    private imgSanitaze: ImgSanitizerService,
    private mapsService: MapsService,
    private selectedTripModalService: SelectedTripModalService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params['startPlace'] && params['endPlace'] && params['startTime'] && params['seats']) {
        this.trip.startPlace = params['startPlace'];
        this.trip.endPlace = params['endPlace'];
        this.trip.startTime = new Date(params['startTime']);
        this.trip.countOfSeats = params['seats'];
        this.trip.startLat = params['startLat'];
        this.trip.startLon = params['startLon'];
        this.trip.endLat = params['endLat'];
        this.trip.endLon = params['endLon'];
        this.searchTrips();
        this.isSpinner = true;
        this.selectedTripSeats = params['seats'];
      }
    });
    this.trips.trips = [];
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
  onScroll(): void {
    this.Skip += this.Take;
    if (this.Skip <= this.trips.trips.length) {
      this.searchTrips();
    }
    else {
      this.isFullListDisplayed = true;
    }
  }

  searchTrips(event?: TripOrderBy): void {
    if (event != null) {
      this.Skip = 0;
      this.Take = 5;
      this.trip.orderBy = event;
    }
    else this.isSpinner = true;
    this.trip.startTime = new Date(this.trip.startTime).toDateString();
    this.trip.skip = this.Skip;
    this.trip.take = this.Take;
    this.tripService.SearchTrip(this.trip).pipe(takeUntil(this.unsubscribe$)).subscribe(
      response => {
        this.isSpinner = false;
        if (response != null) {
          response.trips.forEach(x => { x.startLat! > 0 ? this.getPlaces(x) : x; })
          if (event != undefined) {
            this.trips.trips = response.trips;
            this.totalTrips = response.totalTrips;
          }
          else {
            this.trips.trips = this.trips.trips.concat(response.trips);
          }
          if (response.totalTrips > 0 && this.totalTrips == 0)
            this.totalTrips = response.totalTrips;
        }
        else { this.isTrips = false; }
      },
      (error: HttpErrorResponse) => { console.error(error.error); this.isSpinner = false; }
    );

  }
  private getPlaces(trip: TripModel | SearchTripModel) {
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

  confirm(): void {
    this.modal.dismiss(null, 'confirm');
  }

}
