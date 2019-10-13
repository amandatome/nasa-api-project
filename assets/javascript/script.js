//Set up array of popular subjects to generate buttons
let buttons = ['Apollo 11', 'Mars', 'Moon Landing', 'ISS', 'Canadarm'];
// console.log(buttons)
//Loop through array and append
buttons.forEach(buttonDisplay => {
    const userButtons = `<button class="btn btn-md mr-2" value='${buttonDisplay}' role="button">${buttonDisplay}</button>`
    // console.log(userButtons)
    $('.buttons').append(userButtons)
})
//=======================================================================================================
const nasaApp = {}

//=======================================================================================================


//Wikipedia API
// nasaApp.displayText = function(info) {
//     info.forEach(function(text) {
//         const paragraph = `<p>${text}</p>`
//         $('#nasa-paragraph').append(paragraph)
//         // console.log(text[0])
//     });
// }


//WIKIPEDIA API=======================================================================================================

nasaApp.appendText = (title, text, link) => {
    const textTitle =  `<h2 class='display-4'>${title}</h2>`
    const paragraph = `<p>${text}</p>`
    const linkUrl = `Read more at: <a href="${link}">${link}</a>`   
    $('#text-title').append(textTitle) 
    $('#nasa-paragraph').append(paragraph)
    $('#nasa-paragraph').append(linkUrl)
};

nasaApp.extraInfo = function(info, param) {
        info.forEach(function(title) {
           
            console.log(title)
        });
        param.forEach(function(link) {
           
            console.log(link)
        });
    };

nasaApp.wikiURL = "https://en.wikipedia.org/w/api.php";

nasaApp.getTextResources = () => {
    $.ajax({
        url: `${nasaApp.wikiURL}`,
        method: "GET",
        dataType: "jsonP",
        //Pass parameters as data objects
        data: {
            action: 'opensearch',
            search: 'NASA',
            format: 'json',
            limit: 5
        }
    }).then(result => {
        //    console.log(result)
        //Hard code for page load
        nasaApp.appendText(result[0], result[2][0], result[3][0]);
        //
    });
};

nasaApp.getSearchResources = (query) => {
    $.ajax({
        url: `${nasaApp.wikiURL}`,
        method: "GET",
        dataType: "jsonP",
        //Pass parameters as data objects
        data: {
            action: 'opensearch',
            search: query,
            format: 'json',
            limit: 5
        }
    }).then(result => {
        $('#nasa-paragraph, #text-title').empty();
        //Loop for inner values of the results of result 1
        // for(let i = 0; i < result.length; i++){
        //     const moreTitles = result[1][i];
        //     const moreLinks = result[3][i]
        //     const otherOptions = `<p>Not what you're looking for? Try some of the following links:<a href="${moreLinks}">${moreTitles}</a></p>`
        //     $('#nasa-paragraph').append(otherOptions);
           
        //     // console.log(result[3][i])
        // };
        nasaApp.extraInfo(result[1], result[3])
   
        // result[1].forEach((element) => {
        //     console.log(element)
        // })

        // result[3].forEach((element2) => {
        //     console.log(element2)
        // })
        //  console.log(result[1][i])

        // console.log(result[1])
        nasaApp.appendText(result[0], result[2][0], result[3][0]);
        console.log(result)
    });
};

//NASA API=======================================================================================================

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
            const display = `<div class="card">
                               <img src=${image} class="card-img-top" alt="${title}">
                                <div class="card-body">
                                  <h3 class="card-title text-center">${title}</h3>
                                  <p class="card-text">${descriptionSummary}...</p>
                                  <p><a target=_blank href=https://images.nasa.gov/details-${id}>Read More</a></p>
                                </div>
                              </div>`
            $('.results').append(display)
    });
}

nasaApp.init = function () {
    //Get values of click events and search input and check which input is used with conditionals
    $('button').on('click', function (event) {
        let inputValue = $(this).val().trim();
        if(event.target.value){
            nasaApp.getResources(inputValue);
            nasaApp.getSearchResources(inputValue)
        } else {
            return;
        };
    });

    $('form').on('submit', (event) => {
        event.preventDefault();
        inputValue = $('input').val();
        if(event.type === 'submit'){
            nasaApp.getResources(inputValue);
            nasaApp.getSearchResources(inputValue);
        } else {
            return;
        };
    });
    //Run hardcoded NASA Search onload
    nasaApp.getTextResources();
};

nasaApp.apiKey = 'JmlFzDiOm6OqPOcorofcLCfA4Oof3sUvRqlbgEAC',
nasaApp.baseUrl = 'https://images-api.nasa.gov'

nasaApp.getResources = (query) => {
    $.ajax({
        url: `${nasaApp.baseUrl}/search`,
        method: "GET",
        dataType: "json",
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


//Launch application and run init
$(function () {
    nasaApp.init();
});

// const nasaApp2 = {}
// nasaApp.apiKey = 'JmlFzDiOm6OqPOcorofcLCfA4Oof3sUvRqlbgEAC',
// nasaApp.baseUrlPhoto = 'https://api.nasa.gov/planetary/apod?'

// nasaApp.init = function () {
//     nasaApp.getResources();
// };

// nasaApp.getResources = () => {
//     $.ajax({
//         url: `${nasaApp.baseUrlPhoto}`,
//         method: "GET",
//         dataType: "json",
//         //Pass parameters as data objects
//         data: {
//             api_key: nasaApp.apiKey 
//         }
//     }).done(result => {
//        console.log(result)
//        let $image = result.url
//        console.log($image)
//     });
// };

// $(function () {
//     nasaApp.init();

// });

//==========================================================



