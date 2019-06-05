const STATIC_CACHE = 'static-v12';
const DYNAMIC_CACHE = 'dynamic-v12';

self.addEventListener('install',function(event){    //sw is only installed if it is changed by a bit
    console.log('Installing...');

    event.waitUntil(caches.open(STATIC_CACHE).then(
        function(cache){
        console.log('cache adding...');
        cache.add('/src/js/app.js');
        cache.add('/');
        cache.add('/offline.html');
        cache.add('/index.html');
    })); 
    //wait until caches.open() executes asynchronously
    //caches.open will open static if it exists else it will create it
}) //self asks for access for sw

self.addEventListener('activate', function(event){   //added to sw queue
    console.log('Activating...');
    //activate runs when user closes all tabs or does spikWaiting in console
    //old cache is deleted here bcoz if we delete old cache in install phase then it might break the current webpage using the old cache
    event.waitUntil(
        caches.keys()   //list of all caches eg.static-v2,etc
        .then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key!==DYNAMIC_CACHE && key!==STATIC_CACHE){
                    return caches.delete(key);  //delete old
                }
            }));
        })
    )
    return self.clients.claim();
})

self.addEventListener('fetch', function(event){
    console.log('Fetching...');
    //event.respondWith() means we intercept all request that our code make to a server and respond with whatever we what
    event.respondWith(
        caches.match(event.request) //find in cache
        .then(function(response){
            if(response){   //if response is not null
                return response;    //return cached data
            }
            else{
                return fetch(event.request) //continue fetching from server, return the response and store the content as well
                    .then(function(res){
                        return caches.open(DYNAMIC_CACHE)
                        .then(function(cache){
                            //cache.put(event.request.url, res.clone());//cache data fetched from server
                            return res; //return res so that data fetched from db can be served on browser
                        })
                    })
                    .catch(function(err){   //handle errors
                        return caches.open(STATIC_CACHE)    //if not in both cache as well as network is offline
                        .then(function(cache){
                            return cache.match('/offline.html')    //retreive offline page
                        })
                        console.log(err);
                    })
            }
        })
        .catch(function(err){ 
           //ok
        })
    )
});

//cache versioning is req. bcoz new sw is registered only if code in sw.js is changed (if we change code in other files sw.js will not be registered)