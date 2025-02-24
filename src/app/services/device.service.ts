import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants'; 
import { Device } from '../model/device.interface'; 
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { DailyDeviceStatistics } from '../model/daily-device-statistics.interface';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly apiUrl = API_ENDPOINTS.device; 

  constructor(private http: HttpClient) { }

  // getDevices(): Observable<Device[]> {
  //   return this.http.get<Device[]>(this.apiUrl).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching Device data:', error);
  //       return throwError(() => new Error('Failed to fetch Device data. Please try again.'));
  //     })
  //   );
  // }

  getMachines(): Observable<string[]> {
    const getUrl = `${this.apiUrl}/machines`;
    return this.http.get<string[]>(getUrl);
  }

  getProperties(): Observable<string[]> {
    const getUrl = `${this.apiUrl}/properties`;
    return this.http.get<string[]>(getUrl);
  }

  getFilteredData(
    machine: string,
    property: string,
    minValue: number,
    maxValue: number,
    startDate: Date | null,
    endDate: Date | null
  ): Observable<any[]> {
    let params = new HttpParams();
  
    if (machine) params = params.set('machine', machine);
    if (property) params = params.set('property', property);
    if (minValue) params = params.set('minValue', minValue.toString());
    if (maxValue) params = params.set('maxValue', maxValue.toString());
  
    if (startDate) {
      const localStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
      params = params.set('startDate', localStartDate.toISOString().split('T')[0]); 
    }
    
    if (endDate) {
      const localEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
      params = params.set('endDate', localEndDate.toISOString().split('T')[0]); 
    }    
  
    const getUrl = `${this.apiUrl}/filter`;
    return this.http.get<any[]>(getUrl, { params });
  }  

  getDailyStatistics(
    machine: string,
    property: string,
    startDate: Date | null,
    endDate: Date | null
  ): Observable<DailyDeviceStatistics[]> {
    let params = new HttpParams()
      .set('machine', machine)
      .set('property', property);
  
    if (startDate) {
      const localStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
      params = params.set('startDate', localStartDate.toISOString().split('T')[0]); 
    }
  
    if (endDate) {
      const localEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
      params = params.set('endDate', localEndDate.toISOString().split('T')[0]); 
    }
  
    return this.http.get<DailyDeviceStatistics[]>(`${this.apiUrl}/daily-statistics`, { params });
  }
  
}