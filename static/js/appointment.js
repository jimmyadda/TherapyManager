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

            //send mail 
            let f = new FormData();
            f.append("id",data.pat_id)
            f.append("doc_id",data.doc_id)
            f.append("appointment_date",data.appointment_date)

            fetch("/send-mail",{
            "method": "POST",
            "body":f,       
            }).then(response => response.text()).then(data => {               
            });
            getAppointment()
        });

    }

    function deleteAppointment(id) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointmentapi/" + id,
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
        var unavailableHours = [];
        $('#unavailableHours').val(unavailableHours); 

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
        //set available hours
        var indx  = unavailableHours.indexOf(response[i].appointment_date);
        if (indx <=0){unavailableHours.push(response[i].appointment_date);}
        

        response[i].pat_fullname=response[i].pat_first_name+" "+response[i].pat_last_name
        response[i].doc_fullname=response[i].doc_first_name+" "+response[i].doc_last_name
        }

        $('#unavailableHours').val(unavailableHours); 

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
                deleteAppointment(data.app_id)
            });


        });


    }

 // PENDING
 
 
    function getPendingAppointment() {
        var unavailableHours = [];
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointmentrequestapi",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).done(function (response) {
        
        for(i=0;i<response.length;i++){
        //set available hours
        var indx  = unavailableHours.indexOf(response[i].appointment_date);
        if (indx <=0){unavailableHours.push(response[i].appointment_date);}


        response[i].pat_fullname=response[i].pat_first_name+" "+response[i].pat_last_name
        response[i].doc_fullname=response[i].doc_first_name+" "+response[i].doc_last_name
        }

        $('#pendingunavailableHours').val(unavailableHours); 

            table = $('#pendingtbl').DataTable({
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
                            return '<button class="btn-xs btn btn-success edit-btn" type="button">Approve</button>';
                        }
                    },
                    {
                        mRender: function (o) {
                            return '<button class="btn-xs btn btn-danger delete-btn" type="button">Delete</button>';;
                        }
                    }
            ]
            });



                        //delete
                        $('#pendingtbl tbody').off('click').on('click', '.delete-btn', function () {
                            var data = table.row($(this).parents('tr')).data();
                            deleterequestAppointment(data.app_id)
                        });
            
                                //approve           
                                $('#pendingtbl tbody').off('click').on('click', '.edit-btn',function () {
                                    var data = table.row($(this).parents('tr')).data();                
                                    console.log(data.appointment_date);
            
                                    var available =  checkdate(data).
                                    then(response => 
                                      {
                                        console.log("response",response);
                                        if(response=="OK")
                                        {
                                          addAppointment(data);
                                          deleteapprovedAppointment(data.app_id);
                                        }
                                        else{
                                          swal("Oops...", "This date is unavailable!", "error");
                                        }
                                      }); 
            
                                });

        });




    }
    
 function deleterequestAppointment(id) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointmentrequestapi/" + id,
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
   swal("Deleted!", "Appointment Request has been deleted.", "success");
            table.destroy();
            $('#pendingtbl tbody').empty(); // empty in case the columns change
            getPendingAppointment()
        });


});

    }


    function deleteapprovedAppointment(id) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "appointmentrequestapi/" + id,
            "method": "DELETE",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "28ea8360-5af0-1d11-e595-485a109760f2"
            }
        }
    $.ajax(settings).done(function (response) {                
                $('#pendingtbl tbody').empty(); // empty in case the columns change
                getPendingAppointment()
            });
    }

    $("#addpatient").click(function () {

    $('#myModal').modal().one('shown.bs.modal', function (e) {

    $("#doctor_select").html(doctorSelect)
     $("#patient_select").html(patientSelect)
       

      $(".form_datetime").datetimepicker({
         format: 'yyyy-mm-dd hh:ii:00',
         minuteStep : 30,        
         startDate: new Date(),
         initialDate: new Date(),
         onRenderDay: function(date) {
          alert(date);
        }
    });
    $('#datepicker1').on('changeDate', function(event) {
       var reqDate = $('#datepicker1').val()
       //check date
    });

     //    $('#datepicker1').datetimepicker('setHoursDisabled', [0,1,2,3,4,5,6,7,18,19,20,21,22,23]); 



            $("#savethepatient").off("click").on("click", function(e) {
            var instance = $('#detailform').parsley();
            instance.validate()
             if(instance.isValid()){
                jsondata = $('#detailform').serializeJSON();
                let pat_id = jsondata.pat_id;
                addAppointment(jsondata);
                //send mail to patient
                  
                }
              
            })

        })



    })


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


        async function checkdate(data){
            //Check Date 
            let f = new FormData();
            f.append("appointmentdate",data.appointment_date)
            f.append("pat_id",data.pat_id)
            console.log('checkdate')
            const response = await fetch("/checkdate",{
            "method": "POST",
            "body":f,       
            })
            const chedatdate = await response.text();
            return chedatdate;
        }

getDoctor()
getPatient()
getAppointment()
getPendingAppointment()
})