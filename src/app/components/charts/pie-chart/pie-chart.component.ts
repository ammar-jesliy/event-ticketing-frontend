/**
 * A component that renders a pie chart.
 *
 */

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

  ngOnInit(): void {}

  /**
   * Calculates the rotation angle for a pie chart segment based on two values.
   *
   * @param value1 - The first value to be used in the calculation.
   * @param value2 - The second value to be used in the calculation.
   * @returns The rotation angle in degrees. If both values are zero, returns -90 degrees.
   */
  getRotation(value1: number, value2: number): number {
    if (value1 === 0 && value2 === 0) {
      return 0 - 90;
    }
    return (value1 / (value1 + value2)) * 180 - 90;
  }

  /**
   * Calculates the percentage of sold tickets.
   *
   * @param value1 - The number of sold tickets.
   * @param value2 - The number of unsold tickets.
   * @returns The percentage of sold tickets. If both value1 and value2 are zero, returns 0.
   */
  getSoldPercentage(value1: number, value2: number): number {
    if (value1 === 0 && value2 === 0) {
      return 0;
    }
    return (value1 / (value1 + value2)) * 100;
  }
}
