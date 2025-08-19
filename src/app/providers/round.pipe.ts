import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number, format: string = ''): string {
    if (!value) return '';
    
    // Round the value to the nearest integer
    const roundedValue = Math.round(value);
    
    // Check if format is 'HH:mm:ss'
    if (format === 'HH:mm:ss') {
      // Convert roundedValue to HH:mm:ss format
      const hours = Math.floor(roundedValue / 3600);
      const minutes = Math.floor((roundedValue % 3600) / 60);
      const seconds = roundedValue % 60;
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }
    
    // Return the rounded value as string
    return roundedValue.toString();
  }

  // Helper function to pad single digit numbers with leading zeros
  private pad(n: number): string {
    return (n < 10) ? '0' + n : n.toString();
  }
}
