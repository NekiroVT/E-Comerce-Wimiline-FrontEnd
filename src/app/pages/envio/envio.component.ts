import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogisticaService } from '../../services/logistica.service';
import { CarritoService } from '../../services/carrito.service';
import { MapaComponent } from '../mapa/mapa.component';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-envio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MapaComponent, GoogleMapsModule],
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.css']
})
export class EnvioComponent implements OnInit {

  modo: 'seleccion' | 'domicilio' | 'crear' | 'ver-mapa' | 'elegir-ubicacion' | 'preview' = 'seleccion';

  direcciones: any[] = [];
  direccionSeleccionadaId: string | null = null;
  direccionAMostrarEnMapa: any = null;

  formDireccion!: FormGroup;

  center: google.maps.LatLngLiteral = {
    lat: -12.046410102496333,
    lng: -77.04279187749908
  };
  markerPosition?: google.maps.LatLngLiteral;

  @ViewChild(GoogleMap) map!: GoogleMap;

  previewEnvios: any = null;     
  totalEnvio: number = 0;        

  constructor(
    private logisticaService: LogisticaService,
    private carritoService: CarritoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formDireccion = this.fb.group({
      direccion: [''],
      codigoPostal: ['', [Validators.pattern(/^\d{5}$/)]],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      referencia: [''],
      destinatario: ['']
    });
  }

  elegirDomicilio() {
    this.modo = 'domicilio';
    this.cargarDirecciones();
  }

  elegirTolva() {
    alert('🚧 Envío a tolva no disponible todavía.');
  }

  async cargarDirecciones() {
    try {
      this.direcciones = await this.logisticaService.listarDirecciones();
      console.log('📌 DIRECCIONES:', this.direcciones);
    } catch (error) {
      console.error('❌ Error al cargar direcciones:', error);
      alert('Error al cargar direcciones');
    }
  }

  nuevaDireccion() {
    this.modo = 'crear';
  }

  async guardarDireccion() {
    if (this.formDireccion.invalid) return;

    try {
      await this.logisticaService.guardarDireccion(this.formDireccion.value);
      this.formDireccion.reset();
      this.modo = 'domicilio';
      await this.cargarDirecciones();
    } catch (error) {
      console.error('❌ Error al guardar dirección:', error);
    }
  }

  async confirmarDireccion() {
  if (!this.direccionSeleccionadaId) {
    alert('Selecciona una dirección primero');
    return;
  }

  const seleccionados = this.carritoService.getSeleccionados();
  console.log('🟢 Seleccionados antes de calcular:', seleccionados);

const productoIds = seleccionados.map(item => item.productoId); // ✅ CORRECTO

  console.log('🟢 UUIDs que mando:', productoIds);

  const body = {
    'producto-ids': productoIds,
    'direccion-id': this.direccionSeleccionadaId
  };
  console.log('🟢 Body final al POST:', body);

  try {
  this.previewEnvios = await this.logisticaService.calcularEnvio(body);
  console.log('✅ Preview de envíos:', this.previewEnvios);

  // 🔑 Enriquecer: mapea los nombres legibles
  this.previewEnvios.envios.forEach((envio: any) => {
    envio.productosNombres = envio.productoIds.map((id: string) => {
      const encontrado = seleccionados.find(item => item.productoId === id);
      return encontrado ? encontrado.nombreProducto : id;
    });
  });

  console.log('✅ Preview enriquecido:', this.previewEnvios);

  this.totalEnvio = this.previewEnvios.envios.reduce(
    (acc: number, envio: any) => acc + envio.precioEnvio,
    0
  );

  this.modo = 'preview';

} catch (error) {
  console.error('❌ Error al calcular envío:', error);
}

}


  verEnMapa(dir: any) {
    this.direccionAMostrarEnMapa = dir;
    this.modo = 'ver-mapa';
  }

  volverALista() {
    this.modo = 'domicilio';
    this.direccionAMostrarEnMapa = null;
  }

  abrirSelectorUbicacion() {
    this.modo = 'elegir-ubicacion';

    const lat = this.formDireccion.value.latitud;
    const lng = this.formDireccion.value.longitud;

    if (lat && lng) {
      this.center = { lat, lng };
      this.markerPosition = { lat, lng };
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map?.panTo(this.center);
        },
        error => {
          console.warn('⚠️ No se pudo obtener ubicación real:', error);
          this.center = {
            lat: -12.046410102496333,
            lng: -77.04279187749908
          };
          this.map?.panTo(this.center);
        }
      );
    } else {
      this.center = {
        lat: -12.046410102496333,
        lng: -77.04279187749908
      };
      this.map?.panTo(this.center);
    }

    this.markerPosition = undefined;
  }

  cerrarSelectorUbicacion() {
    this.modo = 'crear';
    this.markerPosition = undefined;
  }

  marcarUbicacion(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    }
  }

  confirmarUbicacion() {
    if (!this.markerPosition) {
      alert('⚠️ Primero debes marcar un punto en el mapa');
      return;
    }

    const lat = this.markerPosition.lat;
    const lng = this.markerPosition.lng;

    let postal = '';

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const postalComp = results[0].address_components.find((c: any) =>
          c.types.includes('postal_code')
        );
        postal = postalComp ? postalComp.long_name : '';
      }

      this.formDireccion.patchValue({
        latitud: lat,
        longitud: lng,
        codigoPostal: postal
      });

      this.cerrarSelectorUbicacion();
    });
  }

  irAPagar() {
  console.log('💸 Ir a pagar: aquí lanzas el flujo de pago (PayPal, Yape, etc).');
  // Aquí dentro llamas a tu PagoService, abres el checkout, etc.
}


}
