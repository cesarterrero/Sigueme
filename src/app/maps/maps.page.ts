import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Geolocation } from '@capacitor/geolocation';

import { GoogleMapComponent } from '../components/google-map/google-map.component';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: [
    './styles/maps.page.scss'
  ]
})


export class MapsPage implements OnInit, AfterViewInit {
  @ViewChild(GoogleMapComponent, { static: false }) _GoogleMap: GoogleMapComponent;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    
    // uncomment the following line if you want to remove the default Map controls
    disableDefaultUI: true,
  };

  loadingElement: any;
  markers: google.maps.Marker[];

  constructor(private loadingController: LoadingController, public router: Router) { }

  ngOnInit(): void {
    this.markers = [];
  }

  ngAfterViewInit() {
    // GoogleMapComponent should be available
    this._GoogleMap.$mapReady.subscribe(map => {
      this.map = map;
      console.log('ngAfterViewInit - Google map ready');
    });
    this.createLoader().then(() => {
      this.geolocateMe();
    });
  }

  async createLoader() {
    this.loadingElement = await this.loadingController.create({
      message: 'Trying to get your current location...'
    });
  }

  async presentLoader() {
    await this.loadingElement.present();
  }

  async dismissLoader() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
    }
  }

  public async geolocateMe(): Promise<void> {
    await this.presentLoader();
    this.setMarker();
  }

  setMarker() {
    Geolocation.getCurrentPosition().then(position => {
      const current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.panTo(current_location);

      // add a marker
      const marker = new google.maps.Marker({
        position: current_location,
        title: 'Mi ubicacion',
        animation: google.maps.Animation.DROP,
        icon:'./assets/la-seguridad.png',
      });
      
      this.removeMarkers();
      this.markers.push(marker);
      this.markers.forEach((marker: google.maps.Marker) => {
        const { lat, lng } = marker.getPosition();
        console.log(`LAT: ${lat()}, LNG ${lng()}`);
        marker.setMap(this.map);
      });
      
    }).catch((error) => {
      console.log('Error getting current location', error);

    }).finally(() => this.dismissLoader());
  }

  removeMarkers() {
    if(this.markers) {
      this.markers.forEach((marker: google.maps.Marker) => {
        marker.setMap(null);
      });
    }
    this.markers = [];
  }

  public navigateToReport(): void {
    this.router.navigate(['forms-and-validations']);
  }
}
