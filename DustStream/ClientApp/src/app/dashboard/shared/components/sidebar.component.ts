import { Component, Input } from '@angular/core';

import { SidebarItem } from '../sidebarItem';

/**
 * This is a part of the component FullLayoutComponent got from theme
 */
@Component({
    selector: 'sidebar-menu',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
    @Input()
    public items: SidebarItem[];

    constructor() { }
}
