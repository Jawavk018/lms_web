import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import axios from 'axios';
import { DatePipe } from '@angular/common';

@Injectable({  
  providedIn: 'root'
})

export class ApiService {

  url: any = '';
  networkData: any;

  isShowMenu: boolean = true;
  isUpload: boolean = false;
  isLive: boolean = true;
  port: any = '8000';
  // live_http_host: any = 'https://lms.swomb.in:';
  // live_socket_host: any = "wss://lms.swomb.in";
  live_http_host: any = 'http://192.168.1.10:';
  live_socket_host: any = "ws://192.168.1.10";
  public cartCount: number = 0;
  public notificationCount: number = 0;
  isApply:boolean = false;

  constructor(public httpClient: HttpClient, private datePipe: DatePipe) {
    if (this.isLive)
      this.url = this.live_http_host;
    else
      this.url = "http://192.168.1.20:";
    this.getIp((result: any) => {
      this.networkData = result;
    })
  }

  get(endpoint: string, params?: any, reqOpts?: any, ip?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    // if (this.isLive || ip) {
    //   endpoint = this.split_at_index(endpoint, 4)
    // }
    return this.httpClient.get(ip ? ip + endpoint : this.url + endpoint, reqOpts).pipe(
      catchError(this.handleError)
    );
  }

  post(endpoint: string, body: any, reqOpts?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }
    reqOpts.params = new HttpParams();
    // if (this.isLive) {
    //   endpoint = this.split_at_index(endpoint, 4)
    // }
    return this.httpClient
      .post(this.url + endpoint, JSON.stringify(body), reqOpts)
      .pipe(
        catchError(this.handleError)
      );
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }
    reqOpts.params = new HttpParams();
    // if (this.isLive) {
    //   endpoint = this.split_at_index(endpoint, 4)
    // }
    return this.httpClient.put(this.url + endpoint, body, reqOpts).pipe(
      catchError(this.handleError)
    );
  }

  delete(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    // if (this.isLive) {
    //   endpoint = this.split_at_index(endpoint, 4)
    // }
    return this.httpClient.delete(this.url + endpoint, reqOpts)
      .pipe(
        catchError((err) => this.handleError(err))
      )
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    // if (this.isLive) {
    //   endpoint = this.split_at_index(endpoint, 4)
    // }
    return this.httpClient.patch(this.url + '/' + endpoint, body, reqOpts);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.log("Server was down");
    }
    return throwError("Something bad happened; please try again later.");
  }

  getIp(callback: any) {
    axios.get('http://ip-api.com/json/', {
    }).then((response: any) => {
      if (response?.data) {
        callback(response?.data);
      } else {
        // alert('please try again...')
      }
    });
  }

  split_at_index(value: any, index: number) {
    this.port = value.replace("8000", "7000").replace("8017", "6000");
    return (this.port + value.substring(index));
  }

  dateToSavingStringFormatConvertion(currentDate: Date) {
    let datewithouttimezone: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    return this.datePipe.transform(datewithouttimezone, 'yyyy-MM-dd HH:mm:ss');
  }

}