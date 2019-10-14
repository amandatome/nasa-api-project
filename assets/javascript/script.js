//=======================================================================================================
const nasaApp = {}
let buttons = ['Apollo 11', 'Mars', 'Moon Landing', 'ISS', 'Canadarm'];
//Loop through array and append
nasaApp.makeButton = () => {
    buttons.forEach(buttonDisplay => {
        const userButtons = `<button class='btn btn-md mr-2 mb-3' value='${buttonDisplay}' role='button'>${buttonDisplay}</button>`
        $('.buttons').append(userButtons)
    });
};

//WIKIPEDIA API=======================================================================================================
nasaApp.appendText = (title, text, link) => {
    const textTitle = `<h2 class='display-4'>${title}</h2>`;
    const paragraph = `<p>${text}</p>`;
    const linkUrl = `Read more at <a target=_blank href='${link}'>${link}</a>`;
    $('#text-title').append(textTitle);
    $('#nasa-paragraph').append(paragraph);
    $('#nasa-paragraph').append(linkUrl);
};

nasaApp.wikiURL = 'https://en.wikipedia.org/w/api.php';
//API Call - NASA Info
nasaApp.getTextResources = () => {
    $.ajax({
        url: `${nasaApp.wikiURL}`,
        method: 'GET',
        dataType: 'jsonP',
        //Pass parameters as data objects
        data: {
            action: 'opensearch',
            search: 'NASA',
            format: 'json',
            limit: 5
        }
    }).then(result => {
        //Hard code for page load
        nasaApp.appendText(result[0], result[2][0], result[3][0]);
    });
};
//API Call - Search Info
nasaApp.getSearchResources = (query) => {
    $.ajax({
        url: `${nasaApp.wikiURL}`,
        method: 'GET',
        dataType: 'jsonP',
        //Pass parameters as data objects
        data: {
            action: 'opensearch',
            search: query,
            format: 'json',
            limit: 5
        }
    }).then(result => {
        $('#nasa-paragraph, #text-title, #extra-info').empty();
        //Loop for inner values of the results of index 1 and 3
        for (let i = 0; i < result.length; i++) {
            const moreTitles = result[1][i];
            const moreLinks = result[3][i]
            const otherOptions = `<ul class='ml-3'><li><a target=_blank href='${moreLinks}'>${moreTitles}</a></li></ul>`;
            $('#extra-info').append(otherOptions);
        };
        nasaApp.appendText(result[0], result[2][0], result[3][0]);
    });
};

//NASA IMAGE OF DAY API=======================================================================================================
nasaApp.apiKey = 'JmlFzDiOm6OqPOcorofcLCfA4Oof3sUvRqlbgEAC',
    nasaApp.baseUrlPhoto = 'https://api.nasa.gov/planetary/apod?'

nasaApp.getPhotoResources = () => {
    $.ajax({
        url: `${nasaApp.baseUrlPhoto}`,
        method: 'GET',
        dataType: 'json',
        //Pass parameters as data objects
        data: {
            api_key: nasaApp.apiKey,
        }
    }).then(result => {
        const imageUrl = result.url;
        const imageTitle = result.title;
        const imageOfDay = `<div class='card text-center ml-3'>
       <img src=${imageUrl} class='card-img-top ' alt='${imageTitle}'>
       <div class='card-body'>
       <h4 class='card-title'>${imageTitle}</h4>
        </div>
        <div class='card-footer text-muted'>Image of the Day courtesy of NASA APOD API</div>
      </div>`;
        $('#extra-info').append(imageOfDay);
    });
};

//NASA API=======================================================================================================
//Loop through results
nasaApp.displayImages = function (card) {
    //Initial forEach to iterate through results
    card.forEach(function (result) {
        const title = result.data[0].title;
        const id = result.data[0].nasa_id;
        //Shorten the description of each entry
        let description = result.data[0].description;
        description = description.substr(0, 225);
        let descriptionSummary = description.substr(0, Math.min(description.length, description.lastIndexOf(' ')))
        const image = result.links[0].href;
        //Create HTML for NASA Info
        const display = `<div class='card text-center'>
                               <img src=${image} class='card-img-top' alt='${title}'>
                                <div class='card-body '>
                                  <h4 class='card-title text-center'>${title}</h4>
                                  <p class='card-text'>${descriptionSummary}...</p>
                                </div>
                                <div class='card-footer text-center text-muted'>
                                <a target=_blank href=https://images.nasa.gov/details-${id}>Learn More</a>
                                </div>
                        </div>`;
        $('.results').append(display);
    });
};

//Get input values for search
nasaApp.input = () => {
    $('button').on('click', function (event) {
        let inputValue = $(this).val().trim();
        if (event.target.value) {
            nasaApp.getResources(inputValue);
            nasaApp.getSearchResources(inputValue)
        } else {
            return;
        };
    });

    $('form').on('submit', (event) => {
        event.preventDefault();
        inputValue = $('input').val();
        $('input').val('');
        //Make a new button
        buttons.push(inputValue);
        $('.buttons').empty();
        nasaApp.makeButton();
        if (event.type === 'submit') {
            nasaApp.getResources(inputValue);
            nasaApp.getSearchResources(inputValue);
        } else {
            return;
        };
    });
};

nasaApp.baseUrl = 'https://images-api.nasa.gov';

//API Call
nasaApp.getResources = (query) => {
    $.ajax({
        url: `${nasaApp.baseUrl}/search`,
        method: 'GET',
        dataType: 'json',
        //Pass parameters as data objects
        data: {
            q: query,
            page: 1,
            media_type: 'image'
        }
    }).then(results => {
        $('.results').empty();
        reducedResults = results.collection.items.slice(20, 41);
        nasaApp.displayImages(reducedResults);
    });
};

nasaApp.init = function () {
    nasaApp.makeButton();
    nasaApp.getPhotoResources();
    nasaApp.getTextResources();
    nasaApp.input();
};

//Launch application and run init
$(function () {
    nasaApp.init();
});