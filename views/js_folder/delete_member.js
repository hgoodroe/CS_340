// refer to README for reference 

function deleteMember(member_ID) {
    let link = '/delete-member-ajax/';
    let data = {
      member_ID: member_ID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(member_ID);
      }
    });
  }
  
  function deleteRow(member_ID){
      let table = document.getElementById("memberTable");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == member_ID) {
              table.deleteRow(i);
              break;
         }
      }
  }