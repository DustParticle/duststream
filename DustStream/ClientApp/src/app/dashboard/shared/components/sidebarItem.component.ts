import { Component, Input } from '@angular/core';

import { SidebarItem } from '../sidebarItem';

/**
 * This is a part of the component FullLayoutComponent got from theme
 */
@Component({
    selector: 'sidebar-item',
    templateUrl: './sidebarItem.component.html'
})
export class SidebarItemComponent {
    @Input()
    public item: SidebarItem;

    constructor() { }
}
