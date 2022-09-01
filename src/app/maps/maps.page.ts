import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController, Animation, AnimationController } from '@ionic/angular';
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
  private directions: google.maps.DirectionsService;
  private renderer: google.maps.DirectionsRenderer;

  private truck_route_points: Array<google.maps.LatLng> = [
    new google.maps.LatLng(18.495651, -69.851559),
    new google.maps.LatLng(18.495108, -69.851392),
    new google.maps.LatLng(18.494476, -69.851202),
    new google.maps.LatLng(18.493866, -69.851059),
    new google.maps.LatLng(18.493414, -69.850868),
    new google.maps.LatLng(18.492691, -69.850654),
    new google.maps.LatLng(18.492194, -69.850558),
    new google.maps.LatLng(18.491460, -69.850249),
    new google.maps.LatLng(18.490669, -69.850070),
  ];

  @ViewChild(GoogleMapComponent, { static: false }) _GoogleMap: GoogleMapComponent;
  map: google.maps.Map;
  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    
    // uncomment the following line if you want to remove the default Map controls
    disableDefaultUI: true,
  };

  loadingElement: any;
  markers: google.maps.Marker[];

  constructor(private loadingController: LoadingController, public router: Router, private animationCtrl: AnimationController) { }

  ngOnInit(): void {
    this.markers = [];
  }

  ngAfterViewInit() {
    // GoogleMapComponent should be available
    this._GoogleMap.$mapReady.subscribe(map => {
      this.map = map;
      console.log('ngAfterViewInit - Google map ready');
    });
    this.removeAllMarkers();

    this.setupDirections();
    this.createLoader().then(() => {
      this.geolocateMe();
    });
  }

  setupDirections() {
    this.directions = new google.maps.DirectionsService();
    this.renderer = new google.maps.DirectionsRenderer();
    this.renderer.setMap(this.map);
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
    this.showMyLocation();
    this.dismissLoader();
  }

  public navigateToReport(): void {
    this.router.navigate(['forms-and-validations']);
  }

  async showMyLocation() {
    try {
      var position = await Geolocation.getCurrentPosition();
      const current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.panTo(current_location);

      const marker = this.createMarker(current_location, './assets/la-seguridad.png', 'Mi ubicacion');
      this.removeMarker(marker);
      this.setMarker(marker);
    }
    catch(error) {
      console.log('Error getting current location', error);
    }
  }

  private createMarker(
    position: google.maps.LatLng, 
    icon: string, 
    title: string = '', 
    animation: google.maps.Animation = google.maps.Animation.DROP) {
    return new google.maps.Marker({ position, title, animation, icon });
  }

  public async showtruck(){
    const truck_location = new google.maps.LatLng(18.501565, -69.824515);
    const truck = this.createMarker(truck_location, './assets/garbage-truck (1).png', 'Recolector de basura');
    
    var found = this.findMarkerByTitle("Recolector de basura");

    if(found) {
      this.removeMarker(found);
      return;
    }

    this.setMarker(truck);
    
    var myMarker = this.findMarkerByTitle('Mi ubicacion');
    // this.drawRoute(truck.getPosition(), myMarker.getPosition());
    await this.animateTruck(truck);
  }

  private async animateTruck(truck: google.maps.Marker) {
    for(let i = 0; i < this.truck_route_points.length; i++) {
      truck.setPosition(this.truck_route_points[i]);
      await this.wait(800);
    };
  }

  wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  calculateWaypoints(start: google.maps.LatLng, end: google.maps.LatLng): google.maps.DirectionsWaypoint[] {
    const waypoints: google.maps.DirectionsWaypoint[] = [];
    waypoints.push({ location: start, stopover: false });
    waypoints.push({ location: end, stopover: false });
    return waypoints;
  }

  findMarkerByTitle(title: string) {
    return this.markers.find((marker: google.maps.Marker) => marker.getTitle() === title);
  }

  findMarkerIndexByTitle(title: string) {
    return this.markers.findIndex((marker: google.maps.Marker) => marker.getTitle() === title);
  }

  removeMarker(marker: google.maps.Marker) {
    var index = this.findMarkerIndexByTitle(marker.getTitle());
    this.markers.splice(index, 1);
    marker.setMap(null);
  }

  removeAllMarkers() {
    if(this.markers) {
      this.markers.forEach((marker: google.maps.Marker) => {
        this.removeMarker(marker);
      });
    }
  }

  public setMarker(marker: google.maps.Marker){
    this.markers.push(marker);
    marker.setMap(this.map);
  }

  public setAllMarkers() {
    this.markers.forEach((marker: google.maps.Marker) => {
      marker.setMap(this.map);
    });
  }

  public drawRoute(start: google.maps.LatLng, end: google.maps.LatLng) {
    var waypoints = this.calculateWaypoints(start, end);

    var request: google.maps.DirectionsRequest = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directions.route(request, function(response, status) {
      if(status == google.maps.DirectionsStatus.OK) {
        this.renderer.setDirections(response);
      }
    });
  }
}
