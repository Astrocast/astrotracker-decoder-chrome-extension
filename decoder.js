// Function to decode base64 data
function base64ToBase16(base64) {
  return window.atob(base64)
    .split('')
    .map(function (aChar) {
      return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
    })
  .join('')
  .toUpperCase();
}

// Get DOM element containing payload
const base64_element = document.getElementById("base64");

// Decode base64 payload data
const data_encoded = base64_element.innerText;
const data_decoded = base64ToBase16(data_encoded);

// Variables for decoded data
let slot, date, lat, lon, siv, gspeed, batt, temp

if ( data_decoded.length === 12 ) {
  // Astrotracker Protocol V1
  temp = Number.parseInt(data_decoded.slice(0, 2), 16);
  batt = Number.parseInt(data_decoded.slice(2, 4), 16) / 10;
  date = new Date(Number.parseInt(data_decoded.slice(4,12).match(/[a-fA-F0-9]{2}/g).reverse().join(''), 16)*1000).toUTCString();
  
  // Update DOM element's inner HTML with decoded data
  base64_element.innerHTML += " \
    <br /><br /><b>Astrotracker Protocol V1</b> \
	<br />------------------------ \
    <br />Date = " + date + " \
    <br />Battery voltage = " + batt + "V \
    <br />Temperature = " + temp + "°C";
	
} else if ( data_decoded.length === 40 ) {
  // AstroTracker protocol V2 - LOGGER_TAG_PVT_SLOT
  slot = Number.parseInt(data_decoded.slice(0, 2), 16);
  date = new Date(Number.parseInt(data_decoded.slice(2,10).match(/[a-fA-F0-9]{2}/g).reverse().join(''), 16)*1000).toUTCString();
  lat = Number.parseInt(data_decoded.slice(10,18).match(/[a-fA-F0-9]{2}/g).reverse().join(''), 16) * 1e-07;
  lon = Number.parseInt(data_decoded.slice(18,26).match(/[a-fA-F0-9]{2}/g).reverse().join(''), 16) * 1e-07;
  siv = Number.parseInt(data_decoded.slice(26, 28), 16);
  gspeed = Number.parseInt(data_decoded.slice(28,36).match(/[a-fA-F0-9]{2}/g).reverse().join(''), 16);
  batt = Number.parseInt(data_decoded.slice(36, 38), 16) / 10;
  temp = Number.parseInt(data_decoded.slice(38, 40), 16);
  
  // Update DOM element's inner HTML with decoded data
  base64_element.innerHTML += " \
    <br /><br /><b>Astrotracker Protocol V2</b> \
	<br />------------------------ \
    <br />Slot tag = " + slot + " \
    <br />Date = " + date + " \
    <br />Latitude = " + lat + " \
    <br />Longitude = " + lon + " \
    <br />Satellites in view = " + siv + " \
    <br />Ground speed = " + gspeed + "km/h \
    <br />Battery voltage = " + batt + "V \
    <br />Temperature = " + temp + "°C";
	
}