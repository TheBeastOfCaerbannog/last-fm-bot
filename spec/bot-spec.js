'use strict'

var proxyquire = require('proxyquire');
var tgStub = require('./stubs/telegramAPIStub');
var botCommandsStub = require('./stubs/botCommandsStub');

var bot = proxyquire('../modules/bot', {
  './telegramAPI': tgStub,
  './botCommands': botCommandsStub
});

var tgRequests = require('./data/telegramRequests');

describe('Main bot logic', function(){
    beforeEach(function() {
      botCommandsStub.reset();
    });
    it('gets a normal command', function() {
        bot.verifyMessage(tgRequests.artPic);

        expect(botCommandsStub.called).toBe(true);
        expect(botCommandsStub.artist).toEqual('The Smashing Pumpkins');
        expect(botCommandsStub.username).toEqual('test');
    });
    it('gets an empty message', function () {
        bot.verifyMessage(tgRequests.empty);

        expect(botCommandsStub.called).toBe(false);
    });
    it('gets an non-existsing comand', function () {
        bot.verifyMessage(tgRequests.nonExisting);

        expect(botCommandsStub.called).toBe(false);
        expect(tgStub.chatId).toEqual(1);
        expect(tgStub.message).toEqual('Command /asd does not exist');
    });
    it('gets called with username (i.e. in group)', function () {
        bot.verifyMessage(tgRequests.withUsername);

        expect(botCommandsStub.called).toBe(true);
        expect(botCommandsStub.artist).toEqual('Foo Fighters');
        expect(botCommandsStub.username).toEqual('test');
    });
});
