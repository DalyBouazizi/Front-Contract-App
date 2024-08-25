import { Pipe, PipeTransform } from '@angular/core';
import { interval, map, Observable, take } from 'rxjs';

@Pipe({
  name: 'animateNumber'
})
export class AnimateNumberPipe implements PipeTransform {

  transform(value: number,): Observable<number> {
    const duration = 20; // animation duration in ms
    const frames = 60; // number of animation frames
    const frameDuration = duration / frames;
    const increment = value / frames;

    return interval(frameDuration).pipe(
      take(frames),
      map(i => Math.round(i * increment))
    );
  }

}
