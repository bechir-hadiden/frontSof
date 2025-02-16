import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as mammoth from 'mammoth';
import { AppService } from '../Services/app.service';
import { AuthService } from '../Services/auth.service';
import  { ChartConfiguration, ChartData, ChartType } from 'chart.js/auto'
import { Chart } from 'chart.js/auto';
import { ChartService } from '../Services/chart.service';
export interface IChartData {

  label: string;

  value: number;

} 
@Component({
  selector: 'app-list-file',
  standalone : false ,
  templateUrl: './list-file.component.html',
  styleUrl: './list-file.component.css'
})
export class ListFileComponent {
  pdfSrc !: any ; 
  selectedFile: File | null = null;
  uploadMessage!: any
  reponse !: any ;
  chart: any;




  public pieChartType: ChartType = 'pie';
  
  public pieChartData: ChartData<'pie'> = {
    labels: ['Catégorie 1', 'Catégorie 2'],
    datasets: [{
      data: [60, 40],
      backgroundColor: ['#FFA500', '#FFD700'], // Orange et Jaune
      hoverBackgroundColor: ['#FF8C00', '#FFB900']
    }]
  };

  constructor( private chartService: ChartService ,  private http: HttpClient , private fileUploadService : AppService , public authService : AuthService) {}

  ngOnInit(): void {
    const chartData = [
      { label: 'Ventes', value: 5000 },
      { label: 'Dépenses', value: 3000 }
    ]; // Remplacement du service par des données statiques
    this.createChart(chartData);
  }

  createChart(chartData: IChartData[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  
    const config = {
      type: 'doughnut',  
      data: {
        labels: chartData.map(item => item.label),
        datasets: [{
          data: chartData.map(item => item.value),
          backgroundColor: ['#FFA500', '#FFD700'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%' 
      }
    } as ChartConfiguration<'doughnut'>; 
  
    this.chart = new Chart(ctx, config);
  }
}


