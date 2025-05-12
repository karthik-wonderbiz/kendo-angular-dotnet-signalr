import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Device } from '../model/device.interface';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private readonly hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.dataHub, {
        skipNegotiation: true, // Skip negotiation if using WebSockets
        transport: signalR.HttpTransportType.WebSockets, // Use WebSockets
        withCredentials: true // Include credentials
      })
      .build();
  }

  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public refreshDevicesListener(callback: (devices: Device[]) => void) {
    this.hubConnection.on('refreshDevices', (data: Device[]) => {
      console.log('[SignalR] Received refreshDevices event:', data);
      // if (!Array.isArray(data) || data.length === 0) {
      //   console.error('[SignalR] Received invalid data:', data);
      //   return;
      // }
      const formattedData = data.map(device => ({
        id: String(device.id),
        machine: device.machine,
        property: device.property,
        value: Number(device.value),
        timestamp: new Date(device.timestamp).toISOString(),
      }));
      callback(formattedData);
    });
  }



  public addReceiveItemUpdateListener = (callback: (id: number, name: string, supplier: string, batchNumber: string, quantity: number, qualityCheckStatus: string) => void) => {
    this.hubConnection.on('ReceiveItemUpdate', (id, name, supplier, batchNumber, quantity, qualityCheckStatus) => {
      // Call the callback to update the table
      callback(id, name, supplier, batchNumber, quantity, qualityCheckStatus);
    });
  }
}