var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'IVolunteer',
  // App id
  id: 'com.green.ivolunteer',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/listActivity/',
      url: 'listActivity.html',
    },
    {
      path: '/',
      url: 'index.html',
    },
  ],
  // ... other parameters
});
var mainView = app.views.create('.view-main', {
    //domCache: true //enable inline pages
});
var db = null;
var imageUrl;
var $$ = Dom7;
// var imageUrl = null;
//
$$(document).on('page:init', function(e) {
  if(e && e.detail && e.detail.name == "listActivity"){
        var id = null;
        db.transaction(function(tx){
          tx.executeSql('SELECT * FROM activities',[],function(tx,results){

            console.log(results);
            var len = results.rows.length;
            for (var i=0; i<len; i++){
              jQuery("#activity_list").append('<li><a href="#"  class="item-content">  <div class="item-inner"><div data-id="'+results.rows.item(i).id+'" class="item-title panel-open getId"><div class="item-header">'+results.rows.item(i).activity_date+'</div>'+results.rows.item(i).activity_name+' - '+results.rows.item(i).activity_location+'</div><div data-deleteid="'+results.rows.item(i).id+'" class="item-after deleteBtn">delete</div></div></a></li>');
                //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
            }

          });
        }, errorCB,function(){
          console.log("Success");
        });
        jQuery(document).on("click","#saveDesc",function(e){
          db.transaction(function(tx){
            tx.executeSql('UPDATE activities SET desc = "'+jQuery("#event_desc").val()+'" WHERE id = '+id,[],function(tx,results){

              console.log(results);


            });
          }, errorCB,function(){
            console.log("Success");
          });
        });
        jQuery(document).on("click",".deleteBtn",function(e){
          var self = $(this);
          id = $(this).attr("data-deleteid");
          db.transaction(function(tx){
            tx.executeSql('DELETE FROM activities WHERE id = '+id,[],function(tx,results){
              self.parent().parent().parent().remove();
            });
          }, errorCB,function(){
            console.log("Success");
          });
        });
        jQuery(document).on("click",".getId",function(e){
          id = $(this).attr("data-id");
          db.transaction(function(tx){
            tx.executeSql('SELECT * FROM activities WHERE id = '+id,[],function(tx,results){

              console.log(results);
              var len = results.rows.length;
              if(len > 0){
                  //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
                  var htmlElem = '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_name+'</div></div></div></li>';
                  htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_location+'</div></div></div></li>';
                  htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_date+'</div></div></div></li>';
                  htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_time+'</div></div></div></li>';
                  htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).volunteer_name+'</div></div></div></li>';
                  if(results.rows.item(0).picture != null){
                    htmlElem +='<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label"><img style="max-width:100%; height:auto;" src="'+results.rows.item(0).picture+'" /></div></div></div></li>';
                  }
                  jQuery("#show_activity").html(htmlElem);
                  jQuery("#event_desc").val(results.rows.item(0).desc);
              }

            });
          }, errorCB,function(){
            console.log("Success");
          });
        });
  }
});


document.addEventListener("deviceready", onDeviceReady, false);
function errorCB(err) {
    console.log("SQL error: "+ err.message);
}
function successCB() {
    console.log(db);
}
function populateDB(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS activities');
    //console.log("debug","populateDB");
    tx.executeSql('CREATE TABLE IF NOT EXISTS activities (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, activity_name char(255), activity_location char(255), activity_date char(255), activity_time char(255), volunteer_name char(255), desc TEXT, picture TEXT)');

}
// PhoneGap is ready
//
function onDeviceReady() {
    //var db = window.sqlitePlugin.openDatabase({name: "mySQLite.ivolunteer", location: 'default'});
    console.log("onDeviceReady");
    db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default'});
    db.transaction(populateDB, errorCB,successCB);
    // db.transaction(function(tx){
    //
    // }, errorCB,function(){
    //   console.log("Success");
    // });
    //console.log(navigator.camera);

}

jQuery(document).on("click","#takePictureBtn",function(e){
  console.log("navigator.camera.getPicture");
  document.addEventListener("deviceready", function(){
    navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        console.log(imageData);
        imageUrl = "data:image/jpeg;base64," + imageData;
        jQuery("#imgDisplay").html('<img style="max-width:100%; height:auto;" src="'+imageUrl+'" />');
    }

    function onFail(message) {
        imageUrl = null
        jQuery("#imgDisplay").html("");
    }
  }, false);

});

jQuery(document).on("click","#saveBtn",function(){
  console.log("abc");
  var activity_name = jQuery("#activity_name").val();
  var activity_location = jQuery("#activity_location").val();
  var activity_date = jQuery("#activity_date").val();
  var activity_time = jQuery("#activity_time").val();
  var volunteer_name = jQuery("#volunteer_name").val();
  //var form_data = jQuery('#activityForm').serialize();


  //jQuery("#activityForm").submit();
  if(activity_name && activity_date && volunteer_name){
    jQuery("#errorMessage").hide();
    jQuery("#step1").hide();
    jQuery("#step2").show();
    var htmlElem = '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+activity_name+'</div></div></div></li>';
    htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+activity_location+'</div></div></div></li>';
    htmlElem +='<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+activity_date+'</div></div></div></li>';
    htmlElem +='<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+activity_time+'</div></div></div></li>';
    htmlElem +='<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+volunteer_name+'</div></div></div></li>';
    if(imageUrl != null){
      htmlElem +='<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label"><img style="max-width:100%; height:auto;" src="'+imageUrl+'" /></div></div></div></li>';
    }
    jQuery("#ulConformation").html(htmlElem);

    // db.transaction(function(tx){
    //   tx.executeSql('INSERT INTO activities (activity_name, activity_location, activity_date, activity_time, volunteer_name) VALUES ("'+activity_name+'","'+activity_location+'","'+activity_date+'","'+activity_time+'","'+volunteer_name+'")');
    // }, errorCB,function(){
    //   jQuery("#activityForm").find('input,  textarea').val('');
    // });
  } else {
    jQuery("#errorMessage").show().find("#errorMessageContainer").html("Please enter all the (*) inputs");
  }
});

