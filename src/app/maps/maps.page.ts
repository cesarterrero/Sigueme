import { Component, ViewChild, AfterViewInit } from '@angular/core';
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


export class MapsPage implements AfterViewInit {

  

  @ViewChild(GoogleMapComponent, { static: false }) _GoogleMap: GoogleMapComponent;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    
    // uncomment the following line if you want to remove the default Map controls
    disableDefaultUI: true,
    
    
    
  };

  
  loadingElement: any;

  constructor(private loadingController: LoadingController, public router: Router) { }

  ngAfterViewInit() {
    // GoogleMapComponent should be available
    this._GoogleMap.$mapReady.subscribe(map => {
      this.map = map;
      console.log('ngAfterViewInit - Google map ready');
    });
    this.createLoader();
    this.geolocateMe();
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

  public geolocateMe(): void {
    
    this.presentLoader();
    let borrarmarcador = new google.maps.Marker();
    borrarmarcador.setMap(null);
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
      
      
      marker.setMap(this.map);
      

    }).catch((error) => {
      console.log('Error getting current location', error);

    }).finally(() => this.dismissLoader());
  }

  public navigateToReport(): void {
    this.router.navigate(['forms-and-validations']);
  }
}
