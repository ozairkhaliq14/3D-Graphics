class coneClass{
	constructor(gl, program) {
		this.gl = gl; // WebGL graphics environment
		this.program = program; // The shader program
		this.points = []; // Vertex location data
		this.colors = []; // Vertex color data
		this.texCoords = []; // Vertex texture coordinate data
	  
		// Generate random colors for the cones
		const randomColor = () => Math.random();
		const coneColors = Array.from({ length: 6 }, () => vec3(randomColor(), randomColor(), randomColor()));
		
		// Generate random coordinates for the cones
		const randomCoordinate = () => Math.random() * 10 - 5;
		const coneCoordinates = [
		vec3(randomCoordinate(), randomCoordinate(), randomCoordinate()),
		vec3(randomCoordinate(), randomCoordinate(), randomCoordinate()),
		vec3(randomCoordinate(), randomCoordinate(), randomCoordinate()),
		vec3(randomCoordinate(), randomCoordinate(), randomCoordinate()),
		vec3(randomCoordinate(), randomCoordinate(), randomCoordinate()),
		vec3(randomCoordinate(), randomCoordinate(), randomCoordinate())
		];

		// Set up the cone vertices
		this.points.push(coneCoordinates[0]);
		this.colors.push(coneColors[0]);
		this.texCoords.push(vec2(0, 0));

		this.points.push(coneCoordinates[1]);
		this.colors.push(coneColors[1]);
		this.texCoords.push(vec2(0, 1));

		this.points.push(coneCoordinates[2]);
		this.colors.push(coneColors[2]);
		this.texCoords.push(vec2(1, 0));

		this.points.push(coneCoordinates[3]);
		this.colors.push(coneColors[3]);
		this.texCoords.push(vec2(1, 1));

		this.points.push(coneCoordinates[4]);
		this.colors.push(coneColors[4]);
		this.texCoords.push(vec2(1, 0));

		this.points.push(coneCoordinates[5]);
		this.colors.push(coneColors[5]);
		this.texCoords.push(vec2(0, 1));

		const nPoints = 6;
		this.vbufferID1 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID1);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW);

		this.cbufferID1 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID1);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);

		this.tbufferID1 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tbufferID1);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(this.texCoords), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.enable(gl.DEPTH_TEST);

		// Initialization is done. Now initiate first rendering
		return;
}
	  
	
render() {
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return;
	}
}
