import { Injectable } from '@angular/core';

export interface IChartData {
  label: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  getChartData(): IChartData[] {
    return [
      { label: 'Ventes', value: 5000 },
      { label: 'Dépenses', value: 3000 }
    ];
  }
}