//Code for the functions deleteMember & deleteRow
//Copied from/ modified from the nodejs-start-app
//from osu-cs340-campus git account- Step 7 - Dynamically Deleting Data
//Date: 8/14/2023
//URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

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
    success: function (result) {
      deleteRow(member_ID);
    }
  });
}

function deleteRow(member_ID) {
  let table = document.getElementById("memberTable");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == member_ID) {
      table.deleteRow(i);
      break;
    }
  }
}