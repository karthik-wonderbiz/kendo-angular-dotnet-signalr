import { ChangeDetectorRef, Component } from '@angular/core';
import { RawMaterial } from '../../model/raw-material.interface';
import { RawMaterialService } from '../../services/raw-material.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public gridData: RawMaterial[] = [];
  public newRawMaterial: RawMaterial = {
    id: 0,
    name: '',
    supplier: '',
    batchNumber: '',
    quantity: 0,
    qualityCheckStatus: '',
  };

  public chartData: { timestamp: string, quantity: number }[] = [];

  constructor(
    private readonly rawMaterialService: RawMaterialService,
    private readonly signalRService: SignalRService,
    private readonly cdr: ChangeDetectorRef // For triggering UI updates
  ) { }

  ngOnInit(): void {
    this.signalRService.startConnection();

    // Add the listener to update the table and show a toast notification
    this.signalRService.addReceiveItemUpdateListener((id, name, supplier, batchNumber, quantity, qualityCheckStatus) => {
      // Update the table
      this.gridData = this.gridData.filter(item => item.id !== id);
      this.gridData.push({ id, name, supplier, batchNumber, quantity, qualityCheckStatus });

      // Add data to chart with timestamp
      this.updateChartData(quantity);

      this.cdr.detectChanges(); // Ensure UI updates

    });

    this.loadRawMaterials();
    this.startAutoCreateRawMaterials();
  }

  loadRawMaterials(): void {
    this.rawMaterialService.getRawMaterials().subscribe(data => {
      this.gridData = data;
    });
  }

  createRawMaterial(): void {
    this.rawMaterialService.createRawMaterial(this.newRawMaterial).subscribe(() => {
      this.newRawMaterial = { id: this.newRawMaterial.id, name: this.newRawMaterial.name, supplier: this.newRawMaterial.supplier, batchNumber: this.newRawMaterial.batchNumber, quantity: this.newRawMaterial.quantity, qualityCheckStatus: this.newRawMaterial.qualityCheckStatus };
      this.loadRawMaterials();
    });
  }

  updateChartData(quantity: number): void {
    const timestamp = new Date().toLocaleTimeString();

    // Maintain last 10 records to avoid overcrowding
    if (this.chartData.length >= 10) {
      this.chartData.shift();
    }

    this.chartData.push({ timestamp, quantity });
  }

  // Getter methods for Angular binding
  get categories(): string[] {
    return this.chartData.map(data => data.timestamp);
  }

  get seriesData(): number[] {
    return this.chartData.map(data => data.quantity);
  }

  startAutoCreateRawMaterials(): void {
    setInterval(() => {
      const randomQuantity = Math.floor(Math.random() * 5) + 1; // Random value between 1 and 5

      this.newRawMaterial = {
        id: 0,
        name: `Material-${Math.floor(Math.random() * 1000)}`, // Random name
        supplier: `Supplier-${Math.floor(Math.random() * 10)}`,
        batchNumber: `Batch-${Math.floor(Math.random() * 1000)}`,
        quantity: randomQuantity,
        qualityCheckStatus: 'Pending'
      };

      this.createRawMaterial();
    }, 100);
  }
}
