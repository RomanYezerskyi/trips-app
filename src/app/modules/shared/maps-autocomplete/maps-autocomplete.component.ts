import {Component, Output, EventEmitter, OnDestroy, OnInit, Input, ViewChild} from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MapsService } from 'src/app/core/services/maps-service/maps.service';
import { GeocodingFeatureProperties, PlaceSuggestionModel } from 'src/app/core/models/autocomplete-models/place-suggestion-model';
import {IonModal} from "@ionic/angular";

@Component({
  selector: 'app-maps-autocomplete',
  templateUrl: './maps-autocomplete.component.html',
  styleUrls: ['./maps-autocomplete.component.scss']
})
export class MapsAutocompleteComponent implements OnInit, OnDestroy {
  @Input() place: string = '';
  @Input() label: string = '';
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Output() locationChange: EventEmitter<PlaceSuggestionModel> = new EventEmitter<PlaceSuggestionModel>();
  searchOptions: Subject<PlaceSuggestionModel[]> = new Subject<PlaceSuggestionModel[]>();
  inputFieldFormControl: FormControl = new FormControl();

  private choosenOption!: PlaceSuggestionModel;

  private userInputTimeout!: number;
  constructor(private mapsService: MapsService) {
    this.inputFieldFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (this.userInputTimeout) {
        window.clearTimeout(this.userInputTimeout);
      }

      if (this.choosenOption && this.choosenOption.shortAddress === value) {
        this.searchOptions.next([]);
        return;
      }

      if (!value || value.length < 3) {
        // do not need suggestions until for less than 3 letters
        this.searchOptions.next([]);
        return;
      }

      this.userInputTimeout = window.setTimeout(() => {
        this.generateSuggestions(value);
      }, 300);
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private generateSuggestions(text: string) {
    console.log("aaa")
    this.mapsService.getPlace(text).pipe(takeUntil(this.unsubscribe$)).subscribe((data: any /*GeoJSON.FeatureCollection*/) => {
      const placeSuggestions = data.features.map((feature: { properties: GeocodingFeatureProperties; }) => {
        const properties: GeocodingFeatureProperties = (feature.properties as GeocodingFeatureProperties);

        return {
          shortAddress: this.mapsService.generateShortAddress(properties),
          fullAddress: this.mapsService.generateFullAddress(properties),
          data: properties
        }
      });

      this.searchOptions.next(placeSuggestions.length ? placeSuggestions : null);
    }, err => {
      console.log(err);
    });

  }

  public optionSelectionChange(option: PlaceSuggestionModel, event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.choosenOption = option;
      this.locationChange.emit(option);
    }
  }

  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
}
