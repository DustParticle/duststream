import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  lastRead: number;
}

const maxAge = 30000;
@Injectable()
export class RequestCacheService {
  private cache: Map<string, CacheEntry> = new Map<string, CacheEntry>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cachedItem = this.cache.get(url);

    if (!cachedItem) {
      return undefined;
    }

    const isExpired = cachedItem.lastRead < (Date.now() - maxAge);
    return !isExpired ? cachedItem.response : undefined;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.url;
    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired = Date.now() - maxAge;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }

  clear(): void {
    this.cache.clear();
  }
}
