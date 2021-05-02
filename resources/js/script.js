$(document).ready(function() {

    /* Add/remove the sticky navigation at the top of the 'Projects' section */
    /* (depending on scroll direction) */
    $('.js--section-projects').waypoint(function(direction) {
        if (direction == "down") {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    }, {
      offset: '60px;'
    });

    /* Scroll to 'Projects' section' on clicking button */
    $('.js--scroll-to-projects').click(function() {
       $('html, body').animate({scrollTop: $('.js--section-projects').offset().top}, 1000);
    });

    /* Scroll to 'About Me' section on clicking button */
    $('.js--scroll-to-about').click(function() {
       $('html, body').animate({scrollTop: $('.js--section-about').offset().top}, 1000);
    });
    
    /* Navigation scroll */

    // Select all links with hashes
    $('a[href*="#"]')
      // Remove links that don't actually link to anything
      .not('[href="#"]')
      .not('[href="#0"]')
      .click(function(event) {
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
          && 
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually going to happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              // Callback after animation
              // Must change focus
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        }
      });

    /* Animations on scroll */

    /* Waypoint 1 - fade in 'Projects' section */
    $('.js--wp-1').waypoint(function(direction) {
        $('.js--wp-1').addClass('animate__animated animate__fadeIn');
    }, {
        offset: '50%'
    });

    /* Waypoint 2a - fade in/slide from left profile picture in 'About Me' section */
    $('.js--wp-2a').waypoint(function(direction) {
      $('.js--wp-2a').addClass('animate__animated animate__fadeInLeft');
    }, {
        offset: '50%'
    });

    /* Waypoint 2b - fade in/slide from right profile text in 'About Me' section */
    $('.js--wp-2b').waypoint(function(direction) {
      $('.js--wp-2b').addClass('animate__animated animate__fadeInRight');
    }, {
        offset: '50%'
    });

    /* Waypoint 3 - bounce the logos in 'Contact' section */
    $('.js--wp-3').waypoint(function(direction) {
        $('.js--wp-3').addClass('animate__animated animate__bounce');
    }, {
        offset: '80%'
    });

    /* Toggle navigation icon as user clicks to open/close mobile menu */
    $('.js--nav-icon').click(function() {
      var nav = $('.js--main-nav');
      var icon = $('.js--nav-icon i');
      
      /* First toggle the icon */
      if (icon.hasClass('fas fa-bars')) {
          icon.removeClass('fas fa-bars');
          icon.addClass('fas fa-times');
      } else {
        icon.removeClass('fas fa-times');    
        icon.addClass('fas fa-bars');
      }

      /* Then slide the navigation menu open/closed */
      /* Use the 'slideToggle' callback function to wait until the animation has finished. */
      /* Then remove the inline style ('display: none') that jQuery adds */
      /* after collapsing the menu, otherwise, if the user resizes the browser back to */
      /* showing the full desktop nav menu (or rotates between portrait and landscape), */
      /* it will remain hidden and the desktop nav menu disappears altogether */
      nav.slideToggle(200, function() {
        if (icon.hasClass('fas fa-bars')) {
          nav.removeAttr("style");
        }
      });
    });

    /* Toggle the slide-out panel when a project is selected */
    $('.project-box').click(function(e) {
        if ($('#panel').hasClass('panel-open')) {
        /* Panel is already open, so close it */
        $('#panel').removeClass('panel-open');
        $('#panel').addClass('panel-closed');
      } else {
        /* The panel is closed - determine which project box was clicked */
        /* and set the relevant content before opening it */
        var target = "";
        if ($(e.target).hasClass('project-box')) {
          /* Project box was clicked directly, so get the project id */
          target = $(e.target).attr('id');
        } else {
          /* One of the elements inside the project box was clicked, */
          /* so get the id from the parent, i.e. the project box */
          target = $(e.target).parent().attr('id');
        };
        /* Create an array of the ids of the project divs that we want to unhide (text and buttons) */
        var clickedProject = [target + '-text', target + '-buttons'];
        /* Loop through all the hidden project divs */
        $('.panel-content').children().each(function() {
          /* If this div matches one in the clickedProject array, unhide it */
          /* Use 'display' property to ensure hidden divs do not take up space on the page */
          if ($.inArray($(this).attr('id'), clickedProject) !== -1) {
            $(this).css('display', 'block');
          } else {
            /* Else hide it - ensuring only one project's divs can be visible at a time */
            $(this).css('display', 'none');
          };
        });
        /* Finally, 'slide' the panel open */
        /* Slide effect handled by transition in CSS */
        $('#panel').removeClass('panel-closed');
        $('#panel').addClass('panel-open');
      }
    });

    /* 'X' button in the panel also closes it */
    $('#panel-header i').click(function() {
        $('#panel').removeClass('panel-open');
        $('#panel').addClass('panel-closed');
    });

    /* CONTACT FORM */

    /* Define a function to remove the contact form outcome banners from the screen
    if they are still visible after a contact form submission */
    $.fn.removeFormBanners = function() { 
      const formBanner = $('.form-icon').parent();
      formBanner.removeClass('animate__animated animate__zoomInLeft');
      formBanner.css('display', 'none');
    }

    /* Create an event handler for the submission of the contact form.
    Asynchronous AJAX call to PHP component so page does not refresh after success/error */
    $('.contact-form').submit(function (e) {
      e.preventDefault();

      /* Hide any existing visible success/error banners from previous
      contact form submission attempts */
      $.fn.removeFormBanners();

      /* Get the values from the contact form */
      var name = $("#name").val();
      var email = $("#email").val();
      var subject = $("#subject").val();
      var message = $("#message").val();

      /* Make the AJAX request */
      $.ajax({
        type: 'POST',
        url: $('.contact-form').attr('action'),
        data: {
          name: name,
          email: email,
          subject: subject,
          message: message,
          captcha: grecaptcha.getResponse()
        },
        success: function(response) {
          /* Request was successfully processed */

          if (response == 'success') {
            /* Email was successfully sent
            Show the success banner and clear the form input fields */
            $('.js--form-success').css('display', 'block');
            $('.js--form-success').addClass('animate__animated animate__zoomInLeft');
            $('.contact-form').trigger('reset');
          } else if (response == 'invalid') {
            /* reCAPTCHA validation failed
            Show the failed validation banner */
            $('.js--form-invalid').css('display', 'block');
            $('.js--form-invalid').addClass('animate__animated animate__zoomInLeft');
          } else {
            /* Error sending the email
            Show the error banner */
            $('.js--form-error').css('display', 'block');
            $('.js--form-error').addClass('animate__animated animate__zoomInLeft');
          }
          grecaptcha.reset();

        },
        error: function() {
          /* An error occurred processing the request
          Show the error banner */
          $('.js--form-error').css('display', 'block');
          $('.js--form-error').addClass('animate__animated animate__zoomInLeft');
          grecaptcha.reset();
        }
      })
    });

    /* Remove the contact form outcome banners on clicking their close button */
    $('.form-icon').click(function() {
      $.fn.removeFormBanners();
    });

});

/* PRELOADER */

/* Remove the preloader when the site has fully loaded */
$(window).load(function() {

  /* Reinstate the scrollbars */
  $('html').removeClass('preload-noscroll');
  $('body').removeClass('preload-noscroll');      
  
  if ($('#preloader').length) {
    $('#preloader').fadeOut(500, function() {

      /* Remove the preloader */
      $(this).remove();
    });
  }

  /* Trigger the opening animation on the hero text */
  $('.standard-hero-text').addClass('animate__animated animate__fadeInDown');
  $('.compact-hero-text').addClass('animate__animated animate__fadeInDown');

});