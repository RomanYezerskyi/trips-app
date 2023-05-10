import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {RangeCustomEvent} from "@ionic/angular";
import {BackGroundMapService} from "../../../core/services/maps-service/back-ground-map.service";
import {BookedTripModel} from "../../../core/models/trip-models/booked-trip-model";
import {SeatModel} from "../../../core/models/car-models/seat-model";
import {CarType} from "../../../core/enums/car-type";
import {SelectedTripModalService} from "../../../core/services/trip-service/selected-trip-modal.service";
import * as L from "leaflet";
import 'leaflet-routing-machine';
import {AvailableSeatsType} from "../../../core/enums/available-seats-type";
import {AlertService} from "../../../core/services/alert.service";

@Component({
  selector: 'app-selected-trip',
  templateUrl: './selected-trip.component.html',
  styleUrls: ['./selected-trip.component.scss'],
})
export class SelectedTripComponent  implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() isTrackerMode: boolean  = false;
  @Input() id: number | undefined;
  selectedTrip: TripModel = {} as TripModel;
  @Input() isOpen: boolean = false;
  @Input() requestedSeats: number | undefined = 0;
  userPermission = UserPermissionsTrip;
  bookedtrip: BookedTripModel = { bookedSeats: [], id: 0, requestedSeats: 1, tripId: 0 };
  countOfBookedSeats: number = this.requestedSeats ?? 1;
  @Input() tabSelected = 1;
  carType = CarType;
  distance: number = 0;
  time: string = "";
  @Input() isDriver: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapsService: MapsService,
    private tripService: TripService,
    private imgSanitaze: ImgSanitizerService,
    private mapsBackgroundService: BackGroundMapService,
    private selectedTripModalService: SelectedTripModalService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params['seats']) {
        this.requestedSeats = params['seats'];
        this.countOfBookedSeats = params['seats'];
      }
    });

    this.selectedTripModalService._modalOpened.subscribe(value => {
      this.isOpen = value;
    });
    this.mapsBackgroundService._tripDistance.subscribe(value => {
      this.distance = value.distance;
      this.time = (value.time / 3600).toString().split(".")[0] + "h "  + Math.round(value.time % 3600 / 60) + "min";
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sanitizeUserImg(img: string): SafeUrl {
    return this.imgSanitaze.sanitiizeUserImg(img);
  }

  cancel() {
    this.selectedTripModalService._modalOpened.next(false);
    this.isOpen = false;
    this.tabSelected = this.isTrackerMode ? 3 : 1;
  }

  onRangeChange(ev: Event): void {
    this.countOfBookedSeats = +(ev as RangeCustomEvent).detail.value.toString();
  }

  pinFormatter(value: number): string {
    return `${value}`;
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
        this.confirmBook();
      },
    },
  ];

  confirmBook(): void {
    this.bookedtrip.tripId = this.selectedTrip.id;
    if(this.selectedTrip.car.carType === CarType.Sedan && this.countOfBookedSeats > 0) {
      const seats: SeatModel[] = [];
      const availableSeats = this.selectedTrip.availableSeats.filter(x=>x.availableSeatsType === AvailableSeatsType.Free);
      for (let i = 0; i < this.countOfBookedSeats; i++){
        seats.push({
          isSelected: true,
          id: availableSeats[i]?.id,
          seatNumber: 0,
          tripUsers:[],
          carId: this.selectedTrip.car.id})
      }

      this.bookedtrip.bookedSeats = seats;

      this.bookedtrip.requestedSeats = this.countOfBookedSeats;

      this.tripService.bookSeatsInTrip(this.bookedtrip).pipe(takeUntil(this.unsubscribe$)).subscribe(
        response => {
          this.alertService.showMessage({show: true, message: "Booking confirmed! Check your email!", error: false});
        },
        (error: HttpErrorResponse) => {
          this.alertService.showMessage({show: true, message: "Something went wrong", error: true});
        }
      );
    } else if (this.selectedTrip.car.carType === CarType.Bus) {
      if (this.requestedSeats != this.bookedtrip.bookedSeats.length) {
        this.alertService.showMessage({show: true, message: "Please select seats!", error: true});
        return;
      }
      this.bookedtrip.tripId = this.selectedTrip.id;
      this.bookedtrip.requestedSeats = this.requestedSeats;
      this.tripService.bookSeatsInTrip(this.bookedtrip).pipe(takeUntil(this.unsubscribe$)).subscribe(
        response => {
          this.alertService.showMessage({show: true, message: "Booking confirmed! Check your email!", error: false});
        },
        (error: HttpErrorResponse) => {
          this.alertService.showMessage({show: true, message: "Something went wrong", error: true});
        }
      );
    } else {
      this.alertService.showMessage({show: true, message: "Please select seats!", error: true});
    }
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

  getAvailableSeatsCount(): number {
    return this.selectedTrip.availableSeats.filter(x=>x.availableSeatsType === 0)?.length;
  }

  getBookedSeatsCount(): number {
    return this.selectedTrip.availableSeats.filter(x=>x.availableSeatsType === 1)?.length;
  }

  searchData = () => {
    if(this.id) {
      this.tripService.getTripById(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe(
        response => {
          this.getPlaces(response);
          this.selectedTrip = response;
          this.generateMap();

          if (response.startLat && response.startLon && response.endLat && response.endLon) {
            const map: L.Map = this.mapsBackgroundService.buildMap(response.startLat, response.endLon, 10, "default");

            this.mapsBackgroundService.getRouteData(
              response.startLat,
              response.startLon,
              response.endLat,
              response.endLon,
              map
             );

          }

        },
        (error: HttpErrorResponse) => { console.log(error.error); }
      );
    }
  }

  generateMap() {
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
