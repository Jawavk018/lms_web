import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat'
})

export class DurationFormatPipe implements PipeTransform {

  transform(duration: string): string {
    if (!duration) return ''; // Return empty string if duration is falsy

    const [hours, minutes, seconds] = duration.split(':');
    let formattedDuration = '';

    if (parseInt(hours) > 0) {
      formattedDuration += `${hours} hour${parseInt(hours) !== 1 ? 's' : ''} `;
    }

    if (parseInt(minutes) > 0) {
      formattedDuration += `${minutes} minute${parseInt(minutes) !== 1 ? 's' : ''} `;
    }

    if (parseInt(seconds) > 0) {
      formattedDuration += `${seconds} second${parseInt(seconds) !== 1 ? 's' : ''}`;
    }

    return formattedDuration.trim();
  }

}
