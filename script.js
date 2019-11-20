async function showBands(){
    let bandsJson = await fetch('api/bands');
    let bands = await bandsJson.json();
    let bandsDiv = document.getElementById("bands");
    bandsDiv.innerHTML = "";

    for(i in bands){
        bandsDiv.append(getBandElem(bands[i]));
    }
}

async function showBand(){
    let id = document.getElementById("txt-band-id").value;
    let response = await fetch(`api/bands/${id}`);
    let band = await response.json();

    let bandDiv = document.getElementById("band");
    bandDiv.append(getBandElem(band));
}

function getBandElem(band){
    let bandDiv = document.createElement("div");
    bandDiv.classList.add("band");
    let bandName = document.createElement("h3");
    bandName.innerHTML = band.id + ": " + band.name;

    let bandP = document.createElement("p");
    bandP.innerHTML = `was founded in ${band.date}, genre ${band.genre}, band is ${band.active}`;

    // create edit and delete links
    let editButton = document.createElement("button");
    editButton.href = "#edit-band-form";
    editButton.innerHTML = "Edit";
    editButton.setAttribute("data-id", band.id);
    editButton.onclick = showEditBand;
    let deleteButton = document.createElement("button");
    deleteButton.href = "#";
    deleteButton.innerHTML = "Delete";
    deleteButton.setAttribute("data-id", band.id);
    deleteButton.onclick = deleteBand;
    bandP.append(editButton);
    bandP.append(deleteButton);

    bandDiv.append(bandName);
    bandDiv.append(bandP);
    
    return bandDiv;
}

async function showDeleteBand() {
    const id = this.getAttribute("data-id");
    document.getElementById("")
}

async function showEditBand() {
    const id = this.getAttribute("data-id");
    document.getElementById("edit-band-id").innerHTML = id;

    let response = await fetch(`api/bands/${id}`);
    let band = await response.json();
    document.getElementById("txt-edit-band-name").value = band.name;
    document.getElementById("txt-edit-band-date").value = band.date;
    document.getElementById("txt-edit-band-genre").value = band.genre;
    document.getElementById("txt-edit-band-active").value = band.active;

    return false;
}

async function deleteBand() {
    const id = this.getAttribute("data-id");

    let response = await fetch(`/api/bands/${id}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        }
    });

    if (response.status != 200){
        console.log("Error deleting band");
        return;
    }

    showBands();
    return false;
}

async function addBand(){
    // get the song inforamtion
    const bandName = document.getElementById("txt-new-band-name").value;
    const bandDate = document.getElementById("txt-new-band-date").value;
    const bandGenre = document.getElementById("txt-new-band-genre").value;
    const bandActive = document.getElementById("txt-new-band-active").value;

    console.log(`You are adding ${bandName}, ${bandDate}, ${bandGenre}, ${bandActive}`);

    let band = {"name": bandName, "date": bandDate, "genre": bandGenre, "active": bandActive};

    let response = await fetch('/api/bands/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(band),
    });

    if (response.status != 200){
        console.log("Error adding band");
        return;
    }

    let result = await response.json();
    showBands();
}

async function editBand() {
    let id = document.getElementById("edit-band-id").textContent;
    let name = document.getElementById("txt-edit-band-name").value;
    let date = document.getElementById("txt-edit-band-date").value;
    let genre = document.getElementById("txt-edit-band-genre").value;
    let active = document.getElementById("txt-edit-band-active").value;
    let band = {"name": name, "date": date, "genre": genre, "active": active};

    let response = await fetch(`/api/bands/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(band),
    });

    if (response.status == 200) {
        console.log("Edited band");
    } else {
        console.log("Error editing band");
    }

    //update the song list
    showBands();
}

window.onload = function(){
    this.showBands();

    let showBandButton = document.getElementById("btn-show-band");
    showBandButton.onclick = showBand;

    let addBandButton = document.getElementById("btn-add-band");
    addBandButton.onclick = addBand;

    let editBandButton = document.getElementById("btn-edit-band");
    editBandButton.onclick = editBand;

    let deleteBandButton = document.getElementById("btn-delete-band");
    deleteBandButton.onclick = deleteBand;
}