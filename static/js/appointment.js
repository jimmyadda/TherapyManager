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
        if(data.app_id){
            //was pending
            console.log("end of add ",data.app_id);
            deleteapprovedAppointment(data.app_id);
            
        }
    }

    function refreshParent() {
        window.opener.location.reload();
        window.close();
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
            getAppointment();
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
                            return '<button key="deletebtn" id="delbtn" class="btn-xs btn btn-danger delete-btn translate EN" type="button">Delete</button>';
                        }
                    }
        ]
            });
            $(".delete-btn").click(function() { // using the unique ID of the button
                var table = $('#datatable4').DataTable();
                var data = table.row($(this).parents('tr')).data();
                console.log(data.app_id)
                deleteAppointment(data.app_id);
              });


                     //call 
       //language
       console.log(my_lang,Translate_jsonData)
       if(my_lang=="HE"){
       translate_DOM_element('translate',Translate_jsonData,'EN',my_lang);     
       }
       else{
       translate_DOM_element('translate',Translate_jsonData,'HE',my_lang);  
       }  

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
         
//        $('#pendingunavailableHours').val(unavailableHours); 
     //disable datetime
     var disabletimepending = $('#unavailableHours').val().split(',');
     console.log(disabletimepending)





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
                            return '<button key="approvebtn" class="btn-xs btn btn-success edit-btn pendingedit translate EN" type="button">Approve</button>';
                        }
                    },
                    {
                        mRender: function (o) {
                            return '<button  key="deletebtn" class="btn-xs btn btn-danger pendingdel translate EN" type="button">Delete</button>';;
                        }
                    }
            ]
            });

            $(".pendingdel").click(function() { // using the unique ID of the button
                var table = $('#pendingtbl').DataTable();
                var data = table.row($(this).parents('tr')).data();
                console.log(data.app_id)
                deleterequestAppointment(data.app_id);
              });

              $(".pendingedit").click(function() { // using the unique ID of the button
                var table = $('#pendingtbl').DataTable();
                var data = table.row($(this).parents('tr')).data();  
                if(data){
                    console.log(data.app_id);
                    var dateavailable = false;
                    var datetocheck = data.appointment_date
                    if(disabletimepending.indexOf(datetocheck) > -1)
                    {
                        swal("Oops...", "This date is unavailable!", "error");
                    }
                    else
                    {
                        addAppointment(data);
                        //deleteapprovedAppointment(data.app_id);
                    }
                }
                else{
                    console.log("no Row Data")
                }

              });

       //call 
       //language
       console.log(my_lang,Translate_jsonData)
       if(my_lang=="HE"){
       translate_DOM_element('translate',Translate_jsonData,'EN',my_lang);     
       }
       else{
       translate_DOM_element('translate',Translate_jsonData,'HE',my_lang);  
       }  

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
                                 //send mmessage to patient portal
                                 let f = new FormData();
                                 f.append("app_id",id)
                     
                                 fetch("/postmsg",{
                                 "method": "POST",
                                 "body":f,       
                                 }).then(response => response.text()).then(data => { 
                                    console.log(data);          
                                 });

                                 
 $.ajax(settings).done(function (response) {
   swal("Deleted!", "Appointment Request has been deleted.", "success");


            table.destroy();
            $('#pendingtbl tbody').empty(); // empty in case the columns change
            location.reload();
            getPendingAppointment();

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
                    location.reload();
                    getPendingAppointment()
                });
    }



    $("#addpatient").click(function () {

    $('#myModal').modal().one('shown.bs.modal', function (e) {

    $("#doctor_select").html(doctorSelect)
     $("#patient_select").html(patientSelect)
    
     //disable datetime
     var disabletime = $('#unavailableHours').val().split(',');
      disabletime = changearrformat(disabletime);



      $(".form_datetime").datetimepicker({
         format: 'yyyy-mm-dd hh:ii:00',
         minuteStep : 60,        
         startDate: new Date(),
         initialDate: new Date(),
         onRenderHour:function(date){
            if(disabletime.indexOf(formatDate(date)+":"+pad(date.getUTCHours()))>-1)
              {
                  return ['disabled'];
              }
        }         
    });

            $("#savethepatient").off("click").on("click", function(e) {
                console.log("appointmentjs")
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


        // async function checkdate(data){
        //     //Check Date 
        //     let f = new FormData();
        //     f.append("appointmentdate",data.appointment_date)
        //     f.append("pat_id",data.pat_id)
        //     console.log('checkdate')
        //     const response = await fetch("/checkdate",{
        //     "method": "POST",
        //     "body":f,       
        //     })
        //     const chedatdate = await response.text();
        //     return chedatdate;
        // }

        getAppointment();
        getPendingAppointment();

getDoctor();
getPatient();






});