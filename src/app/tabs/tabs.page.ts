import { Component } from '@angular/core';
import { ActionService } from '../services/user/action.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private userService: ActionService) { }

  async loadTab2() {
    this.userService.datas.length = 0
    await this.userService.getUserProfile()
  }

}
