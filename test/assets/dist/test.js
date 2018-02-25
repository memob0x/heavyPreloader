"use strict";

var $ = jQuery,
    $console = $('#console'),
    console_log = function console_log(string) {

    if ($console.is(':empty')) $console.append('<ol />');

    var $list = $console.find('ol').append('<li>' + string + '</li>');

    $console.scrollTop($list.height());
};

$('.playground').nitePreload({

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

$(document).on('niteLoad.nite niteError.nite', function (e, element) {

    console_log('jQuery.fn.nitePreload(): ' + element);
}).on('niteError.nite', 'figure img', function (e) {

    $(this).closest('figure').addClass('error');
}).on('niteLoad.nite niteError.nite', 'figure img, figure video', function (e) {

    $(this).closest('figure').addClass('loaded' + (e.type === 'niteError' ? '-error' : ''));
}).on('click', '.controls__button--generate', function () {

    var $t = $(this),
        instance = $t.data('instance');

    if (instance) {

        console_log(' - Aborted...');

        instance.abort();
        instance = null;

        $(this).hide();
        $('#menu__instance--launch').show();
    } else {

        $(this).hide();
        $('#menu__instance--abort').show();

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

        instance = new $.nitePreload(random_stuff, {
            sequential: true
        });

        console_log('0%');

        instance.progress(function (resource) {

            console.log(this);

            console_log(instance.percentage + '%');
        });

        instance.done(function (resources) {

            console.log(this);

            console_log(' - Done!!');
            $('#menu__instance--abort').hide();
            $('#menu__instance--launch').show();

            instance = null;
        });
    }

    $t.data('instance', instance);
});