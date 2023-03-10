var time = 0;
var xPos = 0;
var yPos = 0;
var zPos = 0;
var camXpos = 5;
var camYpos = 1.2;
var camZpos = 6;
var CameraXY = [camXpos,camYpos,camZpos];
var LookAtXY = [xPos, yPos, zPos ];
var exitFlag = false;

// Object-independent variables
var gl;				// WebGL graphics environment
var program;		// The shader program
var aspectRatio;	// Aspect ratio of viewport

// Axes-related  variables
var nAxesPoints = 0;	// Number of points in the vertex arrays for the axes
var vbufferID_axes;		// ID of buffer holding axes positions
var cbufferID_axes;		// ID of buffer holding axes colors

// Cone-related variables - Only cone objects when using the cone class
var merryGoRound;		// Multicolor Cone object
var theSolidCone;	// Solid color Cone object
var nConeSectors = 15;	// Number of sectors in first cone
var nConeSectors2 = 11;	// Number of sectors in second cone

// Initialization function runs whenever the page is loaded

window.onload = function init( ) {
	// Add a keydown event listener for the "Camera" function
	document.addEventListener("keydown", Camera, false);

	// Initialize arrays for vertex location data and colors
	var axesPoints = [];
	var axesColors = [];

	// Get the canvas element and set up WebGL
	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);

	// Check if WebGL is available; show an alert if it's not
	if (!gl) {
	alert("WebGL not available");
	}

	merryBase = createCone( nConeSectors, gl, 0 );
	merryTop = createCone( nConeSectors, gl, 0 );
	merryTop2 = createCone( nConeSectors, gl, 0 );
	sideCone = createCone( nConeSectors, gl, 0 );
	sideCone1 = createCone( nConeSectors, gl, 0 );
	sideCone2 = createCone( nConeSectors, gl, 0 );
	sideCone3 = createCone( nConeSectors, gl, 0 );
	sideCone4 = createCone( nConeSectors, gl, 0 );
	sideCone5 = createCone( nConeSectors, gl, 0 );
	
	// Set up WebGL viewport and clear color
	gl.viewport(0, 0, canvas.width, canvas.height);
	aspectRatio = canvas.width / canvas.height;
	gl.clearColor(0.96, 0.96, 0.86, 1.0);

	// Initialize shaders and program
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Define vertex locations and colors for the axes
	axesPoints.push(vec3(0, -2, 0), vec3(0, 2, 0));
	axesColors.push(
	[Math.random(), Math.random(), Math.random()],
	[Math.random(), Math.random(), Math.random()]
	);
	
	
	// Initialize vertex buffer ID and buffer data for axes points
	vbufferID_axes = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbufferID_axes);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(axesPoints), gl.STATIC_DRAW);

	// Initialize color buffer ID and buffer data for axes colors
	cbufferID_axes = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cbufferID_axes);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(axesColors), gl.STATIC_DRAW);

	// Create a new cone class object
	merryGoRound = new coneClass(gl, program);

	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Enable depth testing
	gl.enable(gl.DEPTH_TEST);

	// Render the scene
	render();
}

