const nasaApp = {}
nasaApp.apiKey = 'JmlFzDiOm6OqPOcorofcLCfA4Oof3sUvRqlbgEAC';
nasaApp.baseUrl = 'https://images-api.nasa.gov'

nasaApp.init = function () {
    nasaApp.getResources();
};
//Get queen information from API
//set up parameter to take in the dropdown value in this case query
nasaApp.getResources = () => {
    $.ajax({
        url: `${nasaApp.baseUrl}/search`,
        method: "GET",
        dataType: "json",
        //Pass parameters as data objects
        data: {
            q: 'apollo11',
            api_key: nasaApp.Key 
        }
    }).done(result => {
        console.log(result.collection.items[0].data)
    });
};

$(function () {
    nasaApp.init();

});