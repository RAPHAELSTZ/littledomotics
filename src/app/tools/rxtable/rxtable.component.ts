import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InjectorService } from 'src/app/injector.service';

@Component({
  selector: 'app-rxtable',
  templateUrl: './rxtable.component.html',
  styleUrls: ['./rxtable.component.scss'],
})
export class RxtableComponent  implements OnInit {

  listDevices:any;
  constructor(public deviceInjector:InjectorService) { }

  ngOnInit() {

  }


}
