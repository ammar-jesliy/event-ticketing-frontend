import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input() value1: number = 50; // Default value
  @Input() value2: number = 50; // Default value

  constructor() {}

  ngOnInit(): void {
  }

  getRotation(value1: number, value2: number): number {
    if (value1 === 0 && value2 === 0) {
      return 0 - 90;
    }
    return (value1 / (value1 + value2)) * 180 - 90;
  }

  getSoldPercentage(value1: number, value2: number): number {
    if (value1 === 0 && value2 === 0) {
      return 0;
    }
    return (value1 / (value1 + value2)) * 100;
  }
}
