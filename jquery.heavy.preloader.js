/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
	'use strict';

    // TODO make srcset to load only one pic (the current one)
	// TODO support <picture>

	// heavy freamwork
	//----------------
	$.heavy 			= undefined == $.heavy ? {} : $.heavy;
	$.heavy.preloader 	= { name : 'HeavyPreloader', version : '1.2.3-r4', method : 'heavyPreload' };
	var plugin 			= $.heavy.preloader;



	$[plugin.method]	= function(options, callback){

		var o = $.extend({}, {
					urls	   : new Array(),
					onProgress : null,
					stop	   : false
				}, options || {}),
			c = function(){
				if( $.isFunction(callback) )
					callback.call(this)
			},
			j = o.urls.length,
			l = function(){

				// abort
				if( o.stop )
					return;

				//incremento
				++i;

				// restituisce all'utente la percentuale di caricamento del set di immagini
				o.progress = i / j * 100;

				// funzione eseguita ad ogni immagine caricata
				if( $.isFunction(o.onProgress) )
					o.onProgress();

				// esegue la callback se il totale viene raggiunto
				if( i == j )
					c();

			};

		// se c'è almeno un elemento immagine da caricare, daje caricalo!
		if( j > 0 ){

			var i = 0;

			for( var k in o.urls )
				$(new Image()).error(l).load(l).attr('src', o.urls[k]);

			// altrimenti, se si sta cercando di preloadare un contenitore in cui non è stato trovato nessun elemento-immagine, esegue subito la callback
		}else
			c();

		// per accedere all'oggetto delle opzioni dalle opzioni stesse TODO: trovare eventuali controindicazioni
		return o;

	},


	$.fn[plugin.method] = function(options, callback){

		var t = this,
			o = $.extend({}, {
				attrs		 : new Array(),
				urls		 : new Array(),
				onProgress	 : null
			}, options || {}),
			g = function(s){

				if( undefined === s || s === false )
					return;

                var a = s.split(/,|\s/);

                for( var k in a ) {

                    var s = a[k].replace(/\"|\'|\)|\(|url/gi, '');

                    if (/([^\s]+(?=\.(jp[e]?g|gif|png|tif[f]?|bmp))\.\2)/gi.test(s))
                        o.urls.push(s);

                }

			};

		return t.each(function(){

			var $t = $(this);

			// se ci sono accodate altre richieste vale solo l'ultima
			if( $.data($t[0], $.heavy.preloader.name) )
				$t.data($.heavy.preloader.name).stop();

			// se this è un immagine
			if( $t.is('img') ){
				g( $t.attr('src') );
				g( $t.attr('srcset') );
			}

			// se this ha un background
			if( document !== $t[0] && $t.css('background-image') != 'none' )
				g( $t.css('background-image') );

			// discendenti
			$t
			// cerca <img />
				.find('img').each(function(){

					g( $(this).attr('src') );
					g( $(this).attr('srcset') );

				})
				.end()
				// cerca sfondi
				.find('*:not(img)').filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

				g( $(this).css('background-image') );

			});

			// cerca attributi contenenti url di immagini
			for( var k in o.attrs )
				$t.find('['+o.attrs[k]+']').each(function(){

					g( $(this).attr(o.attrs[k]) );

				});

			// loop
			var m = new $[plugin.method]({
				urls	   : o.urls,
				onProgress : function(){

					o.progress = m.progress;

					if( $.isFunction(o.onProgress) )
						o.onProgress();

					return o;

				}
			}, function(){

				// se la callback prende il posto delle options, altrimenti, callback normale con parametri specificati
				var w = typeof options === 'function' && typeof callback === 'undefined' ? options : callback;
				if( $.isFunction(w) )
					w.call(t);

				//
				$.removeData($t[0], $.heavy.preloader.name);

			});

			// public method usato solo per stoppare una richiesta
			$(this).data($.heavy.preloader.name, {
				stop : function(){

					m.stop = true;

					$.removeData($t[0], $.heavy.preloader.name);

				}
			});

		});
	};


})(window, document, jQuery);
