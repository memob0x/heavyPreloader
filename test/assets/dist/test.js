"use strict";

var $ = jQuery,
    $console = $('#console'),
    console_log = function console_log(string) {

    if ($console.is(':empty')) $console.append('<ol />');

    var $list = $console.find('ol').append('<li>' + string + '</li>');

    $console.scrollTop($list.height());
};

$('.playground').niteLoad({

    srcAttr: 'data-nite-src',
    srcsetAttr: 'data-nite-srcset',

    visible: true,

    sequential: true,

    backgrounds: true,
    extraAttrs: [],

    playthrough: 'full',

    early: false,
    earlyTimeout: 6000,

    onComplete: function onComplete(instance, resources) {

        $(this).addClass('complete');
    },

    onProgress: function onProgress(instance, resource) {

        $(this).find('[data-percentage]').attr('data-percentage', instance.percentage).closest('.playground__percentage').addClass('visible');
    },

    onLoad: function onLoad(instance, resource) {

        $(this).addClass('has-loads');
    },
    onError: function onError(instance, resource) {

        $(this).addClass('has-errors');
    }

});

var instance = void 0;

$(document).on('niteLoad.nite niteError.nite', function (e, element) {

    console_log('jQuery.fn.niteLoad(): ' + element);
}).on('niteError.nite', 'figure img', function (e) {

    $(this).closest('figure').addClass('error');
}).on('niteLoad.nite niteError.nite', 'figure img, figure video', function (e) {

    $(this).closest('figure').addClass('loaded' + (e.type === 'niteError' ? '-error' : ''));
}).on('click', '[class*="nite-program-load"]', function () {

    if (instance) {

        console_log('Aborted...');

        instance.abort();
        instance = null;

        $('.nite-program-load--kill').hide();
        $('.nite-program-load--run').show();
    } else {

        $('.nite-program-load--run').hide();
        $('.nite-program-load--kill').show();

        var random_stuff = [];

        for (var i = 0; i < 10; i++) {

            var letters = '0123456789ABCDEF',
                colors = [];

            for (var ii = 0; ii < 2; ii++) {
                var color = '';
                for (var c = 0; c < 6; c++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }colors[ii] = color;
            }

            random_stuff.push('//placehold.it/720x720/' + colors[0] + '/' + colors[1] + '.jpg');
        }

        instance = new $.niteLoad(random_stuff, {
            sequential: true
        });

        console_log('0% - Starting...');

        instance.progress(function (resource) {

            console_log(instance.percentage + '%');
        });

        instance.done(function (resources) {

            console_log('100% - Done!!');
            $('.nite-program-load--run').show();
            $('.nite-program-load--kill').hide();

            instance = null;
        });
    }
});
//# sourceMappingURL=test.js.map
