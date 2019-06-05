//sw work on https only bcoz they can intercept req. to server

if('serviceWorker' in navigator){   //if sw feature is present in browser only then
    navigator.serviceWorker.register('/sw.js')  //register a new sw in browser,it is queued in other sw's
    .then(function(){
        console.log('service worker registered');
    })
}