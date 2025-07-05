import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  chart: any;

  completadas = 0;
  pendientes = 0;
  vencidas = 0;
  totalTareas = 0;

  porcentajeCompletadas = 0;
  porcentajePendientes = 0;
  porcentajeVencidas = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.generateChart();
  }

  generateChart(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.completadas = tasks.filter(t => t.status === 'Completada').length;
        this.pendientes = tasks.filter(t => t.status === 'Pendiente').length;
        this.vencidas = tasks.filter(t => t.status === 'Vencida').length;

        this.totalTareas = tasks.length;

        const calcPorcentaje = (valor: number): number =>
          this.totalTareas ? Math.round((valor / this.totalTareas) * 100) : 0;

        this.porcentajeCompletadas = calcPorcentaje(this.completadas);
        this.porcentajePendientes = calcPorcentaje(this.pendientes);
        this.porcentajeVencidas = calcPorcentaje(this.vencidas);

        this.renderChart();
      },
      error: (err) => {
        console.error('Error al obtener tareas:', err);
      }
    });
  }

  renderChart(): void {
    const ctx = document.getElementById('taskChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Para evitar superposición de gráficos
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completadas', 'Pendientes', 'Vencidas'],
        datasets: [{
          data: [this.completadas, this.pendientes, this.vencidas],
          backgroundColor: ['#4caf50', '#ffc107', '#f44336']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  exportAsPDF(): void {
    const chartArea = document.getElementById('reportSection');
    if (!chartArea) return;

    html2canvas(chartArea).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, imgHeight);
      pdf.save('reporte_tareas.pdf');
    });
  }
}
