
(function(){

  window.SteemMoreInfo.Utils.addSettings({
    title: 'Zoom on user profile picture',
    settings: [{
      title: '',
      key: 'ZoomUserPic',
      defaultValue: 'enabled',
      options: [{
        title: 'Disabled',
        value: 'disabled'
      }, {
        title: 'Enabled',
        value: 'enabled'
      }],
      description: 'Hover on an user picture to show a bigger version of the avatar'
    }]
  });

  var zoomUserPicEnabled = function() {
    var value = window.SteemMoreInfo.Utils.getSettingsValue('ZoomUserPic');
    return value;
  };


  
  var userpic;

  var checkSize = function(zoom) {
    if(!zoom.parent().length){
      return;
    }
    var pLeft = zoom.parent().offset().left;
    var left = pLeft + 30;
    var width = zoom.width();
    var wWidth = $(window).width();
    var cssLeft = 'auto';
    if(width >= wWidth - 60){
      cssLeft = '0px';
    }else if(left + width >= wWidth) {
      left = wWidth - width - 30;
    }
    zoom.css('left', cssLeft);
    zoom.css('margin-left', (left-pLeft) + 'px');

    //check height
    // zoom.css('bottom', 'auto');
    zoom.css('margin-top', 'auto');
    var zoomH = zoom.height();
    var sp = zoom.scrollParent();
    var maxTop = $(window).height() - zoomH - 30;
    if(sp.is($(document))){
      maxTop += sp.scrollTop();
    }
    var zTop = zoom.offset().top;
    if(zTop > maxTop) {
      // zoom.css('bottom', '0px');
      zoom.css('margin-top', (-zoomH) + 'px');

    }
  };


  var openUserpicZoom = function(thisUserpic, bigImg) {
    userpic = thisUserpic;
    setTimeout(function() {
      if(userpic === thisUserpic && !userpic.find('.smi-userpic-zoom').length){

        var zoom = $('<div class="smi-userpic-zoom">\
          <img class="smi-userpic-zoom-img" src="' + bigImg + '"></img>\
        </div>');

        var loading = $(window.SteemMoreInfo.Utils.getLoadingHtml({
          center: true
        }));

        zoom.append(loading);          

        userpic.prepend(zoom);

        zoom.find('img').one('load', function() {
          loading.remove();
          zoom.removeClass('smi-userpic-zoom-loading');
          checkSize(zoom);
        }).each(function() {
          if(this.complete){
            loading.remove();
            zoom.removeClass('smi-userpic-zoom-loading');
            checkSize(zoom);
          }else{
            zoom.addClass('smi-userpic-zoom-loading');
            checkSize(zoom);
          }
        });

      }
    }, 500);
  };


  var removeUserpicZoom = function(thisUserpic) {
    thisUserpic.find('.smi-userpic-zoom').remove();
    if(userpic && userpic.is(thisUserpic)){  
      userpic = null;
    }
  };


  $('body').on('mouseenter', '.Userpic', function() {
    if(zoomUserPicEnabled() === 'disabled'){
      return;
    }
    var $this = $(this);
    var thisUserpic;
    var bigImg;

    if($this.is('div')){
      // Steemit Userpic
      thisUserpic = $this;

      if($this.closest('.Header__userpic').length){
        return;
      }

      var backgroundImage = $this.css('background-image');
      if(!backgroundImage || backgroundImage.startsWith('url("/assets/') || backgroundImage.startsWith('url("https://steemit.com/assets/')){
        return;
      }
      bigImg = backgroundImage.replace(/^url\("https:\/\/steemitimages\.com\/[0-9]*x[0-9]*\/(.*)"\)$/, function(a, b){
        return 'https://steemitimages.com/512x512/' + b;
      });
  
    }else{
      // SMI Userpic
      thisUserpic = $this.parent();
      
      var backgroundImage = $this.attr('src');
      bigImg = backgroundImage.replace(/\?s=[0-9]*/, '?s=512');

    }
    openUserpicZoom(thisUserpic, bigImg);
  });

  $('body').on('mouseleave', '.Userpic', function() {
    var $this = $(this);
    var thisUserpic;
    if($this.is('div')){
      // Steemit Userpic
      thisUserpic = $this;
    }else{
      // SMI Userpic
      thisUserpic = $this.parent();
    }
    removeUserpicZoom(thisUserpic);
  });

  

})();
