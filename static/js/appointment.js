$(document).ready(function () {

    var table


    function addAppointment(data) {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointmentapi",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "2612534b-9ccd-ab7e-1f73-659029967199"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        $.ajax(settings).done(function (response) {
         $.notify("Appointment Added Successfully", {"status":"success"});

            $('.modal.in').modal('hide')
            table.destroy();
            $('#datatable4 tbody').empty(); // empty in case the columns change
            getAppointment()
        });

    }

    function deleteAppointment(id) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointment/" + id,
            "method": "DELETE",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "28ea8360-5af0-1d11-e595-485a109760f2"
            }
        }

swal({
    title: "Are you sure?",
    text: "You will not be able to recover this data",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    closeOnConfirm: false
}, function() {
 $.ajax(settings).done(function (response) {
   swal("Deleted!", "Appointment has been deleted.", "success");
            table.destroy();
            $('#datatable4 tbody').empty(); // empty in case the columns change
            getAppointment()
        });


});

    }



    function getAppointment() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointmentapi",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {

        for(i=0;i<response.length;i++){
        response[i].pat_fullname=response[i].pat_first_name+" "+response[i].pat_last_name
        response[i].doc_fullname=response[i].doc_first_name+" "+response[i].doc_last_name
        }



            table = $('#datatable4').DataTable({
                "bDestroy": true,
                'paging': true, // Table pagination
                'ordering': true, // Column ordering
                'info': true, // Bottom left status text
                aaData: response,
                   "aaSorting": [],
                aoColumns: [
                    {
                        mData: 'doc_fullname'
                    },
                    {
                        mData: 'pat_fullname'
                    },
                    {
                        mData: 'appointment_date'
                    },
                    {
                        mRender: function (o) {
                            return '<button class="btn-xs btn btn-danger delete-btn" type="button">Delete</button>';
                        }
                    }
        ]
            });
            $('#datatable4 tbody').on('click', '.delete-btn', function () {
                var data = table.row($(this).parents('tr')).data();
                console.log(data)
                deleteAppointment(data.app_id)

            });


        });


    }




    $("#addpatient").click(function () {

        $('#myModal').modal().one('shown.bs.modal', function (e) {

    $("#doctor_select").html(doctorSelect)
     $("#patient_select").html(patientSelect)

      $(".form_datetime").datetimepicker({
         format: 'yyyy-mm-dd hh:ii:ss',
         startDate:new Date(),
        initialDate: new Date()
    });
            $("#savethepatient").off("click").on("click", function(e) {


            var instance = $('#detailform').parsley();
            instance.validate()
                    if(instance.isValid()){
                jsondata = $('#detailform').serializeJSON();
                addAppointment(jsondata)
                }

            })

        })



    })

  // Handel date

  var array = ["2024-02-14","2024-02-15","2024-02-16"]

  $('#datepicker1').datetimepicker({
      beforeShowDay: function(date){
          var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
          return [ array.indexOf(string) == -1 ]
      }
  });



    $("#datepicker1").datetimepicker().on("hide", function(e){   
      var first = e.target.value;  
      first = new Date(first);  
      const yyyy = first.getFullYear();
      let mm = first.getMonth() + 1; // Months start at 0!
      let dd = first.getDate();   
      let HH = first.getHours();  
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;  
      first = yyyy + '-' + mm + '-' + dd+ " " + HH+":00" ;  
      var x = document.getElementById("datepicker1");      
      x.value = first;
    });


var doctorSelect=""
 function getDoctor() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "doctorapi",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {

        for(i=0;i<response.length;i++){

        response[i].doc_fullname=response[i].doc_first_name+" "+response[i].doc_last_name
        doctorSelect +="<option value="+response[i].doc_id+">"+response[i].doc_fullname+"</option>"
        }


        })
        }
var patientSelect=""
  function getPatient() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "patientapi",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {
         for(i=0;i<response.length;i++){
          response[i].pat_fullname=response[i].pat_first_name+" "+response[i].pat_last_name
        patientSelect +="<option value="+response[i].pat_id+">"+response[i].pat_fullname+"</option>"
        }

                })
        }

getDoctor()
getPatient()
getAppointment()
})