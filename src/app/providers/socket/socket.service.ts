import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private socket: WebSocket | any;

  web_socket_host:any;
 
  constructor(private api: ApiService) {
    if (!this.api.isLive) {
      this.web_socket_host = 'ws://localhost:8100';
    } else {
      // this.web_socket_host = 'wss://lms.swomb.in:6100';
      this.web_socket_host = 'ws://13.232.29.204:8100';
    }
  }
  

  connect(url: string, callback: any): void {
    console.log(url)
//     var keystore = new JavaKeyStore("keystore.jks");

// // Import the SSL certificate into the keystore file.
// keystore.importCertificate("certificate.pem");

    this.socket = new WebSocket(url);
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = (event: any) => {
      console.log('WebSocket connection opened:', event);
      callback(true);
    };

    this.socket.onclose = (event: any) => {
      console.log('WebSocket connection closed:', event);
      callback(false);
    };

    this.socket.onerror = (error: any) => {
      console.log('WebSocket error:', error);
      // callback(false);
    };
  }

  send(file: any, callback: any) {
    const files: FileList = file;
    let uploadList: any = [];
    if (!files.length) {
      callback([]);
    } else {
      this.connect(this.web_socket_host + '/file-upload', async (connection: any) => {
        if (connection) {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(files.length);
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              let obj = JSON.parse(JSON.stringify(file));
              if (obj?.isUploaded != null && obj?.isUploaded != undefined) {
                uploadList.push(obj);
                if (uploadList?.length == files.length) {
                  this.close();
                  callback(JSON.parse(uploadList));
                }
              } else {
                const arrayBuffer = await this.readFileAsync(file);
                this.socket.send(arrayBuffer);
              }
            }
            this.socket.onmessage = (event: any) => {
              console.log(event);
              this.close();
              if (event?.data) {
                uploadList.push(...event?.data);
                callback(JSON.parse(event?.data));
              }
            };
          } else {
            console.warn('Connection was lost');
          }
        } else {
          console.warn('Connection was lost');
        }
      });
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  private async readFileAsync(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(arrayBuffer);
      };
      reader.onerror = () => {
        reject('Error reading file.');
      };
      reader.readAsArrayBuffer(file);
    });
  }


}
