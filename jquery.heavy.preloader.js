/*! JQuery Heavy Preloader | Daniele Fioroni | dfioroni91@gmail.com */
(function(window, document, $, undefined){
	'use strict';

    // TODO TO CHECK *(1): far sì che gli altri plugin heavy* overridino il
	// TODO TO CHECK videos support
    // TODO make srcset to load only one pic (the current one)
	// TODO support <picture>

	// heavy freamwork
	//----------------
	$.heavy 			= undefined == $.heavy ? {} : $.heavy;
	$.heavy.preloader 	= { name : 'HeavyPreloader', version : '1.2.5.1b', method : 'heavyPreload' };
	var plugin 			= $.heavy.preloader;


	var isImg = function(s){
			return /([^\s]+(?=\.(jp[e]?g|gif|png|tif[f]?|bmp))\.\2)/gi.test(s);
		},
		isVid = function(s){
			return /([^\s]+(?=\.(mp4|ogv|webm|ogg))\.\2)/gi.test(s);
		};

	$[plugin.method]	= function(options, callback){

		var o = $.extend({}, {
					urls	   : new Array(),
					onProgress : null,
					stop	   : false
				}, options || {}),
			c = function(){
				if( $.isFunction(callback) )
					callback.call(this);
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

			for( var k in o.urls ){

				if( isImg(o.urls[k]) )
					$(new Image()).error(l).load(l).attr('src', o.urls[k]);

				if( isVid(o.urls[k]) ){

					$('<video />', {
					    src  : o.urls[k],
					    type : 'video/'+o.urls[k].match(/mp4|ogv|ogg|webm/gi),
					}).on('progress', function(e){
						// console.log( parseInt( video.buffered.end(0) / video.duration * 100) ); // ??
						// console.log( e.originalEvent.loaded / e.originalEvent.total * 100 );
					})
					.on('error', l)
					.on('canplaythrough', l);

				}

				// todo isAud(); 4 audio files?

			}


			// altrimenti, se si sta cercando di preloadare un contenitore in cui non è stato trovato nessun elemento-immagine, esegue subito la callback
		}else
			c();

		// per accedere all'oggetto delle opzioni dalle opzioni stesse TODO: trovare eventuali controindicazioni
		return o;

	},


	$.fn[plugin.method] = function(options, callback){

		return this.each(function(){

			var t  = this,
				$t = $(t),
				o  = $.extend({}, {
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

	                    if( isImg(s) || isVid(s) )
	                        o.urls.push(s);

	                }

				};

			// se ci sono accodate altre richieste vale solo l'ultima se non si forza
			if( $.data(t, $.heavy.preloader.name) && !$t.data($.heavy.preloader.name).force ) // TODO fix *(1)
				$t.data($.heavy.preloader.name).stop();

			// se this è un immagine
			if( $t.is('img') ){
				g( $t.attr('src') );
				g( $t.attr('srcset') );
			}

			// se this è un video
			if( $t.is('video') )
				g( t.currentSrc );

			// se this ha un background
			if( document !== t && $t.css('background-image') != 'none' )
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
				.find('*:not(img)')
					.filter(function(){ return $(this).css('background-image') != 'none'; }).each(function(){

						g( $(this).css('background-image') );

					})
					.end()
				.end()
				.find('video').each(function(){
					g( this.currentSrc );
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
				$.removeData(t, $.heavy.preloader.name);

			});

			// public methods...
			$(this).data($.heavy.preloader.name, {
				//force : false, 		// ... per forzare una richiesta anche se ce n'è un'altra in atto
				stop  : function(){ // ... per stoppare una richiesta

					m.stop = true;

					$.removeData(t, $.heavy.preloader.name);

				}
			});

		});
	};


})(window, document, jQuery);