jQuery(document).on("click","#clearBtn",function(){
  jQuery("#activityForm").find('input,  textarea').val('');
});

//var db = window.sqlitePlugin.openDatabase({name: "mySQLite.ivolunteer", location: 'default'});
//var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default', androidDatabaseImplementation: 2});
jQuery(document).on("click","#backBtn",function(){
  jQuery("#step1").show();
  jQuery("#step2").hide();
});

jQuery(document).on("click","#confirmBtn",function(){
  var activity_name = jQuery("#activity_name").val();
  var activity_location = jQuery("#activity_location").val();
  var activity_date = jQuery("#activity_date").val();
  var activity_time = jQuery("#activity_time").val();
  var volunteer_name = jQuery("#volunteer_name").val();
  var self = this;
  db.transaction(function(tx){

    tx.executeSql('INSERT INTO activities (activity_name, activity_location, activity_date, activity_time, volunteer_name, picture) VALUES (?,?,?,?,?,?)',[activity_name, activity_location, activity_date, activity_time, volunteer_name, imageUrl]);
  }, errorCB,function(){
    jQuery("#activityForm").find('input,  textarea').val('');
    mainView.router.load({url:"listActivity.html"});
    jQuery("#step1").show();
    jQuery("#step2").hide();
  });

});



// var $$ = Dom7;
// var imageUrl = null;
//
// $$(document).on('page:init', function(e) {
//   //console.log("pageInit",e)
//
//   if(e && e.detail && e.detail.name == "listActivity"){
//     //var db = window.sqlitePlugin.openDatabase({name: 'my.db', location: 'default', androidDatabaseImplementation: 2});
//     console.log("listActivity");
//     // var id = null;
//     // jQuery(document).on("click","#saveDesc",function(e){
//     //   db.transaction(function(tx){
//     //     tx.executeSql('UPDATE activities SET desc = "'+jQuery("#event_desc").val()+'" WHERE id = '+id,[],function(tx,results){
//     //
//     //       console.log(results);
//     //
//     //
//     //     });
//     //   }, errorCB,function(){
//     //     console.log("Success");
//     //   });
//     // });
//     // jQuery(document).on("click",".deleteBtn",function(e){
//     //   var self = $(this);
//     //   id = $(this).attr("data-deleteid");
//     //   db.transaction(function(tx){
//     //     tx.executeSql('DELETE FROM activities WHERE id = '+id,[],function(tx,results){
//     //       self.parent().parent().parent().remove();
//     //     });
//     //   }, errorCB,function(){
//     //     console.log("Success");
//     //   });
//     // });
//     // jQuery(document).on("click",".getId",function(e){
//     //   id = $(this).attr("data-id");
//     //   db.transaction(function(tx){
//     //     tx.executeSql('SELECT * FROM activities WHERE id = '+id,[],function(tx,results){
//     //
//     //       console.log(results);
//     //       var len = results.rows.length;
//     //       if(len > 0){
//     //           //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
//     //           var htmlElem = '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_name+'</div></div></div></li>';
//     //           htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_location+'</div></div></div></li>';
//     //           htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_date+'</div></div></div></li>';
//     //           htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).activity_time+'</div></div></div></li>';
//     //           htmlElem += '<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label">'+results.rows.item(0).volunteer_name+'</div></div></div></li>';
//     //           if(results.rows.item(0).picture != null){
//     //             htmlElem +='<li><div class="item-content item-input"><div class="item-inner"><div class="item-title item-label"><img style="max-width:100%; height:auto;" src="'+results.rows.item(0).picture+'" /></div></div></div></li>';
//     //           }
//     //           jQuery("#show_activity").html(htmlElem);
//     //           jQuery("#event_desc").val(results.rows.item(0).desc);
//     //       }
//     //
//     //     });
//     //   }, errorCB,function(){
//     //     console.log("Success");
//     //   });
//     // });
//
//
//   } else if(e && e.detail && e.detail.name == "home"){
//     console.log("home");
//
//     // jQuery( document ).ready(function( $ ) {
//     //   jQuery("#takePictureBtn").on("click",function(e){
//     //     console.log("navigator.camera.getPicture");
//     //   //   navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
//     //   //       destinationType: Camera.DestinationType.DATA_URL
//     //   //   });
//     //   //
//     //   //   function onSuccess(imageData) {
//     //   //       console.log(imageData);
//     //   //       imageUrl = "data:image/jpeg;base64," + imageData;
//     //   //       jQuery("#imgDisplay").html('<img style="max-width:100%; height:auto;" src="'+imageUrl+'" />');
//     //   //   }
//     //   //
//     //   //   function onFail(message) {
//     //   //       imageUrl = null
//     //   //       jQuery("#imgDisplay").html("");
//     //   //   }
//     //   });
//
//
//     //
//     //
//     // });
//   }
//
// });
