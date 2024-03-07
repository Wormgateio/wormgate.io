import { setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';


export function getRandomTimeForDay(day: Date) {
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
  
    const randomTime = setMilliseconds(setSeconds(setMinutes(setHours(day, randomHours), randomMinutes), randomSeconds), 0);
  
    return randomTime;
}

export function getRandomTimesForDay(timesCount: number, day: Date) {
    return new Array(timesCount).fill(0).map(() => getRandomTimeForDay(day))
}