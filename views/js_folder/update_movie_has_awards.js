// Get the objects we need to modify
let updateMovieForm = document.getElementById('update-movie_awards-form');
// Modify the objects we need
updateMovieForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    location.reload();

    // Get form fields we need to get data from
    let inputMovieName = document.getElementById("input-movie-update");
    let inputAwardID = document.getElementById("input-movie_awards-update");
    console.log(inputMovieName)

    // Get the values from the form fields
    let movieNameValue = inputMovieName.value;
    let awardValue = inputAwardID.value;
    console.log(movieNameValue)
    console.log(awardValue)

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(awardValue)) {
        console.log("Error here - awardValue is NAN")
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        award_ID: awardValue,
        movie_ID: movieNameValue,

    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", '/put-movie_awards-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, movieNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, movieID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("moviesHasAwardsTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == movieID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].award_ID;


        }
    }
}