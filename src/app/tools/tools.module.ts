import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxtableComponent } from './rxtable/rxtable.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [RxtableComponent],
  exports:[RxtableComponent],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class ToolsModule { }
