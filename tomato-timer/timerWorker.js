
onmessage = function(event) {
  switch(event.data.action) {
    case 'start-timer':
      startTimer(event.data.timerSeconds);
  }
}

function startTimer(durationInSeconds) {
  let duration = durationInSeconds;
  const timerIntervalId = setInterval(() => {
    if (duration === 0) {
      clearInterval(timerIntervalId);
      postMessage({ action: 'end-timer' });
    } else {
      duration -= 1;
      postMessage({ action: 'step-timer' });
    }
  }, 1000);
}
