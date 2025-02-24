import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { SignalRService } from '../../services/signalr.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Device } from '../../model/device.interface';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { ChartWizardDataRow, DataColumn, DataRow, getWizardDataFromDataRows } from '@progress/kendo-angular-chart-wizard';
import { DailyDeviceStatistics } from '../../model/daily-device-statistics.interface';
import { SeriesLabels } from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css',
  standalone: false,
})
export class DeviceComponent implements OnInit {
  public deviceData: Device[] = [];
  public wizardData: ChartWizardDataRow[] = [];
  public gridData: GridDataResult = { data: [], total: 0 };
  public pageSize = 10;
  public skip = 0;

  public filters = {
    machine: 'Select Machine',
    property: 'Select Property',
    minValue: 0,
    maxValue: 0,
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  public machines: string[] = [];
  public properties: string[] = [];

  public date: string[] = [];
  public minValue: number[] = [];
  public maxValue: number[] = [];
  public avgValue: number[] = [];

  public seriesLabels: SeriesLabels = {
    visible: true,
    padding: 3,
    font: "12px Arial, sans-serif",
  };

  public columnChartTitle = `${this.filters.machine}'s ${this.filters.property} Value vs Date`

  constructor(
    private deviceService: DeviceService,
    private signalRService: SignalRService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Start SignalR connection for real-time updates.
    this.signalRService.startConnection();

    // Listen for incoming device updates.
    this.signalRService.refreshDevicesListener((devices) => {
      this.deviceData = [...this.deviceData, ...devices];
      this.updateGrid();
      // Refresh chart data since daily statistics may change.
      this.fetchAndUpdateWizardData();

      this.notificationService.show({
        content: `New Reading Updated`,
        cssClass: 'button-notification',
        animation: { type: 'fade', duration: 400 },
        position: { horizontal: 'right', vertical: 'top' },
        type: { style: 'info', icon: true },
        hideAfter: 3000,
      });
    });

    // Load machines and properties for dropdowns.
    this.deviceService.getMachines().subscribe((data) => (this.machines = data));
    this.deviceService.getProperties().subscribe((data) => (this.properties = data));

    // Load initial device data and chart statistics.
    this.loadData();
    this.fetchAndUpdateWizardData();
  }

  // Fetch filtered device data for the grid.
  loadData(): void {
    this.deviceService
      .getFilteredData(
        this.filters.machine,
        this.filters.property,
        this.filters.minValue,
        this.filters.maxValue,
        this.filters.startDate,
        this.filters.endDate
      )
      .subscribe((data) => {
        this.deviceData = data;
        this.updateGrid();
      });
  }

  // Update grid view based on current pagination.
  updateGrid(): void {
    this.gridData = {
      data: this.deviceData.slice(this.skip, this.skip + this.pageSize),
      total: this.deviceData.length,
    };
  }

  // Fetch daily statistics and update the Chart Wizard data.
  fetchAndUpdateWizardData(): void {
    this.deviceService.getDailyStatistics(
      this.filters.machine,
      this.filters.property,
      this.filters.startDate,
      this.filters.endDate
    ).subscribe((stats: DailyDeviceStatistics[]) => {
      const dataColumns: DataColumn[] = [
        { field: 'Date', title: 'Date' },
        { field: 'AvgValue', title: 'Avg Value' },
        { field: 'MinValue', title: 'Min Value' },
        { field: 'MaxValue', title: 'Max value' },
      ];

      this.date = stats.map(stat => stat.date);
      this.minValue = stats.map(stat => stat.minValue);
      this.maxValue = stats.map(stat => stat.maxValue);
      this.avgValue = stats.map(stat => stat.avgValue);

      // Map the daily statistics to the DataRow format expected by the chart.
      const dataRows: DataRow[] = stats.map((stat, index) => ({
        dataItem: {
          ID: index, // Using index as a unique identifier.
          Date: stat.date,
          AvgValue: stat.avgValue,
          MinValue: stat.minValue,
          MaxValue: stat.maxValue
        },
        dataColumns,
      }));

      this.wizardData = getWizardDataFromDataRows(dataRows);
    });
  }

  // Handle grid page change events.
  onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.updateGrid();
  }

  // Apply filters to reload grid data and update chart statistics.
  applyFilters(): void {
    this.deviceService
      .getFilteredData(
        this.filters.machine,
        this.filters.property,
        this.filters.minValue,
        this.filters.maxValue,
        this.filters.startDate,
        this.filters.endDate
      )
      .subscribe((data) => {
        this.deviceData = data;
        this.skip = 0;
        this.updateGrid();
      });
    this.fetchAndUpdateWizardData();
    this.columnChartTitle = `[Machine: ${this.filters.machine}] [Property: ${this.filters.property}] Value vs Date Range`
  }

  // Reset filters to defaults and reload data.
  resetFilters(): void {
    this.filters = {
      machine: 'Select Machine',
      property: 'Select Property',
      minValue: 0,
      maxValue: 0,
      startDate: null,
      endDate: null,
    };
    this.loadData();
    this.fetchAndUpdateWizardData();
  }
}
