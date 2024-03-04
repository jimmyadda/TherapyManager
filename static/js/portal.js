$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const patienid = urlParams.get('id')

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "portal",
  "method": "GET",
  "headers": {
    "cache-control": "no-cache"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
  $('#patientcount').text(response.patient)
  $('#doctorcount').text(response.doctor)
  // $('#Myappointmentcount').text(response.appointment)
});


})
