


onmessage = function(e){
	postMessage( analyzePixels( e.data.data, e.data.width, e.data.height ) );
	
};


function analyzePixels(data, width, height){

			var i = 0,
				 result  = [],
				 pixelArray = data.data,
				 l = width*height*4,
				 xOffset = 0,
				 yOffset = -1;
			

			for(; i<=l;i+=4){
			
				if( ( i/4 ) % 7200 === 0){
					xOffset = 0;
					yOffset++;
				}
				
				if( pixelArray[ i ] > 0 && pixelArray[ i +1 ] > 0 &&  pixelArray[ i + 2 ] > 0 )
				{
					result.push(
					{
						x : xOffset,
						y : yOffset,
						val : ( pixelArray[ i ] + pixelArray[ i + 1 ] + pixelArray[ i + 2 ] ) / 3
					}
					);
				}
				
				xOffset++;
			
			}
			
			
			return result;
			
		}