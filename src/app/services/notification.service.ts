import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  key = environment.key;
  API = environment.routes.api;
  route = this.API + environment.routes.devices;

  constructor(
    private _http: HttpClient,
    private _device: Device,
    private _push: Push
  ) { }

  init() {
    const options: PushOptions = {
      android: {}
    }

    const pushObject: PushObject = this._push.init(options);

    pushObject.on('registration').subscribe(
      (registration) => {
        console.log(registration);
        this.saveToken(registration.registrationId);
      }
    )

    pushObject.on('notification').subscribe(
      notification => {
        console.log('notificacion', notification);
      }
    )
  }

  private saveToken(token) {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const device = {
      platform: this._device.platform,
      model: this._device.model,
      uuid: this._device.uuid,
      token
    }

    this._http.post(this.route, { device }, { headers })
      .subscribe(
        data => {
          console.log('token saved', data);
        },
        err => {
          console.log('error saving token', err);
        }
      )
  }
}
