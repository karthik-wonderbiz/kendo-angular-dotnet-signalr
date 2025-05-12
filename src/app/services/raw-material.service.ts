import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants'; 
import { RawMaterial } from '../model/raw-material.interface'; 

@Injectable({
  providedIn: 'root',
})
export class RawMaterialService {
  private readonly apiUrl = API_ENDPOINTS.rawMaterial; 

  constructor(private readonly http: HttpClient) { }

  createRawMaterial(rawMaterial: RawMaterial): Observable<RawMaterial> {
    return this.http.post<RawMaterial>(this.apiUrl, rawMaterial);
  }

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching raw materials:', error);
        return throwError(() => new Error('Failed to fetch raw materials. Please try again.'));
      })
    );
  }

  updateRawMaterial(id: number, rawMaterial: RawMaterial): Observable<RawMaterial> {
    return this.http.put<RawMaterial>(`${this.apiUrl}/${id}`, rawMaterial);
  }

  deleteRawMaterial(id: number): Observable<RawMaterial> {
    return this.http.delete<RawMaterial>(`${this.apiUrl}/${id}`);
  }
}