import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatDividerModule, MatPaginatorModule, MatSidenavModule, MatTableModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';

@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatTableModule
  ],
  exports: [
    DefaultComponent
  ]
})
export class DefaultModule { }
