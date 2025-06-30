import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @Input() latitud!: number;
  @Input() longitud!: number;
  @Input() direccion!: string;

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  center!: google.maps.LatLngLiteral;

  ngOnInit(): void {
    if (this.latitud === undefined || this.longitud === undefined) {
      console.error('❌ ERROR: Debes pasar latitud y longitud al <app-mapa>');
      return;
    }
    this.center = {
      lat: this.latitud,
      lng: this.longitud
    };
  }

  ngAfterViewInit(): void {
    this.infoWindow.open();
  }

  abrirInfo(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
}
