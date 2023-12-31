// Get the objects we need to modify
let updateEmailForm = document.getElementById('update-email-form');

// Modify the objects we need
updateEmailForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Force page refresh
    location.reload(true);

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputEmail = document.getElementById("input_email_update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let newEmail = inputEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        email: newEmail
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-email-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, nameValue) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("memberTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == nameValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].email;
        }
    }
}