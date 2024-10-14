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

// Find Name Abbreviation
function getNameAbbreviation(name: string) {
  const words = name.split(' ');

  const initials = words.length > 1 ? words.slice(0, 2).map(word => word.charAt(0).toUpperCase()) : name.length >= 2 ? [name.charAt(0).toUpperCase(), name.charAt(1).toUpperCase()] : [name.charAt(0).toUpperCase()];
  return initials.join('');
}

// Find Distance in KM/M 
const getCalculateDistance = (lat1:number, lon1:number, lat2:number, lon2:number) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


export default{
  handleGMapURL,
  getTimeinAMPMfromTimeString,
  getMaxTimeforInput,
  getNameAbbreviation,
  getCalculateDistance
}