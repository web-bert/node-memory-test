var fs = require( 'fs' ),
	CHUNK_SIZE = 100000; //number of lines to write to disk at a time

function createJsonFile( lines, file, callback ){

	console.log( 'Generating %s with %d lines', file, lines );

	var writeStream = fs.createWriteStream( file, { flags: 'w+'	} ),
		i = 1,
		output = '',
		moreLinesThanChunks = ( lines > CHUNK_SIZE ),
		totalChunks = moreLinesThanChunks ? Math.floor( lines / CHUNK_SIZE ) : 1,
		chunk = ( moreLinesThanChunks ? lines / totalChunks : lines ),
		percent = ( 100 / totalChunks ),
		percentWritten = percent;

	// console.log( 'total chunks: ' + totalChunks );
	// console.log( 'chunk size: ' + chunk );
	// console.log( 'percent: ' + percent );
	// console.log( 'percentWritten: ' + percentWritten );

	writeStream.on( 'close', function(){

		console.log( 'File created!\n' );
		callback();
	} );

	writeStream.write( "{\n" );

	for( ; i <= lines; i++ ){

		output += '"item' + i + '": "value' + i + '"' + ( i === lines ? '' : ',' ) + '\n';

		if( i % chunk === 0 ){

			writeStream.write( output );
			output = '';
			console.log( percentWritten.toFixed( 2 ) + '% complete' );
			percentWritten += percent;
		}
	}

	if( output.length > 0 ){

		writeStream.write( output );
		output = '';
	}

	writeStream.write( "}\n" );

	writeStream.end();
}

process.on( 'message', function( params ){

	if( params.name === 'createFile' ){

		//console.log( 'createFile message received' );

		createJsonFile( params.lines, params.file, function(){

			process.send( { name: 'fileCreated' } );
		} );
	}
} );