export class SidebarItem {
    public name: string;
    public iconClass: string;
    public children?: SidebarItem[];
    public routerLink?: string[];

    constructor() {
        this.name = '';
        this.iconClass = '';
        this.children = null;
        this.routerLink = null;
    }
}