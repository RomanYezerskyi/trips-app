import { Component, OnInit } from '@angular/core';
import {TripService} from "../../../../core/services/trip-service/trip.service";
import {Router} from "@angular/router";
import {ImgSanitizerService} from "../../../../core/services/image-sanitizer-service/img-sanitizer.service";
import {MapsService} from "../../../../core/services/maps-service/maps.service";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'app-my-current-trips',
  templateUrl: './my-current-trips.component.html',
  styleUrls: ['./my-current-trips.component.scss'],
})
export class MyCurrentTripsComponent  implements OnInit {

  constructor(
    private tripService: TripService,
    private router: Router,
    private imgSanitaze: ImgSanitizerService,
    private mapsService: MapsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {}

}
