var dataQueue = [];//sacrificial queue of items to be sent in batches via AJAX request
var batchSize = 0;
var requesting = false;//flag used to suppress further requests while a request is still being serviced

var storedQueue = localStorage.getItem("storedQueue");

if(!(typeof storedQueue == "undefined")) {
    dataQueue = storedQueue;
    send();
}

//addToQueue: a function called whenever an item is to be added to he queue.
function addToQueue(item) {
    dataQueue.push(item);
    send();//(conditional on queue length and no request currently being serviced)
}

function send() {
    if(dataQueue.length >= batchSize && !requesting) {//is the queue long enough for a batch to be sent, and is no ajax request being serviced
        $.ajax({
            url: '/path/to/server/side/script',
            data: JSON.stringify(dataQueue.splice(0, batchSize)),//.splice removes items from the queue (fifo)
            //... //further ajax options
        }).done(handleResponse).fail(handleFailure).always(resetSend);
        requesting = true;
    }
}

function handleResponse(data, textStatus, jqXHR) {
    //handle the server's response data here
}
function handleFailure(jqXHR, textStatus, errorThrown) {
    //handle failure here
}
function resetSend() {
    requesting = false;//Lower the flag, to allow another batch to go whenever the queue is long enough.
    send();//Call send again here in case the queue is already long enough for another batch.
}