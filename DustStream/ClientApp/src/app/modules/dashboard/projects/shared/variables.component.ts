import { Component, Input, SimpleChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { IVariable } from '../../models';

@Component({
  selector: 'variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent {
  @Input() @Output() variables: IVariable[];
  @Input() form: FormGroup;
  @Input() addable: boolean = true;

  variablesDataSource = new MatTableDataSource();
  displayedColumns = ['key', 'value', 'actions'];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.variables) {
      this.variablesDataSource.data = this.variables;
    }
  }

  removeVariable(index: number) {
    this.variables.splice(index, 1);
    this.variablesDataSource.data = this.variables;
  }

  addVariable(): void {
    let addingVariable: IVariable = { key: '', value: '' };
    this.variables.push(addingVariable);
    this.variablesDataSource.data = this.variables;
  }
}
