import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, FormsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  
  sourceData: string = '';
  chartData: number[] = [];
  
  private svg: any;
  private margin = { top: 20, right: 20, bottom: 40, left: 40 };
  private width = 600 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    // Limpiar cualquier SVG existente
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    // Crear SVG
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  updateData(): void {
    if (!this.sourceData.trim()) {
      alert('Por favor ingresa algunos datos separados por comas');
      return;
    }

    // Procesar datos de entrada
    this.chartData = this.sourceData
      .split(',')
      .map(d => parseInt(d.trim()))
      .filter(d => !isNaN(d));

    if (this.chartData.length === 0) {
      alert('Por favor ingresa números válidos separados por comas');
      return;
    }

    this.createChart();
  }

  private createChart(): void {
    // Limpiar gráfico anterior
    this.svg.selectAll('*').remove();

    // Escalas
    const xScale = d3.scaleBand()
      .domain(this.chartData.map((_, i) => i.toString()))
      .range([0, this.width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.chartData) || 0])
      .range([this.height, 0]);

    // Colores diferentes para cada barra
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Crear barras
    this.svg.selectAll('.bar')
      .data(this.chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (_: any, i: number) => xScale(i.toString()) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', (d: number) => yScale(d))
      .attr('height', (d: number) => this.height - yScale(d))
      .attr('fill', (_: any, i: number) => colorScale(i.toString()));

    // Agregar valores en las barras
    this.svg.selectAll('.text')
      .data(this.chartData)
      .enter()
      .append('text')
      .attr('class', 'text')
      .attr('x', (_: any, i: number) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d: number) => yScale(d) - 5)
      .attr('text-anchor', 'middle')
      .text((d: number) => d)
      .style('fill', 'black')
      .style('font-size', '12px');

    // Ejes
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale));

    this.svg.append('g')
      .call(d3.axisLeft(yScale));
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
