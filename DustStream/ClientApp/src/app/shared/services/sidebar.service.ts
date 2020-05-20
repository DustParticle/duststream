import { Injectable } from '@angular/core';

export class SidebarItem {
  public name: string;
  public routerLink?: string[];

  constructor() {
    this.name = '';
    this.routerLink = null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private items: SidebarItem[] = [];

  constructor() { }

  getItems(): SidebarItem[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }

  addItem(name: string, routerLink: string[]): void {
    let item: SidebarItem = {
      name: name,
      routerLink: routerLink
    }
    this.items.push(item);
  }
}
