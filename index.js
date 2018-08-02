const ENDPOINT_URL="https://www.googleapis.com/youtube/v3/search";
let nextToken='';
let prevToken='';
let token='';
let searchInfo = '';

function createSearchQuery(queryString,token,callback){
    const query= {
    url: ENDPOINT_URL,
    data: {
    maxResults: '25',
    part: 'snippet',
    pageToken : token,
    key: '',
    q: queryString,
    type:'',
    },
    dataType: 'json',
    type: 'GET',
    success: callback
   };
   console.log(token);
  $.ajax(query);
}

function processResults(data){
 const nextButton=`<button type="button" class="js-next">Next</button>`;
 const previousButton=`<button type="button" class="js-previous">Previous</button>`;
 nextToken = data.nextPageToken;
 prevToken = data.prevPageToken;
 const results = data.items.map((item, index) => displayResults(item));
 console.log(data.prevPageToken+","+data.nextPageToken);
 if((data.nextPageToken!==undefined) &&(data.prevPageToken===null|| data.prevPageToken===undefined || data.prevPageToken==="")){
 $('.js-results').html((nextToken===undefined || nextToken===null || nextToken==="") ? results.join("\n"):`${nextButton}${results.join("\n")}`);
}
 else {
  $('.js-results').html((prevToken===undefined || prevToken===null || prevToken==="") ? results.join("\n"):`${previousButton}   ${nextButton}${results.join("\n")}`);
 }
}

function displayResults(item){
  return `<p>${item.snippet.title}</p><a href='https://www.youtube.com/watch?v=${item.id.videoId}' class="videolink" target='_blank'><img border="0" alt="Image thumbnail" src="${item.snippet.thumbnails.medium.url}"></a>`;
}

function onSubmit() {
  $('.js-form').on('submit', function(event){
    event.preventDefault();
     searchInfo = $('.js-search-text').val();
     $('.js-search-text').val("");
     createSearchQuery(searchInfo,nextToken,processResults);
  });
}

function clickNext(){
  console.log(nextToken);
  $('.main').on('click', '.js-next', function(){
    createSearchQuery(searchInfo,nextToken,processResults);
  });
}

function clickPrevious(){
  console.log(prevToken);
  $('.main').on('click', '.js-previous', function(){
    createSearchQuery(searchInfo,prevToken,processResults);
});
}

function onLoad(){
   onSubmit();
   clickNext();
   clickPrevious();
}
  
  $(onLoad);
  