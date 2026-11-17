
let remainingSeconds = 0;
let timerIntervalId = null;

onmessage = function(event) {
  switch(event.data.action) {
    case 'start-timer':
      remainingSeconds = event.data.timerSeconds;
      runTimer();
      break;
    case 'pause-timer':
      // The remaining seconds stay where they are: resuming picks up from there.
      clearInterval(timerIntervalId);
      timerIntervalId = null;
      break;
    case 'resume-timer':
      runTimer();
  }
}

function runTimer() {
  if (timerIntervalId !== null) return;
  timerIntervalId = setInterval(() => {
    if (remainingSeconds === 0) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
      postMessage({ action: 'end-timer' });
    } else {
      remainingSeconds -= 1;
      postMessage({ action: 'step-timer' });
    }
  }, 1000);
}
