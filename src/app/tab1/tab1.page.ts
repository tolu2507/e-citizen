import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ActionService, Incident } from '../services/user/action.service';
import { Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getEnabledCategories } from 'trace_events';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  credentials!: FormGroup;
  user!: string;
  profile: any = null;
  image!: any;

  setUser: boolean = true;

  title = new FormControl();
  details = new FormControl();
  categories = new FormControl();

  constructor(
    private fb: FormBuilder,

    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private userService: ActionService
  ) {}
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }
  async Upload(name: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.userService.uploadImage(image, name);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        this.image = result;
      }
    }
  }
  async create(title: string, details: string, categories: string) {
    if (
      categories === 'incident' ||
      categories === 'occassion' ||
      categories === 'trends'
    ) {
      const loading = await this.loadingController.create();
      await loading.present();
      const incident: Incident = {
        title: title,
        details: details,
        categories: categories,
        imgUrl: this.image,
      };

      const user = await this.userService.create(incident);
      await loading.dismiss();
      if (user) {
        console.log(user);
        this.userService.getUserProfile();
      }
    } else {
      throw new Error(
        'invalid categories enter categories between incident, occassion or trends'
      );
    }
  }

  async googleSignin() {
    await this.authService
      .google()
      .then(() => {
        this.user = this.authService.users;
        this.showAlert('loggedin', 'successfully logged in, Welcome back.');
      })
      .catch((e) => {
        this.showAlert('Login failed', 'Please try again!');
        this.setUser = false;
      });
  }
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (user) {
      console.log(user);
      this.showAlert('Register', 'successfully registered');
      this.setUser = true;
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      console.log(user);
      this.user = this.authService.users;
      this.showAlert(user, 'successfully logged in, Welcome back.');
    } else {
      this.showAlert('Login failed', 'Please try again!');
      this.setUser = false;
    }
  }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
