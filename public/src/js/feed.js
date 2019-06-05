/*var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
*/

//NETWORK THEN CACHE STRATERGY

var url = 'https://httpbin.org/get';
var networkDataRecieved = false;

fetch(url)  //try from  network         --(1)
.then(function(res){
    return res.json();
})
.then(function(data){
  networkDataRecieved = true; //got data from network
  console.log('i am network data');
})

if('caches' in window){ //simualtenous to (1) this code works
  caches.match(url)   //if present in cache
  .then(function(res){
    if(res){
      return res.json();  //return cached
    }
  })
  .then(function(returnedData){
    if(!networkDataRecieved){   //if network data is not recieved only then retreive from cache
      console.log('i am cached data');
    }
  })
}