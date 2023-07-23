'use strict'


function linkClick() {
    fetch('https://web.engr.oregonstate.edu/~goodroem/CS_340/index.html')
        .then(response => response.json())
        .then(data => jsonReader(data))

}