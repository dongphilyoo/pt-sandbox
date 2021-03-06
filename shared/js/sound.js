'use strict';

var Sound = (function() {
  function Sound(options) {
    var defaults = {
      "enable": 1,
      "volume": 0.4,
      "limitLastPlayedMs": 10,
      "limitSameLastPlayedMs": 10
    };
    this.opt = _.extend({}, defaults, options);
    this.init();
  }

  Sound.prototype.init = function(){
    this.enabled = this.opt.enable;
    this.limitLastPlayedMs = this.opt.limitLastPlayedMs;
    this.limitSameLastPlayedMs = this.opt.limitSameLastPlayedMs;
    this.lastPlayed = new Date();
    this.load();
  };

  Sound.prototype.load = function(){
    if (!this.enabled) return false;

    var deferred = $.Deferred();
    var _this = this;

    var sprites = this.opt.sprites;
    this.sound = new Howl({
      src: this.opt.audio,
      sprite: sprites,
      volume: this.opt.volume
    });
    this.notes = _.keys(sprites);
    this.notesLastPlayed = _.mapObject(sprites, function(val, key){ return 0; });

    this.sound.once('load', function(){
      console.log("Sound loaded.");
      _this.loadListeners();
      deferred.resolve();
    });

    return deferred.promise();
  };

  Sound.prototype.loadListeners = function(){
    var _this = this;
    var playPercent = function(e, value){
      _this.playPercent(value);
    };

    var playSprite = function(e, value){
      _this.playSprite(value);
    };

    $(document).on("sound.play.percent", playPercent);
    $(document).on("sound.play.sprite", playSprite);

    $(document).one("click", function() {
      Howler.ctx.resume();
    });
  };

  Sound.prototype.playPercent = function(percent){
    if (!this.enabled) return false;
    if (percent < 0 || percent > 1) return false;

    // limit many sounds played at once
    var now = new Date();
    var lastPlayed = this.lastPlayed;
    if (now - lastPlayed < this.limitLastPlayedMs) return false;

    var len = this.notes.length;
    var i = Math.floor((len - 1) * percent);
    var sprite = this.notes[i];

    // limit same sound played again
    lastPlayed = this.notesLastPlayed[sprite];
    if (now - lastPlayed < this.limitSameLastPlayedMs) return false;

    this.sound.play(sprite);
    this.lastPlayed = now;
    this.notesLastPlayed[sprite] = now;
  };

  Sound.prototype.playSprite = function(value){
    if (!this.enabled) return false;
    // limit many sounds played at once
    var now = new Date();
    var lastPlayed = this.lastPlayed;
    if (now - lastPlayed < this.limitLastPlayedMs) return false;

    this.sound.play(value);
    this.lastPlayed = now;
  };

  return Sound;

})();
