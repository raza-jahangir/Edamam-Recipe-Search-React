jQuery(function() {

    var formData = wpfmsq_general_variables.saved_form_fields;
      formRenderOpts = {
        dataType: 'json',
        formData: formData
      };
    
    var renderedForm = jQuery('<div>');
    renderedForm.formRender(formRenderOpts);
  
    jQuery('#wpfmsq_render_form').html(renderedForm.html());

    var TabBlock = {
      s: {
        animLen: 200
      },
      
      init: function() {
        TabBlock.bindUIActions();
        TabBlock.hideInactive();
      },
      
      bindUIActions: function() {
        jQuery('.tabBlock-tabs').on('click', '.tabBlock-tab', function(){
          TabBlock.switchTab(jQuery(this));
            let wpfmsq_current_tab = jQuery(this).text();

            if ('Credit Card' !== wpfmsq_current_tab) {
                jQuery('.wpfmsq_pay_button').hide();
            }

            if ('Credit Card' == wpfmsq_current_tab) {
              jQuery('.wpfmsq_pay_button').show();
            }

        });
      },
      
      hideInactive: function() {
        var $tabBlocks = jQuery('.tabBlock');
        
        $tabBlocks.each(function(i) {
          var 
            $tabBlock = jQuery($tabBlocks[i]),
            $panes = $tabBlock.find('.tabBlock-pane'),
            $activeTab = $tabBlock.find('.tabBlock-tab.is-active');
          
          $panes.hide();
          jQuery($panes[$activeTab.index()]).show();
        });
      },
      
      switchTab: function($tab) {
        var $context = $tab.closest('.tabBlock');
        
        if (!$tab.hasClass('is-active')) {
          $tab.siblings().removeClass('is-active');
          $tab.addClass('is-active');
       
          TabBlock.showPane($tab.index(), $context);
        }
       },
      
      showPane: function(i, $context) {
        var $panes = $context.find('.tabBlock-pane');
       
        // Normally I'd frown at using jQuery over CSS animations, but we can't transition between unspecified variable heights, right? If you know a better way, I'd love a read it in the comments or on Twitter @johndjameson
        $panes.slideUp(TabBlock.s.animLen);
        jQuery($panes[i]).slideDown(TabBlock.s.animLen);
      }
    };
    
    jQuery(function() {
      TabBlock.init();
    });

    jQuery('#sq-google-pay').click(function(event){

      event.preventDefault();

    });



    // on page load...
    moveProgressBar();
    // on browser resize...
    jQuery(window).resize(function() {
        moveProgressBar();
    });

    // SIGNATURE PROGRESS
    function moveProgressBar() {
      console.log("moveProgressBar");
        var getPercent = (jQuery('.progress-wrap').data('progress-percent') / 100);
        var getProgressWrapWidth = jQuery('.progress-wrap').width();
        var progressTotal = getPercent * getProgressWrapWidth;
        var animationLength = 2500;
        
        // on page load, animate percentage bar to data percentage length
        // .stop() used to prevent animation queueing
        jQuery('.progress-bar').stop().animate({
            left: progressTotal
        }, animationLength);
    }
    
  }); 