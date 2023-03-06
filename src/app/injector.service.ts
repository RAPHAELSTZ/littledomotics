import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription, of, observable, merge, from } from 'rxjs';
import { map, tap, mergeMap, switchMap, concatMap } from 'rxjs/operators';


interface DeviceInformation {
  name: string;
  status: boolean;
  temperature: number;
  voltage: number;
}

interface Device {
  id: number;
  information: BehaviorSubject<DeviceInformation>
}

interface Device2 {
  id: string;
  information: BehaviorSubject<{ value: number }>;
}



@Injectable({
  providedIn: 'root'
})
export class InjectorService {
  devices$: Observable<{ id: string, information: BehaviorSubject<{ value: number }> }[]>
  sortedDevices$: Observable<any>

  devices: Array<Device>;
  listDevices$!: Observable<any>;
  listDevicesSubscription!: Subscription;

  constructor() {

    const device1: Device = {
      id: 1,
      information: new BehaviorSubject<DeviceInformation>({
        name: "Termometre",
        temperature: 0,
        voltage: 220,
        status: false
      })
    }

    const device2: Device = {
      id: 2,
      information: new BehaviorSubject<DeviceInformation>({
        name: "Voltmetre",
        temperature: 0,
        voltage: 220,
        status: false
      })
    }

    const device3: Device = {
      id: 3,
      information: new BehaviorSubject<DeviceInformation>({
        name: "Alarme",
        temperature: 0,
        voltage: 220,
        status: false
      })
    }

    //Default devices array
    this.devices = [device1, device2, device3]
    this.updateListDevicesObservable();
    this.updateDeviceValue(device3, {
      name: "Camera",
      temperature: 19,
      voltage: 219,
      status: true
    })

    this.listDevices$.subscribe(
      res => {
        console.log("Initial subscription :", res);
      }
    )









    // interface Device2{
    //   id: string;
    //   information: Information;
    // }

    // interface Information {
    //   value: BehaviorSubject<{value:string}>
    // }




    const deviceA = { id: 'Camera', information: new BehaviorSubject({ value: 10 }) };
    const deviceB = { id: 'Volets', information: new BehaviorSubject({ value: 2 }) };
    const deviceC = { id: 'Radio', information: new BehaviorSubject({ value: 15 }) };

    let sortOrder = true

    this.devices$ = of([deviceA, deviceB, deviceC]);
    this.sortedDevices$ = this.devices$.pipe(

      switchMap((devices: Device2[]) => {
        const values = devices.map((device: Device2) => device.information.pipe(map((info: { value: number }) => (
          {
            ...device,
            value: info.value
          }))));
        return combineLatest(values);
      }),
      map((devices_: Device2[]) => devices_.sort((a: Device2, b: Device2) => {
        return sortOrder ? a.information.getValue().value - b.information.getValue().value : b.information.getValue().value - a.information.getValue().value
      }
      )),
    );

    setInterval(() => {
      deviceA.information.next({ value: Math.round(Math.random() * 100) });
      deviceB.information.next({ value: Math.round(Math.random() * 100) });
      deviceC.information.next({ value: Math.round(Math.random() * 100) });
    }, 10000);

    // this.sortedDevices$.subscribe((a) => console.log("Sorted Array :", a))













    // console.log("Testing operators :")
    // const examples = of(of("Jean"), of("Patrick"), of("Hervé"), of("Natalie"))

    // examples.pipe(
    //   concatMap(
    //     z => {  return z.pipe(map( (nom:string) =>{  return "Mr/Mrs. "+nom}))}
    //     ),
    // ).subscribe( 
    //   res => console.log(" Nom : ", res)
    // )





  }



















  /*
    Update list devices observable
  */

  //name 
  public updateListDevicesObservable(sortAscending: Boolean = true) {
    const sortedDevices = this.devices.slice().sort((a, b) => sortAscending ? a.id - b.id : b.id - a.id);

    this.listDevices$ = from(sortedDevices).pipe(
      switchMap((device: Device) => {
        console.log("Debug device ; ", device)
        return combineLatest(device.information).pipe(
          map((info: any) => { id: device.id, info })
        )
      })

    )

 
  }

  /*
    ON/OFF
  */
  turnOnOff(device_id: number, device: DeviceInformation) {
    //Find index for id:
    let index = this.devices.findIndex((device) => device.id === device_id)
    this.updateDeviceValue(this.devices[index], {
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
        name: "",
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

          ...device.information,
          voltage: highVoltage

        } as any)
      }
    )
  }







}
