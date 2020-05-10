import { Component, Directive, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableLayoutHeader } from './table-layout-header.model';
import { TableLayoutRecord } from './table-layout-record.model';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}

@Component({
  selector: 'app-table-layout',
  templateUrl: './table-layout.component.html'
})
/** table-layout component*/
export class TableLayoutComponent implements OnChanges{
  @Input() records: TableLayoutRecord[];
  @Input() caption: string;
  @Input() tieredHeaders: TableLayoutHeader[];
  @Input() headers: string[];
  @Output() tieredRecordLengthChanged = new EventEmitter<number>();

  keys: string[];

  /** table-layout ctor */
  constructor() {

  }

  ngOnChanges() {
    //this.keys = Object.keys(this.records[0]);
    this.tieredRecordLengthChanged.emit(this.getTieredRecordLength());
  }

  getExpandedTieredHeaderCount(index: number) {
    let headerCount = this.tieredHeaders[index].headers.length;
    for (let i = index - 1; i >= 0; --i) {
      headerCount *= this.tieredHeaders[i].headers.length;
    }
    return headerCount;
  }

  public static getTieredRecordLength(tieredHeaders: TableLayoutHeader[]) {
    let headerCount = tieredHeaders[tieredHeaders.length - 1].headers.length;
    for (let i = tieredHeaders.length - 2; i >= 0; --i) {
      headerCount *= tieredHeaders[i].headers.length;
    }
    return headerCount;
  }

  public static getIndexOfTieredRecord(tieredHeaders: TableLayoutHeader[], headers: string[]) {
    let stride = 1;
    let index = 0;
    tieredHeaders.slice().reverse().forEach((header, i) => {
      index += header.headers.indexOf(headers[i]) * stride;
      stride *= header.headers.length;
    });

    return index;
  }

  getExpandedTieredHeaders(index: number) {
    let headers = [];
    let j = 0;
    let headerCount = this.getExpandedTieredHeaderCount(index);

    //if (index == this.tieredHeaders.length - 1) {
    //  headers.push(...this.headers);
    //}

    //if (injectLabel === true) {
    //  headers.push(this.tieredHeaders[index].name);
    //}
    
    for (let i = 0; i < headerCount; ++i, ++j) {
      if (j == this.tieredHeaders[index].headers.length) {
        j = 0;
        
      }
      headers.push(this.tieredHeaders[index].headers[j]);
    }
    return headers;
  }

  getTieredHeaderColspan(index: number) {
    if (index >= this.tieredHeaders.length - 1) {
      return 1;
    }

    let colspan = this.tieredHeaders[this.tieredHeaders.length - 1].headers.length;
    for (let i = this.tieredHeaders.length - 2; i > index; --i) {
      colspan *= this.tieredHeaders[i].headers.length;
    }
    return colspan;
  }

  getTieredHeaderLabel(index: number) {
    return this.tieredHeaders[index].name;
  }

  @ViewChildren(NgbdSortableHeader) sortableHeaders: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    //NOTE: currently sort is not working
    //  This function does not get called when label is clicked
    // resetting other headers
    //this.sortableHeaders.forEach(header => {
    //  if (header.sortable !== column) {
    //    header.direction = '';
    //  }
    //});

    //// sorting countries
    //if (direction !== '') {
    //  this.records = [...this.records].sort((a, b) => {
    //    const res = compare(a[column], b[column]);
    //    return direction === 'asc' ? res : -res;
    //  });
    //}
  }

  getTieredRecordLength() {
    let length = (this.tieredHeaders) ? this.getExpandedTieredHeaderCount(this.tieredHeaders.length - 1) : 0;
    return length;
  }

  getRecordCellColor(recordIndex: number, valueIndex: number) {
    if (recordIndex === this.records.length - 1) {
      return 'ffffff';
    }

    let positiveIntensityMap = ['aaccaa', '99cc99', '88cc88', '77cc77', '66cc66', '55cc55', '44cc44', '33cc33', '22cc22', '11cc11'];
    let negativeIntensityMap = ['ddbbbb', 'ddaaaa', 'dd8888', 'dd7777', 'dd6666', 'dd5555', 'dd4444', 'dd3333', 'dd2222', 'dd1111'];

    let current = this.records[recordIndex].tiered[valueIndex];
    let previous = this.records[recordIndex + 1].tiered[valueIndex];

    if (current > previous) {
      let diff = current - previous;
      let percentage = diff / current;
      percentage *= 10;
      let index = Math.round(percentage);
      return positiveIntensityMap[index];
    }
    else if (current === previous) {
      return 'ffffff';
    }

    let diff = previous - current;
    let percentage = diff / current;
    percentage *= 10;
    let index = Math.round(percentage);
    return negativeIntensityMap[index];
  }
}
