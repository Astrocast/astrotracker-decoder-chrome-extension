// Function to decode base64 data
function base64ToBase16(str) {
  const raw = window.atob(str);
  let result = "";
  let i = 0;
  for (i = 0; i < raw.length; i += 1) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : "0" + hex);
  }
  return result.toUpperCase();
}

// Get DOM element containing payload
const base64_element = document.getElementById("base64");

// Decode base64 payload data
const data_encoded = base64_element.innerText;
const data_decoded = base64ToBase16(data_encoded);
const bytes = [...window.atob(data_encoded)].map(c => c.charCodeAt(0));

let messageHtml = '';

// AstroTracker v1 protocol - between 10 and 13 bytes - versioned 0x11
if (bytes.length >= 10 && bytes.length <= 13 && bytes[0] == 0x11) {
  let batt = (bytes[1] * 10) + 3000;
  let temp = bytes[2] << 24 >> 24; // signed 8-bit
  let siv = bytes[3];
  let altitude = ((bytes[5] << 8) | bytes[4]) << 16 >>  16; // signed 16-bit little endian
  let accuracy = (bytes[6] + 1) * 10;
  let heading = bytes[7] * 2;
  let gspeed = bytes[8];

  // Update DOM element's inner HTML with decoded data
  messageHtml = "<b>AstroTracker Protocol v1</b>" +
    "<br />------------------------" +
    `<br />Battery = ${batt} mV` +
    `<br />Temperature = ${temp} °C` +
    `<br />Satellites in view = ${siv}` +
    `<br />Altitude = ${altitude} m` +
    `<br />Accuracy = <${accuracy} m` +
    `<br />Heading = ${heading}°` +
    `<br />Ground speed = ${gspeed} km/h` +
    `<br />State = ${bytes[9]}`
  // Raw value of optional reserved bytes
  for (i = 10; i < bytes.length; i++)
    messageHtml += `<br />Reserved${i - 9} = ${'0x' + bytes[i].toString(16).padStart(2, '0')} (${bytes[i]})`;

// AstroTracker Protocol v0.1 - 6 bytes
} else if (data_decoded.length === 12) {
  let temp = Number.parseInt(data_decoded.slice(0, 2), 16);
  let batt = Number.parseInt(data_decoded.slice(2, 4), 16) / 10;
  let date = new Date(Number.parseInt(data_decoded.slice(4, 12).match(/[a-fA-F0-9]{2}/g).reverse().join(""), 16) * 1000).toISOString();

  messageHtml = "<b>AstroTracker Protocol v0.1</b>" +
    "<br />--------------------------" +
    `<br />Date = ${date}` +
    `<br />Battery = ${batt} V` +
    `<br />Temperature = ${temp} °C`;

// AstroTracker protocol v0.2 - 20 bytes LOGGER_TAG_PVT_SLOT
} else if (data_decoded.length === 40) {
  let slot = Number.parseInt(data_decoded.slice(0, 2), 16);
  let date = new Date(Number.parseInt(data_decoded.slice(2, 10).match(/[a-fA-F0-9]{2}/g).reverse().join(""), 16) * 1000).toISOString();
  let lat = Number.parseInt(data_decoded.slice(10, 18).match(/[a-fA-F0-9]{2}/g).reverse().join(""), 16) * 1e-07;
  let lon = Number.parseInt(data_decoded.slice(18, 26).match(/[a-fA-F0-9]{2}/g).reverse().join(""), 16) * 1e-07;
  let siv = Number.parseInt(data_decoded.slice(26, 28), 16);
  let gspeed = Number.parseInt(data_decoded.slice(28, 36).match(/[a-fA-F0-9]{2}/g).reverse().join(""), 16);
  let batt = Number.parseInt(data_decoded.slice(36, 38), 16) / 10;
  let temp = Number.parseInt(data_decoded.slice(38, 40), 16);

  // Update DOM element's inner HTML with decoded data
  messageHtml = "<b>AstroTracker Protocol v0.2</b>" +
    "<br />--------------------------" +
    `<br />Slot tag = ${slot}` +
    `<br />Date = ${date}` +
    `<br />Latitude = ${lat}` +
    `<br />Longitude = ${lon}` +
    `<br />Satellites in view = ${siv}` +
    `<br />Ground speed = ${gspeed} km/h` +
    `<br />Battery = ${batt} V` +
    `<br />Temperature = ${temp} °C`;
}

// Replace "Text" element's inner HTML with decoded data
if (messageHtml)
  document.getElementById("text").innerHTML = messageHtml;
