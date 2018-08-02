const ENDPOINT_URL = "https://www.googleapis.com/youtube/v3/search";
let nextToken = '';
let prevToken = '';
let token = '';
let searchInfo = '';

function createSearchQuery(queryString, token, callback) {
  const query = {
    url: ENDPOINT_URL,
    data: {
      maxResults: '5',
      part: 'snippet',
      pageToken: token,
      key: 'PLACE_HOLDER_FOR_API_KEY',
      q: queryString,
      type: '',
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  console.log(token);
  $.ajax(query);
}

function processResults(data) {
  const nextButton = `<button type="button" class="js-next">Next</button>`;
  const previousButton = `<button type="button" class="js-previous">Previous</button>`;
  const message = `<p>Clicking on each thumbnail image leads to the video in Youtube</p>`;
  nextToken = data.nextPageToken;
  prevToken = data.prevPageToken;
  populateResults(data, nextButton, message, previousButton);
}

function populateResults(data, nextButton, message, previousButton) {
  if (data.items.length !== 0) {
    const results = data.items.map((item, index) => displayResults(item));
    console.log(data.prevPageToken + "," + data.nextPageToken);
    if ((data.nextPageToken !== undefined) && (data.prevPageToken === null || data.prevPageToken === undefined || data.prevPageToken === "")) {
      let htmlSnippet = (nextToken === undefined) ? results.join("\n") : `${nextButton}${results.join("\n")}`;
      $('.js-results').html(message.concat(htmlSnippet));
    }
    else {
      $('.js-results').html(message.concat((prevToken === undefined || prevToken === null || prevToken === "") ? results.join("\n") : `${previousButton}   ${nextButton}${results.join("\n")}`));
    }
  }
  else {
    $('.js-results').html(`<p>Sorry couldn't find any videos for the given input.Try changing the input</p>`);
  }
}

function displayResults(item) {
  return `<p>${item.snippet.title}</p><a href='https://www.youtube.com/watch?v=${item.id.videoId}' class="videolink" target='_blank'><img border="0" alt="Image thumbnail" src="${item.snippet.thumbnails.medium.url}"></a>`;
}

function onSubmit() {
  $('.js-form').on('submit', function (event) {
    event.preventDefault();
    searchInfo = $('.js-search-text').val();
    $('.js-search-text').val("");
    createSearchQuery(searchInfo, nextToken, processResults);
  });
}

function clickNext() {
  console.log(nextToken);
  $('.main').on('click', '.js-next', function () {
    createSearchQuery(searchInfo, nextToken, processResults);
  });
}

function clickPrevious() {
  console.log(prevToken);
  $('.main').on('click', '.js-previous', function () {
    createSearchQuery(searchInfo, prevToken, processResults);
  });
}

function onLoad() {
  onSubmit();
  clickNext();
  clickPrevious();
}

$(onLoad);
