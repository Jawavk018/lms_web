import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

  getVideoChunk(): Observable<ArrayBuffer> {
    return this.http.get('http://localhost:8000/video', { responseType: 'arraybuffer' })
      .pipe(map((response: ArrayBuffer) => response));
  }
}
