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
    bandP.innerHTML = `was founded in ${band.date}, genre ${band.genre}`;

    bandDiv.append(bandTitle);
    bandDiv.append(bandP);
    
    return bandDiv;
}

async function addBand(){
    //get the song inforamtion
    const bandName = document.getElementById("txt-new-band-name").value;
    const bandDate = document.getElementById("txt-new-band-date").value;
    const bandGenre = document.getElementById("txt-new-band-genre").value;

    console.log(`you are adding ${bandName}, ${bandDate}, ${bandGenre}`);

    let band = {"name": bandName, "date":bandDate, "genre":bandGenre};

    let response = await fetch('/api/bands/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(band),
    });

    if(respose != 200){
        console.log("Error adding band");
        return;
    }

    let result = await response.json();
    showBands();
}

window.onload = function(){
    this.showBands();
    let showBandButton = document.getElementById("btn-show-band");
    showBandButton.onclick = showBand;

    let addBandButton = document.getElementById("btn-add-band");
    addBandButton.onclick = addBand;
}