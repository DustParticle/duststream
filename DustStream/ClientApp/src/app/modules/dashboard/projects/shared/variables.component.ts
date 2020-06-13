import { Component, Input, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { IVariable } from '../../models';

@Component({
  selector: 'variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent {
  @Input() variables: IVariable[];
  @Input() form: FormGroup;
  @Input() addable: boolean = true;

  formArray: FormArray;
  variablesDataSource: MatTableDataSource<AbstractControl>;
  displayedColumns = ['key', 'value', 'actions'];
  isFormInitialized: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngAfterViewInit() {
    this.initializeForm();
    this.formArray.setValidators(this.uniqueKeyValidator());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  initializeForm() {
    if (this.variables && this.form && !this.isFormInitialized) {
      var formItems = this.variables.map(variable => this.createFormArrayItem(variable));
      this.formArray = this.formBuilder.array(formItems);
      if (this.form.contains('variables'))
        this.form.setControl('variables', this.formArray);
      else
        this.form.addControl('variables', this.formArray);
      this.variablesDataSource = new MatTableDataSource(this.formArray.controls);

      this.isFormInitialized = true;
    }
  }

  uniqueKeyValidator(): ValidatorFn {
    return (group: FormArray) => {
      let hasError = false;
      let errors = {};
      const controls = group.controls;
      let keyMap: Map<string, boolean> = new Map<string, boolean>();
      for (let i = 0; i < controls.length; i++) {
        const key = controls[i].get('key').value;
        if (!keyMap.has(key)) {
          keyMap.set(key, false);
        } else if (keyMap.get(key) == false) {
          errors[`${key} is duplicated`] = true;
          hasError = true;
          keyMap.set(key, true);
        }
      }

      return hasError ? errors : null;
    }
  }

  createFormArrayItem(variable: IVariable) {
    return this.formBuilder.group({
      key: [variable.key, Validators.required],
      value: [variable.value, Validators.required]
    });
  }

  removeVariable(index: number) {
    this.formArray.removeAt(index);
    this.variablesDataSource.data = this.formArray.controls;
    this.formArray.markAsDirty();
  }

  addVariable(): void {
    let addingVariable: IVariable = { key: '', value: '' };
    this.formArray.push(this.createFormArrayItem(addingVariable));
    this.variablesDataSource.data = this.formArray.controls;
  }
}
