import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';


interface DeviceInformation {
  status: boolean;
  temperature: number;
  voltage: number;
}

interface Device {
  id: number;
  information: BehaviorSubject<DeviceInformation>
}

@Injectable({
  providedIn: 'root'
})
export class InjectorService {

  devices: Array<Device>;
  listDevices$!: Observable<any>;
  listDevicesSubscription!: Subscription;

  constructor() {

    const device1: Device = {
      id: 1,
      information: new BehaviorSubject<DeviceInformation>({
        temperature: 0,
        voltage: 220,
        status: false
      })
    }

    const device2: Device = {
      id: 2,
      information: new BehaviorSubject<DeviceInformation>({
        temperature: 0,
        voltage: 220,
        status: false
      })
    }

    const device3: Device = {
      id: 3,
      information: new BehaviorSubject<DeviceInformation>({
        temperature: 0,
        voltage: 220,
        status: false
      })
    }

    //Default devices array
    this.devices = [device1, device2, device3]
    this.updateListDevicesObservable();
    this.updateDeviceValue(device3, { 
      temperature: 19,
      voltage: 219,
      status: true
    })

    this.listDevices$.subscribe(
      res => {
        console.log("Initial subscription :", res);
      }
    )

  }



  /*
    Update list devices observable
  */
  public updateListDevicesObservable(sortAscending: Boolean = true) {
    const sortedDevices = this.devices.slice().sort((a, b) => sortAscending ? a.id - b.id : b.id - a.id);

    this.listDevices$ = combineLatest(
      sortedDevices.map(device =>
        combineLatest([
          device.information
        ]).pipe(
          map(([information]: [DeviceInformation]) => ({ id: device.id,  information })),
          tap((show: any) => console.log("Demo combine latest: ", show))

        ) )
    );
    
  }

  /*
    ON/OFF
  */
 turnOnOff(device_id:number, device:DeviceInformation ){ 
    //Find index for id:
    let index = this.devices.findIndex( (device) => device.id === device_id)
    this.updateDeviceValue(this.devices[index],  {
      ...device, status: !device.status
    })

 }

  /* 
    To update an observable property of any device
  */
  updateDeviceValue(device: Device, value: DeviceInformation) {
    const subject = device["information"] as BehaviorSubject<DeviceInformation>;
 
    if (subject)
      subject.next(value);
  }

  /* 
    Add a Device
  */
  addDevice(device_id: number) {
    const newDevice: Device = {
      id: device_id,
      information: new BehaviorSubject<DeviceInformation>({
        temperature: 0,
        voltage: 220,
        status: false
      })

    }
    this.devices.push(newDevice);
    this.updateListDevicesObservable();
    this.manageSubscription();
  }


  /*
    Checks subscription/unsubscribe
  */
  manageSubscription() {
    //If subscription exists unsubs
    if (this.listDevicesSubscription) {
      this.listDevicesSubscription.unsubscribe();
    }

    //Subs with added new device
    this.listDevicesSubscription = this.listDevices$.subscribe(devices => {
      console.log("All devices printout: (subscription)", devices);
    });
  }



  /*
    Adds random overvoltage to every one of the devices successively
  */
  stressTest() {
    this.devices.forEach(
      device => {
        const highVoltage = Math.round(Math.random() * 899)
        this.updateDeviceValue(device, {
          temperature: 0, 
          status: true,
          voltage: highVoltage
        })
      }
    )
  }





}
