!function ($) {
  "use strict";

  $.fn.barkerCarousel = function (option) {
    var $carousel = this;

    $.extend($.easing, {
      def: 'easeOutQuad',
      easeOutQuad: function (x, t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    }});

    this.show_carousel_pager = function() {
      var $barker = $('.barker');
      var pager = document.createElement('div');

      var page_left = document.createElement('a');
      $(page_left).html('&#x153;');
      var page_right = document.createElement('a');
      $(page_right).html('&#x161;');

      //for style
      $(pager).addClass('barker-carousel-pager');

      $(page_left)
        .addClass('page-left')
        .appendTo(pager)
        .addClass('disabled');
      $(page_right)
        .addClass('page-right')
        .appendTo(pager);
      $barker.append(pager);
    };

    function hide_carousel_pager() {
      var $pager = $('.barker-carousel-pager');
      if($pager.length > 0) {
        $pager.remove();
      }
    }

    function carousel_scroll_position(direction) {
      // Which numbers do we need for maths?
      var content_width = $carousel[0].scrollWidth;
      var window_width = $carousel.width();
      var new_position = 0;
      var cur_position = $carousel.scrollLeft();
      var $items = $carousel.find('td');

        // do MATHS!!!
      if(direction == 'right') {
        new_position = $carousel.scrollLeft() + window_width;
        if(new_position + window_width > content_width)
          return content_width - window_width;
        else
            // Make sure new_position isn't in the middle of an image
          $items.each(function() {
            if(new_position > this.offsetLeft
                && new_position < this.offsetLeft + $(this).outerWidth()) {
              new_position = this.offsetLeft;
            if(new_position == cur_position)
              new_position = this.offsetLeft + $(this).outerWidth();
            }
          });
        return new_position;
      } else if(direction == 'left') {
        new_position = $carousel.scrollLeft() - window_width;
        if(new_position < 0)
          return 0;
        else
          // Make sure new_position isn't in the middle of an image
          $items.each(function() {
            if(new_position > this.offsetLeft
                && new_position < this.offsetLeft + $(this).outerWidth())
              new_position = this.offsetLeft + $(this).outerWidth();
            if(new_position == cur_position)
              new_position = this.offsetLeft;
          });
        return new_position;
      }
    }
    var that = this;
    return this.each(function () {
      //Disable touch support to match the rest of NGUX
      //var touchSupport = 'ontouchstart' in document.documentElement;
      var touchSupport = false;

      // are the contents of the carousel larger than the space available?
      var carousel_is_scrolly = ($carousel[0].scrollWidth != $carousel.width());

      if(carousel_is_scrolly) {
        // If we're on a touch device, enable overflow scroll so you can
        // use your fingers instead of the buttons!
        if(touchSupport) {
          $carousel
            .css('overflow-x', 'scroll')
            .css('-webkit-overflow-scrolling', 'touch');
        }

        // Show the carousel arrows
        that.show_carousel_pager();

        //for js
        var $pager = $('.barker-carousel-pager');
        var $pageLeft = $('.page-left');
        var $pageRight = $('.page-right');

        //TODO if page loads with items scrolled to left and class disabled
        // it's unusable: $('.barker-carousel-pager .page-left').addClass('disabled');
        // TODO: throttle this call
        $carousel.scroll(function scroll_carousel() {
          if($carousel.scrollLeft() === 0) {
            // disable left arrow
            $pageLeft.addClass('disabled');
          } else if($carousel[0].scrollWidth - $carousel.scrollLeft() == $carousel.width()) {
            // disable right arrow
            $pageRight.addClass('disabled');
          } else {
            $pager.find('a').removeClass('disabled');
            // enable both arrows
          }
        });
        // Setup click handlers for the prev/next buttons
        $pageLeft.click(
          function page_left_carousel(e){
            if(!$(this).hasClass('disabled'))
                $carousel.animate({
                  scrollLeft: carousel_scroll_position('left')
                }, 500, "easeOutQuad");
            e.preventDefault();
        });
        $pageRight.click(
          function page_right_carousel(e){
            if(!$(this).hasClass('disabled'))
              $carousel.animate({
                scrollLeft: carousel_scroll_position('right')
              }, 500, "easeOutQuad");
            e.preventDefault();
        });
      } else {
        hide_carousel_pager();
      }

    });
  };

  $('.barker-carousel').barkerCarousel();

}(window.jQuery);