import { environment } from "../environments/environment";

export const API_ENDPOINTS = {
    dataHub : `${environment.dataHubUrl}`,
    rawMaterial: `${environment.apiUrl}/RawMaterial`,
    device: `${environment.apiUrl}/Device`,
};