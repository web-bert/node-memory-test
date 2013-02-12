var PORT = 3000,
	LINES = 40000,
	FILE = './json/' + LINES + '-lines.json',

	http = require( 'http' ),
	util = require( 'util' ),
	fs = require( 'fs' ),
	bytesToSize = require( './bytesToSize' ),
	nanoSecondsToHumanFormat = require( './nanoSecondsToHumanFormat' ),

	fileExists = fs.existsSync( FILE ),
	fileStats,
	readStart,
	json;

function getRandomLine(){

	return Math.floor( Math.random() * LINES );
}

function logMemoryUsage(){

	var memoryUsage =  process.memoryUsage(),
		heapMb = bytesToSize( memoryUsage.heapTotal, 2 ),
		usedMb = bytesToSize( memoryUsage.heapUsed, 2 );

	console.log( 'Memory: heap: ' + heapMb + ', used: ' + usedMb );
}

function getNanoseconds( diff ){

	return diff[0] * 1e9 + diff[1];
}

function createServer(){

	fileStats = fs.statSync( FILE );

	if( fileStats.size > 0 ){
		
		console.log( 'Reading file with %d lines, size: %s', LINES, bytesToSize( fileStats.size, 2 ) );

		logMemoryUsage();

		readStart = process.hrtime(),
		json = require( FILE );

		console.log( '\nFile read complete in: ' + nanoSecondsToHumanFormat( getNanoseconds( process.hrtime( readStart ) ) ) );
		logMemoryUsage();

		http.createServer( function( req, res ){

			var line = getRandomLine(),
				reqStart = process.hrtime(),
				value = json[ 'item' + line ],
				diff = process.hrtime( reqStart ),
				nanoseconds = getNanoseconds( diff );

			res.writeHead( 200, { 'Content-Type' : 'text/plain' } );
			res.end( 'From a file with ' + LINES + ', getting the value from line ' + line + ', with value: ' + value + ', fetched in: ' + nanoSecondsToHumanFormat( nanoseconds ) + '\n' );

			logMemoryUsage();
			console.log( 'Time to fetch value from memory: %s\n', nanoSecondsToHumanFormat( nanoseconds ) );

		} ).listen( PORT, function(){

			console.log( '\nServer listening on port %d\n', PORT );
		} );

	} else {

		console.log( 'File does not have any content' );
	}
}

console.log( '\n' );

if( fileExists ){

	createServer();

} else {

	//fork to another process
	//so as not to pollute the main process heap as we are checking the size of it
	//console.log( 'forking' );
	(function(){

		var childProcess = require( 'child_process' ),
			child = childProcess.fork( './createJsonFile.js' );

		child.on( 'message', function( params ){

			//console.log( 'message: ' + params );
			if( params.name === 'fileCreated' ){

				//console.log( 'file created message received' );
				child.kill();
				childProcess = null;
				child = null;
				createServer();
			}
		} );

		child.send( { name: 'createFile', lines: LINES, file: FILE } );
	}());
}