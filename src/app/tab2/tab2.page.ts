import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { throws } from 'assert';
import { AuthService } from '../services/auth.service';
import { ActionService, Incident } from '../services/user/action.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnChanges {
  profile: any = null;
  users: string = '';
  Arrays: any = [];
  isModalOpen = false;
  id!: string;

  titleUpdate = new FormControl();
  detailsUpdate = new FormControl();
  categoriesUpdate = new FormControl();

  constructor(
    private userService: ActionService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes) this.users = this.authService.users;
  }
  setOpen(isOpen: boolean, id?: string) {
    this.isModalOpen = isOpen;
    this.id = id!;
  }

  setData() {
    this.users = this.authService.users;
    console.log(this.users);
  }
  async logout() {
    await this.authService.logout().then(() => {
      this.users = this.authService.users;
    });
  }

  async load() {
    this.Arrays.lenght = 0;
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.getUserProfile().then(() => {
      this.Arrays = this.userService.datas;
      console.log(this.users);
    });
    await loading.dismiss();
  }

  async updateData(title: string, details: string, categories: string) {
    const updateDetail: Incident = {
      title: title,
      details: details,
      categories: categories,
    };
    console.log(updateDetail);
    await this.userService.update(updateDetail, this.id);
    await this.load();
  }

  async deleteData(id: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.delete(id);
    await this.load();
    await loading.dismiss();
  }
}
