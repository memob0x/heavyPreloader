'use strict';

const $ = jQuery,
	$console = $('#console'),
	console_log = function(string) {
		if ($console.is(':empty')) $console.append('<ol />');

		const $list = $console.find('ol').append('<li>' + string + '</li>');

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

	onComplete: function(instance, resources) {
		$(this).addClass('complete');
	},

	onProgress: function(instance, resource) {
		$(this)
			.find('[data-percentage]')
			.attr('data-percentage', instance.percentage)
			.closest('.playground__percentage')
			.addClass('visible');
	},

	onLoad: function(instance, resource) {
		$(this).addClass('has-loads');
	},
	onError: function(instance, resource) {
		$(this).addClass('has-errors');
	}
});

let instance,
	instanceSequentialMode = true;

$(document)
	.on('niteLoad.nite niteError.nite', function(e, element) {
		console_log('jQuery.fn.niteLoad(): ' + element);
	})

	.on('niteError.nite', 'figure img', function(e) {
		$(this)
			.closest('figure')
			.addClass('error');
	})

	.on('niteLoad.nite niteError.nite', 'figure img, figure video', function(e) {
		$(this)
			.closest('figure')
			.addClass('loaded' + (e.type === 'niteError' ? '-error' : ''));
	})

	.on('click', '.nite-program-mode--sequential', function() {
		if (instance !== null) {
			return;
		}
		$('.nite-program-mode--parallel').show();
		$(this).hide();
		instanceSequentialMode = true;
		console_log('$.NiteLoader(): Sequential Mode');
	})
	.on('click', '.nite-program-mode--parallel', function() {
		if (instance !== null) {
			return;
		}
		$('.nite-program-mode--sequential').show();
		$(this).hide();
		instanceSequentialMode = false;
		console_log('$.NiteLoader(): Parallel Mode');
	})

	.on('click', '[class*="nite-program-load"]', function() {
		if (instance) {
			console_log('$.NiteLoader(): Aborted...');

			instance.abort();
			instance = null;

			$('.nite-program-load--kill').hide();
			$('.nite-program-load--run').show();
		} else {
			$('.nite-program-load--run').hide();
			$('.nite-program-load--kill').show();

			let randomResources = [];

			for (let i = 0; i < 10; i++) {
				let letters = '0123456789ABCDEF',
					colors = [];

				for (let ii = 0; ii < 2; ii++) {
					let color = '';
					for (let c = 0; c < 6; c++) {
						color += letters[Math.floor(Math.random() * 16)];
					}
					colors[ii] = color;
				}

				randomResources.push('//placehold.it/720x720/' + colors[0] + '/' + colors[1] + '.jpg');
			}

			instance = new NiteLoader({
				sequential: instanceSequentialMode
			});

			instance.collection = randomResources;

			console_log('$.NiteLoader(): 0% - Starting...');

			instance.progress(resource => {
				console_log('$.NiteLoader(): ' + instance.percentage + '%');
			});

			instance.done(resources => {
				console_log('$.NiteLoader(): 100% - Done!!');
				$('.nite-program-load--run').show();
				$('.nite-program-load--kill').hide();

				instance = null;
			});

			instance.load();
		}
	});

//# sourceMappingURL=test.js.map
