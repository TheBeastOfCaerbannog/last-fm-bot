'use strict'

var proxyquire = require('proxyquire');
var tgStub = require('./stubs/telegramAPIStub');
var lfmStub = require('./stubs/lfmControllerStub');
var context = require('../modules/storage/context');

var botCommands = proxyquire('../modules/botCommands', {
    './telegram/telegramAPI': tgStub,
    './lfmController': lfmStub
});


//Cut
var exampleMessage = {
    from: {
        id: 1
    },
    chat: {
        id: 1
    },
    text: 'test'
};
var exampleMessageNum = {
    from: {
        id: 1
    },
    chat: {
        id: 1
    },
    text: 1
};

describe('Module containing bot commands', function () {
    beforeEach(function() {
        tgStub.reset();
        lfmStub.reset();
    });
    describe('/artist command', function () {
        it('gets called with parameter', function () {
            botCommands.execute('/artist', 'Zaz', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('Zaz');
            expect(tgStub.chatId).toEqual(1);
        });
        it('gets called without parameter and asks for track', function () {
            botCommands.execute('/artist', '', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
        });
    });
    describe('/sa command', function () {
        it('gets called with parameter', function () {
            botCommands.execute('/sa', 'Depeche Mode', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('Depeche Mode');
            expect(tgStub.chatId).toEqual(1);
        });
        it('gets called without parameter and asks for track', function () {
            botCommands.execute('/sa', '', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
        });
    });
    describe('/track command (with context)', function () {
        it('gets called with parameter and asks for track', function () {
            botCommands.execute('/track', 'Evanescence', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(lfmStub.called).toBe(false);
            expect(context[1].parameters).toEqual(['Evanescence']);
            expect(context[1].command).toEqual('/track');
        });
        it('gets response in context of waiting for track', function () {
            botCommands.notACommand(exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(lfmStub.called).toBe(true);

        });
        it('gets called without parameter and asks for artist', function () {
            botCommands.execute('/track', '', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                parameters: [],
                command: '/track',
                stage: 0
            });
        });
        it('gets response in context of waiting artist', function () {
            botCommands.notACommand(exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                command: '/track',
                stage: 1,
                parameters: ['test']
            });
        });
        it('gets response in context of waiting track', function () {
            botCommands.notACommand(exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('test test');
            expect(lfmStub.called).toBe(true);
        });
    });
    describe('/yb command (with context)', function () {
        it('gets called with parameter and asks for track', function () {
            botCommands.execute('/yb', 'Evanescence', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(lfmStub.called).toBe(false);
            expect(context[1].parameters).toEqual(['Evanescence']);
            expect(context[1].command).toEqual('/yb');
        });
        it('gets response in context of waiting for track', function () {
            botCommands.notACommand(exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(lfmStub.called).toBe(true);

        });
        it('gets called without parameter and asks for artist', function () {
            botCommands.execute('/yb', '', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                parameters: [],
                command: '/yb',
                stage: 0
            });
        });
        it('gets response in context of waiting artist', function () {
            botCommands.notACommand(exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                command: '/yb',
                stage: 1,
                parameters: ['test']
            });
        });
        it('gets response in context of waiting track', function () {
            botCommands.notACommand(exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('test test');
            expect(lfmStub.called).toBe(true);
        });
    });
    describe('/atracks command (with context)', function () {
        it('gets called with parameter and asks for track', function () {
            botCommands.execute('/atracks', 'Evanescence', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(lfmStub.called).toBe(false);
            expect(context[1]).toEqual({
                command: '/atracks',
                stage: 1,
                parameters: ['Evanescence']
            });
        });
        it('gets response in context of waiting for page', function () {
            botCommands.notACommand(exampleMessageNum);

            expect(tgStub.called).toBe(true);
            expect(lfmStub.called).toBe(true);
        });
        it('gets called without parameter and asks for artist', function () {
            botCommands.execute('/atracks', '', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                parameters: [],
                command: '/atracks',
                stage: 0
            });
        });
        it('gets response in context of waiting artist', function () {
            botCommands.notACommand(exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                command: '/atracks',
                stage: 1,
                parameters: ['test']
            });
        });
        it('gets string while waiting for number', function () {
            botCommands.notACommand(exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
            expect(context[1]).toEqual({
                command: '/atracks',
                stage: 1,
                parameters: ['test']
            });
        });
        it('gets response in context of waiting page', function () {
            botCommands.notACommand(exampleMessageNum);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('test 1');
            expect(lfmStub.called).toBe(true);
        });
    });

    it('gets a /start command without parameter', function () {
        botCommands['/start']('', exampleMessage);

        expect(tgStub.called).toEqual(true);
    });
    it('gets a /help command without parameter', function () {
        botCommands['/help']('', exampleMessage);

        expect(tgStub.called).toEqual(true);
    });
});
