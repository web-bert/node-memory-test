var micro = 1000,
	milli = 1000 * micro,
	second = 1000 * milli,
	minute = 60 * second;

function nanoSecondsToHumanFormat( nanoseconds ){

	//console.log( nanoseconds );

	if( nanoseconds <= micro ){

		return nanoseconds + 'ns';

	} else if( nanoseconds <= milli ){

		return ( nanoseconds / 1e3 ).toFixed( 2 ) + 'mms';//or us

	} else if( nanoseconds <= second ){

		return ( nanoseconds / 1e6 ).toFixed( 2 ) + 'ms';

	} else if( nanoseconds <= minute ){

		return ( nanoseconds / 1e9 ).toFixed( 2 ) + 's';

	} else {

		return ( nanoseconds / minute ).toFixed( 2 ) + 'm';
	}
}

module.exports = nanoSecondsToHumanFormat;