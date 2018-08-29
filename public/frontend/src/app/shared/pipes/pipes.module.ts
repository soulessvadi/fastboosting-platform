import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldFilterPipe } from './field-filter.pipe';
import { MomentPipe } from './moment.pipe';
import { MomentFromNowPipe } from './moment.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FieldFilterPipe, MomentPipe, MomentFromNowPipe],
  exports: [FieldFilterPipe, MomentPipe, MomentFromNowPipe]
})
export class PipesModule { }
