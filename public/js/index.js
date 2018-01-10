var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight );
    }
}

socket.on('connect', function () {
    console.log('Connected to the Server');
});

socket.on('disconnect', function () {
    console.log('Server was Disconnected');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createAt).format('h:mm a');
    message.formattedTime = formattedTime;
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {message: message});
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createAt).format('h:mm a');
    message.formattedTime = formattedTime;
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {message: message});
    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#messege-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextbox = jQuery('[name="message"]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        text: messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported your browser");
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createPositionMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send Location');
    }, function () {
        alert('unable to fetch location');
        locationButton.removeAttr('disabled').text('Send Location');
    });
});