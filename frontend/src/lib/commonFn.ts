const handleGMapURL = (lat: number, long: number) => {
  const latitude = Number(lat); 
  const longitude = Number(long);
  const googleMapsURL = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const googleMapsAppURL = `geo:${latitude},${longitude}`;


  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const finalURL = isMobile ? googleMapsAppURL : googleMapsURL;
  window.location.href = finalURL
};


// Get Hours 
function getTimeinAMPMfromTimeString(time: string){
  const [hours, minutes] = time.split(':');

  const hourNum = parseInt(hours, 10);
  const isPM = hourNum >= 12;

  const formattedHour = hourNum % 12 || 12;
  const amPM = isPM ? 'PM' : 'AM';

  return `${formattedHour}:${minutes} ${amPM}`
}

// Find Max Time from Hours
function getMaxTimeforInput(time: string){
  const [hours, minutes] = time.split(':');
  const modTime = new Date();
  modTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Convert the time to HH:mm:ss format
  const maxTime = modTime.toTimeString().split(' ')[0];
  return maxTime;
}

export default{
  handleGMapURL,
  getTimeinAMPMfromTimeString,
  getMaxTimeforInput
}