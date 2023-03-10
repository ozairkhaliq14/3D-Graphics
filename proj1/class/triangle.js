var gl;
var bufferId1, bufferId2, bufferId3, bufferId4, bufferId5, bufferId6, bufferId7, bufferId8;
var program;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    //  Configure WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

	var x1 = Math.random(), y1 = Math.random() * x1, 
        x2 = Math.random(), y2 = Math.random() * x2, 
        x3 = Math.random(), y3 = Math.random() * x3;

    var tri1 = new Float32Array([x1, y1 , x2, y2, x3, y3]);
	var tri2 = new Float32Array([x1, -y1 , x2, -y2, x3, -y3]);
	var tri3 = new Float32Array([-x1, y1 , -x2, y2, -x3, y3]);
	var tri4 = new Float32Array([-x1, -y1 , -x2, -y2, -x3, -y3]);
	var tri5 = new Float32Array([y1, x1 , y2, x2, y3, x3]);
	var tri6 = new Float32Array([y1, -x1 , y2, -x2, y3, -x3]);
	var tri7 = new Float32Array([-y1, x1 , -y2, x2, -y3, x3]);
	var tri8 = new Float32Array([-y1, -x1 , -y2, -x2, -y3, -x3]);
    

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    // Load the data into the GPU
    bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER,tri1, gl.STATIC_DRAW);

    bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER,tri2, gl.STATIC_DRAW);
	
    bufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
    gl.bufferData(gl.ARRAY_BUFFER,tri3, gl.STATIC_DRAW);   

	bufferId4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId4);
    gl.bufferData(gl.ARRAY_BUFFER,tri4, gl.STATIC_DRAW);
	
	bufferId5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId5);
    gl.bufferData(gl.ARRAY_BUFFER,tri5, gl.STATIC_DRAW);
	
	bufferId6 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId6);
    gl.bufferData(gl.ARRAY_BUFFER,tri6, gl.STATIC_DRAW);
	
	bufferId7 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId7);
    gl.bufferData(gl.ARRAY_BUFFER,tri7, gl.STATIC_DRAW);
	
	bufferId8 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId8);
    gl.bufferData(gl.ARRAY_BUFFER,tri8, gl.STATIC_DRAW);
	
    render();
};


function render() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    const bufferIds = [bufferId1, bufferId2, bufferId3, bufferId4, bufferId5, bufferId6, bufferId7, bufferId8];

    for (let i = 0; i < bufferIds.length; i++) {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferIds[i]);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  