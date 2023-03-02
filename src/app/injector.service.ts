import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Device {
  id: number;
  status: Observable<boolean>;
  temperature: Observable<number>;
  voltage: Observable<number>;
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
      temperature: new BehaviorSubject<number>(0),
      voltage: new BehaviorSubject<number>(220),
      status: new BehaviorSubject<boolean>(false)
    }

    const device2: Device = {
      id: 2,
      temperature: new BehaviorSubject<number>(0),
      voltage: new BehaviorSubject<number>(220),
      status: new BehaviorSubject<boolean>(false)
    }

    const device3: Device = {
      id: 3,
      temperature: new BehaviorSubject<number>(0),
      voltage: new BehaviorSubject<number>(220),
      status: new BehaviorSubject<boolean>(false)
    }

    //Default devices array
    this.devices = [device1, device2, device3]
    this.updateListDevicesObservable();
    this.updateDeviceValue(device3, "status", true)

    this.listDevices$.subscribe(
      res => {
        console.log("Initial subscription :", res);
      }
    )

  }



  /*
    Update list devices observable
  */
  public updateListDevicesObservable(sortAscending:Boolean = true) {
    const sortedDevices = this.devices.slice().sort((a, b) => sortAscending ? a.id - b.id : b.id - a.id);

    this.listDevices$ = combineLatest(
      sortedDevices.map(device =>
        combineLatest([
          device.status,
          device.temperature,
          device.voltage
        ]).pipe(
          map(([status, temperature, voltage]: [boolean, number, number]) => ({ id: device.id, status, temperature, voltage })),
          tap( (show:any) => console.log("Demo combine latest: ", show))
        
          )
      )
    );
  }

  /* 
    To update an observable property of any device
  */
  updateDeviceValue<T extends boolean | number>(device: Device, property: keyof Device, value: T) {
    const subject = device[property] as BehaviorSubject<T>;
    console.log(device[property])
    if (subject)
      subject.next(value);
  }

  /* 
    Add a Device
  */
  addDevice(device_id: number) {
    const newDevice: Device= {
      id: device_id,
      temperature: new BehaviorSubject<number>(0),
      voltage: new BehaviorSubject<number>(220),
      status: new BehaviorSubject<boolean>(false)
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
        const highVoltage = Math.round(Math.random()*899)
        this.updateDeviceValue(device, "voltage", highVoltage)
      }
    )
  }





}
