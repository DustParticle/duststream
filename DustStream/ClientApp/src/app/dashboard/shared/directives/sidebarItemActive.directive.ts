import { AfterContentInit, Directive, ElementRef, Renderer, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';

import { SidebarItem } from '../sidebarItem';

@Directive({
    selector: '[sidebarItemActive]',
    exportAs: 'sidebarItemActive',
})
export class SidebarItemActive implements OnChanges, OnDestroy, AfterContentInit {
    @Input() sidebarItem: SidebarItem;

    private classes: string[] = [];
    private subscription: any;

    @Input() sidebarItemActiveOptions: { exact: boolean } = { exact: false };

    @Input()
    set sidebarItemActive(data: string[] | string) {
        if (Array.isArray(data)) {
            this.classes = <any>data;
        } else {
            this.classes = data.split(' ');
        }
    }

    constructor(private router: Router, private element: ElementRef, private renderer: Renderer) {
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    ngAfterContentInit(): void {
        this.update();
    }

    ngOnChanges(changes: {}): any { this.update(); }
    ngOnDestroy(): any { this.subscription.unsubscribe(); }

    get isActive(): boolean { return this.hasActiveLink(this.sidebarItem); }

    private update(): void {
        if (!this.sidebarItem || !this.router.navigated) return;

        const isActive = this.hasActiveLink(this.sidebarItem);
        this.classes.forEach(c => {
            if (c) {
                this.renderer.setElementClass(this.element.nativeElement, c, isActive);
            }
        });
    }

    private isLinkActive(routerLink: string[]): boolean {
        return this.router.isActive(this.router.createUrlTree(routerLink), this.sidebarItemActiveOptions.exact);
    }

    private hasActiveLink(item: SidebarItem): boolean {
        if (item.routerLink) {
            return this.isLinkActive(item.routerLink);
        }
        if (item.children) {
            for (let i: number = 0; i < item.children.length; i += 1) {
                if (true === this.hasActiveLink(item.children[i])) {
                    return true;
                }
            }
        }
        return false;
    }
}
