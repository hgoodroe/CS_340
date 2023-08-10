// Get the objects we need to modify
let updateMovieForm = document.getElementById('update-movie-form');

// Modify the objects we need
updateMovieForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    location.reload();

    // Get form fields we need to get data from
    let inputMovieName = document.getElementById("mySelect");
    let inputSubGenre = document.getElementById("input-sub_genre-update");
    console.log(inputMovieName)

    // Get the values from the form fields
    let movieNameValue = inputMovieName.value;
    let sub_GenreValue = inputSubGenre.value;
    console.log(movieNameValue)
    console.log(sub_GenreValue)

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(sub_GenreValue)) {
        console.log("Error here - sub_GenreValue is NAN")
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        sub_genre_ID: sub_GenreValue,
        movie_id: movieNameValue,

    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", '/put-movie-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, sub_GenreValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, movieNameValue) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("movieTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == movieNameValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[7];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].sub_genre_ID;
        }
    }
}