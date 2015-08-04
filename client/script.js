// Scrolls the messages chat box to its bottom, enhancing UX.
var scrollBottom = function() {
    $('.messages').scrollTop($('.messages')[0].scrollHeight);
};

// Dynamically resize the messages chat box by the page size, with a 50px offset.
var resizeMessages = function() {
    $('.messages').css('max-height', ($(window).height() - 50) + 'px');
};

// Resize, and scrolls bottom the chat messages.
var fitMessages = function() {
    resizeMessages();
    scrollBottom();
    $('input').focus();
};

// Warming up the chat, fitting the messages, and focusing on the input message.
fitMessages();

// Handling particular events such as receiving a new message, and resizing window.
$('.messages').bind('DOMNodeInserted DOMNodeRemoved', fitMessages);
$(window).on('resize', fitMessages);

