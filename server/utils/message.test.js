var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should Generate correct message object', () => {
        var from = 'Chicku';
        var text = 'Some Message';
        var message = generateMessage(from, text);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('should Generate correct location message object', () => {
        var from = 'Chicku';
        var latitude = 72.60131439999999;
        var longitude = 23.045123099999998;
        var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});