function render( ) {
	if (exitFlag) {return}
	time += 0.2;
	var Animation = mult(translate(0,0,0), rotateY(time*0.5));

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// Create modelView using lookAt( eye, at, up );
	// Push it to the GPU as a uniform variable.
	var modelView = lookAt( vec3(camXpos, camYpos, camZpos), vec3(xPos, yPos, zPos), vec3( 0, 1, 0 ) );
	var vModelView = gl.getUniformLocation( program, "vModelView" );
	gl.uniformMatrix4fv( vModelView, false, flatten( modelView ) );


	// Create another mat4 using perspective( ) and send it to the GPU
	var projection = perspective( 60, aspectRatio, 0.1, 1000 );
	var vProjection = gl.getUniformLocation( program, "vProjection" );
	gl.uniformMatrix4fv( vProjection, false, flatten( projection ) );
	
	// Set the transformation matrix as a mat4 Identity matrix and send it to the GPU
	var transformation = scalem( 0.5,0.75,0.5);
	var vTransformation = gl.getUniformLocation(program, "vTransformation");
	gl.uniformMatrix4fv( vTransformation, false, flatten(transformation) );
	
	// Okay.  All transformaation matrices sent to uniform variables.
	// Time to attach vertex shader variables to the buffers created in init( )
	
	// Connect the axes vertex data to the shader variables - First positions
	gl.bindBuffer( gl.ARRAY_BUFFER, vbufferID_axes );
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	// Then the axes colors
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferID_axes );
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	
	// Draw the axes
	gl.drawArrays( gl.LINES, 0, 2 );
	merryGoRound.render();
	transformation = mult( translate(0,-1.5,0 ), scalem(3,0,3) );
	gl.uniformMatrix4fv( vTransformation, false, flatten(transformation) );
	renderCone( merryBase, nConeSectors, gl, program );
	
	// Reset the transformation to scale down the cone so the axes are visible.
	// ( Note that the cone is centered on the origin, standing on the Y = 0 plane. )
	// TODO5 - Insert correct parameters in the following three functions.
	// The sample image scales Y by 0.75 and X and Z by 0.5 each
	transformation = mult( translate(0,1.5,0 ), scalem(3,1,3) );
	gl.uniformMatrix4fv( vTransformation, false, flatten(transformation) );
	renderCone( merryTop, nConeSectors, gl, program );
	transformation = mult( translate(0,1.5,0 ), scalem(3,0,3) );
	gl.uniformMatrix4fv( vTransformation, false, flatten(transformation) );
	renderCone( merryTop2, nConeSectors, gl, program );
	
	transformation = mult(translate(3, 0, 0), scalem(0.4, 1, 0.4));
	transformation = mult(rotate(90, [-1, 0, 0]), transformation);
	transformation = mult(translate(0, Math.sin(0.03 * (time + 0 * 90)), 0), transformation);
	transformation = mult(Animation, transformation);
	gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
	renderCone(sideCone, nConeSectors, gl, program);

	transformation = mult(translate(0, 0, 3), scalem(0.4, 1, 0.4));
	transformation = mult(rotate(90, [0, 0, -1]), transformation);
	transformation = mult(translate(0, Math.sin(0.03 * (time + 1 * 90)), 0), transformation);
	transformation = mult(Animation, transformation);
	gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
	renderCone(sideCone1, nConeSectors, gl, program);

	transformation = mult(translate(0, 0, -3), scalem(0.4, 1, 0.4));
	transformation = mult(rotate(90, [0, 0, 1]), transformation);
	transformation = mult(translate(0, Math.sin(0.03 * (time + 2 * 90)), 0), transformation);
	transformation = mult(Animation, transformation);
	gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
	renderCone(sideCone2, nConeSectors, gl, program);

	transformation = mult(translate(-3, 0, 0), scalem(0.4, 1, 0.4));
	transformation = mult(rotate(90, [1, 0, 0]), transformation);
	transformation = mult(translate(0, Math.sin(0.03 * (time + 3 * 90)), 0), transformation);
	transformation = mult(Animation, transformation);
	gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
	renderCone(sideCone3, nConeSectors, gl, program);

	transformation = mult(translate(0, 1, 0), scalem(0.4, 1, 0.4));
	transformation = mult(rotate(90, [1, 0, -1]), transformation);
	transformation = mult(translate(0, Math.sin(0.03 * (time + 3 * 90)), 0), transformation);
	transformation = mult(Animation, transformation);
	gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
	renderCone(sideCone4, nConeSectors, gl, program);

	transformation = mult(translate(0, 4, 0), scalem(0.4, 1, 0.4));
	transformation = mult(rotate(90, [1, 0, -1]), transformation);
	transformation = mult(translate(0, Math.sin(0.03 * (time + 5 * 90)), 0), transformation);
	transformation = mult(Animation, transformation);
	gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
	renderCone(sideCone5, nConeSectors, gl, program );

	requestAnimFrame( render );	
}

function Camera(event) {
	
	var key = String.fromCharCode(event.keyCode);
	
	switch(key){
		case 'D' || 'd':
			zPos += 0.1;
			LookAtXY = [xPos,0.5,zPos];
		break;

		case 'A' || 'a':
			zPos -= 0.1;
			LookAtXY = [xPos,0.5,zPos];
		break;

		case 'W' || 'w':
		camYpos += 0.1;
		LookAtXY = [camXpos, 0.5, camYpos];
		break;

		case 'S' || 's':
		camYpos -= 0.1;
		LookAtXY = [camXpos, 0.5, camYpos];
		break;

		case 'O' || 'o':
		camZpos += 0.1;
		LookAtXY = [camXpos, 0.5, camZpos];
		break;

		case 'I' || 'i':
		camZpos -= 0.1;
		LookAtXY = [camXpos, 0.5, camZpos];
		break;

		case "H" || 'h':
			alert("Use WASD keys to change the camera angle\n W: Brings the Camera closer \n A: Moves Camera to the left \n S: Moves Camera farther \n D: Moves Camera to the right"
				+ "\n I: To Zoom in \n O: To Zoom out");

		default:
			alert("Use WASD keys to change the camera angle\n W: Brings the Camera closer \n A: Moves Camera to the left \n S: Moves Camera farther \n D: Moves Camera to the right"
				+ "\n I: To Zoom in \n O: To Zoom out");
		
	}

}