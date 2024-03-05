const { addDays, setHours, setMinutes, setSeconds, setMilliseconds } = require('date-fns');


export function getRandomTimeForNextDay() {
    const nextDay = addDays(new Date(), 1);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
  
    const randomTime = setMilliseconds(setSeconds(setMinutes(setHours(nextDay, randomHours), randomMinutes), randomSeconds), 0);
  
    return randomTime;
}
