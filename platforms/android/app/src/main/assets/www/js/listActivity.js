jQuery(document).ready(function(){
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM activities',[],function(tx,results){

      //console.log(results);
      var len = results.rows.length;
      for (var i=0; i<len; i++){
        jQuery("#activity_list").append('<li><a href="#"  class="item-content">  <div class="item-inner"><div data-id="'+results.rows.item(i).id+'" class="item-title panel-open getId"><div class="item-header">'+results.rows.item(i).activity_date+'</div>'+results.rows.item(i).activity_name+' - '+results.rows.item(i).activity_location+'</div><div data-deleteid="'+results.rows.item(i).id+'" class="item-after deleteBtn">delete</div></div></a></li>');
          //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
      }

    });
  }, errorCB,function(){
    console.log("Success");
  });

});
