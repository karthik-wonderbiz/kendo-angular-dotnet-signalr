import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

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

  public refreshDevicesListener(callback: (devices: { id: string; machine: string; property: string; value: number; timestamp: string }[]) => void) {
    this.hubConnection.on('refreshDevices', (data: { id: string; machine: string; property: string; value: number; timestamp: string }[]) => {
      console.log('[SignalR] Received refreshDevices event:', data);

      // Ensure data is valid before processing
      if (!Array.isArray(data) || data.length === 0) {
        console.error('[SignalR] Received invalid data:', data);
        return;
      }

      // Process and normalize data
      const formattedData = data.map(device => ({
        id: String(device.id),
        machine: device.machine,
        property: device.property,
        value: Number(device.value), // Ensure value is a number
        timestamp: new Date(device.timestamp).toISOString(), // Convert timestamp to ISO format
      }));

      // Pass the array of devices to the callback
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