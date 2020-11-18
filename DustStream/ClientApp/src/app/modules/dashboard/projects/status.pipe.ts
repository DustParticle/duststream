import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
  private statusString: string[] = ["NoStatus", "Success", "InQueue", "InProgress", "Failed", "Canceled"];
  transform(value: string, ...args: any[]): any {
    return 'status' + (this.statusString.indexOf(value) >= 0 ? value : "NoStatus");
  }
}
