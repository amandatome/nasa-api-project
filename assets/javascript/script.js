//=======================================================================================================
const nasaApp = {}
//INITIALIZE FIREBASE=======================================================================================================
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCXq4OQ4ffH91LbrriWfg5UyJXvXMG9pls',
    authDomain: 'nasa-api-51f62.firebaseapp.com',
    databaseURL: 'https://nasa-api-51f62.firebaseio.com',
    projectId: 'nasa-api-51f62',
    storageBucket: 'nasa-api-51f62.appspot.com',
    messagingSenderId: '284626038035',
    appId: '1:284626038035:web:1904faed193f8dfa48fee6'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
let first = 0;
let last = 21;
let storedResult = [];

//SCROLL BUTTON===============================================================
$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('#back-to-top').fadeIn();
    } else {
        $('#back-to-top').fadeOut();
    }
});
// scroll body to 0px on click
$('#back-to-top').click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 400);
    return false;
});

// ===========================================================================
let buttons = ['Black Holes', 'Comets', 'Moon Landing', 'Mars Rover', 'Solar System'];
//Loop through array and append
nasaApp.makeButton = () => {
    buttons.forEach(buttonDisplay => {
        const userButtons = `<button class='btn btn-md mr-2 mb-3' value='${buttonDisplay}' role='button'>${buttonDisplay}</button>`
        $('.buttons').append(userButtons)
    });
};

//WIKIPEDIA API===============================================================
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

//NASA IMAGE OF DAY API=======================================================
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
    }).catch(function (err) {
        console.error(err);
    });
};

//NASA API===================================================================
//Display next and prev
//Loop through stored results
nasaApp.storedLoop = () => {
    for (let k = 0; k < storedResult.length; k++) {
        const newResults = storedResult[k].slice(first, last)
        nasaApp.displayImages(newResults)
    };
};

$(document).on('click', '#prev', function (event) {
    const target = event.target;
    if (target.id === 'prev') {
        if (first === 0) {
            //TODO module
            alert("You are already at the beginning")
            first = first;
            last = last;
        } else {
            first = first - 22;
            last = last - 21;
            $('.results').empty();
        };
    };
    nasaApp.storedLoop();
});

$(document).on('click', '#next', function (event) {
    const target = event.target;
    if (target.id === 'next') {
        if (last >= 800) {
            //TODO module
            alert("You are at the end")
            first = first;
            last = last;
        } else {
            first = first + 22;
            last = last + 21;
            $('.results').empty();
        };
    };
    nasaApp.storedLoop();
});

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
                               <img src=${image} class='card-img-top img-thumbnail' alt='${title}'/>
                                <div class='card-body'>
                                  <h4 class='card-title text-center'>${title}</h4>
                                  <p class='card-text'>${descriptionSummary}...</p>
                                  <a class='learn-more' target=_blank href=https://images.nasa.gov/details-${id}>Learn More</a>
                                </div>
                                <div class='card-footer text-center text-muted'>
                                <button class='btn heart' id=${id}>
                                <i class='far fa-heart'></i><span>Like</span></button></div>`;
        $('.results').append(display);
        nasaApp.liked('#' + id);
        nasaApp.remove();
    });
};

//Set up favourited items
nasaApp.liked = (item) => {
    $(item).on('click', function (event) {
        $('.favourite-section').show();
        let icon = $(this).find('i');
        icon.addClass('fas');
        icon.removeClass('far');
        $(this).attr('disabled', true);
        //Traverse DOM and get image of corresponding button
        let likedImage = $(this).parent().siblings();
        likedImage = likedImage[0]
        likedImage = $(likedImage).attr('src');
        //Traverse DOM and get title of corresponding button
        let likedTitle = $(this).parent().siblings();
        likedTitle = likedTitle[1]
        likedTitle = $(likedTitle).find('.card-title').html();

        //Save to object
        let liked = { likedImage, likedTitle };

        //Save object to firebase for storage
        database.ref('/liked').push(liked);

        database.ref('/liked').once('child_added', function (childSnapshot) {
            const key = childSnapshot.key;
            const favImage = childSnapshot.val().likedImage;
            const favTitle = childSnapshot.val().likedTitle;

            //Append to DOM
            const likedCard = `<div class='card text-center favourite' id=${item}>
                    <img src=${favImage} class='card-img-top img-thumbnail mb-4' alt='${favTitle}'/>
                     <div class='card-footer fav-button text-center liked text-muted'>
                     <button class='btn fav' data-key=${key}>Remove</button></div>`;
            $('#fav').append(likedCard)
        });
    });
};

//Remove favourited items
nasaApp.remove = function () {
    $(document).on('click', '.fav', function (event) {
        const keyRef = this.dataset.key;
        database.ref('/liked').child(keyRef).remove();
        $(this).closest('.card').remove();
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
        inputValue = $('input').val().trim();
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
            page: 5,
            media_type: 'image'
        }
    }).then(results => {
        $('.results').empty();
        let filteredResults = results.collection.items;
        storedResult.push(filteredResults);
        let reducedResults = results.collection.items.slice(first, last);
        nasaApp.displayImages(reducedResults);
    }).catch(function (err) {
        console.error(err);
    });
};

nasaApp.init = function () {
    nasaApp.makeButton();
    nasaApp.getPhotoResources();
    nasaApp.getTextResources();
    nasaApp.input();
    $('.favourite-section').hide();
};

//Launch application and run init
$(function () {
    nasaApp.init();
});