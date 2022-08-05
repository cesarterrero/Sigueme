import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { ReportCrudService } from './report-crud.service';
import { ImageCrudService } from './image-crud.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms-validations-page',
  templateUrl: './forms-validations.page.html',
  styleUrls: [
    './styles/forms-validations.page.scss'
  ]
})



export class FormsValidationsPage implements OnInit {
  validationsForm: FormGroup;

  validations = {
    'id': [{ type: 'required', message: 'El número de reporte es requerido.' }],
    'date': [{ type: 'required', message: 'La fecha es requerida.' }],
    'email': [
      { type: 'required', message: 'El correo es requerido.' },
      { type: 'pattern', message: 'Ingrese un correo válido' }
    ],
    'address': [
      { type: 'required', message: 'La dirección es requerida.' }
    ],
    'image': [{ type: 'required', message: 'El correo es requerido.' }]
  };

  constructor(private platform: Platform, private reportService: ReportCrudService, private imageService: ImageCrudService, public router: Router) { }

  ngOnInit(): void {
    const sequence = this.getRandomInt();
    const id = `REP-${sequence}`;
    const date = new Date().toLocaleDateString("en-us");

    this.validationsForm = new FormGroup({
      'id': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'address': new FormControl('', Validators.required),
      'image': new FormControl('', Validators.required),
    });

    this.validationsForm.patchValue({
      id: id,
      date: date
    });
  }
  
  getRandomInt() {
    return Math.floor(Math.random() * 10000000);
  }

  async addPhotoToGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if(image) {
      this.setImageToForm(image);
    }
  }

  async setImageToForm(image: Photo) {
    this.validationsForm.patchValue({
      image: image
    });
  }

  async saveImage(image: Photo, id: string) {
    var base64: string = image.base64String;
    //@ts-ignore
    this.imageService.createImage({ id, base64 });
  }

  onSubmit(values) {
    // this.saveImage(values.image, values.id);
    this.reportService.createReport(values);
    this.router.navigate(['maps']);
  }
}
