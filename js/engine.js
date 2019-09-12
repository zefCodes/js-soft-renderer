var c=document.getElementById("view")
var ctx=c.getContext("2d")
//2d viewport assumes 0,0 as top left corner
//3d coordinate system assumes 0,0 as origin and 0,1 as up and 1,0 as right
var vp = new viewport(50,50,900,600)
var display = new device(ctx,1000,700,vp)

function m_zoom(evt) {
    display.camera.set_tz(evt.deltaY/40 + display.camera.get_tz())
}

function mouse_down(evt) {
    display.input_handler.set_m_down(evt.button==0)
    display.input_handler.set_mm_down(evt.button==1)
    display.input_handler.set_prev_mx(evt.screenX)
    display.input_handler.set_prev_my(evt.screenY)
    display.input_handler.set_mx(evt.screenX)
    display.input_handler.set_my(evt.screenY)
}

function mouse_up(evt) {

    display.input_handler.set_m_down(false)
    display.input_handler.set_mm_down(false)
    display.input_handler.set_prev_mx(0)
    display.input_handler.set_prev_my(0)
}

function mouse_move(evt) {
    if(display.input_handler.get_m_down() || display.input_handler.get_mm_down()) {
        //console.log(evt)
        display.input_handler.set_mx(evt.screenX)
        display.input_handler.set_my(evt.screenY)
    }

}

function device(ctx,width,height,viewport) {
    this.height=height
    this.width=width
    this.ctx=ctx
    this.ctx.canvas.width=this.width
    this.ctx.canvas.height=this.height
    this.clear_color="rgb(30,30,30)"
    this.wireframe_color="rgb(100,100,100)"
    this.meshes = []
    this.input_handler = new input_handler()
    this.camera = new camera()
    this.aspect_ratio=this.width/this.height
    this.nearZ=-10
    this.farZ=-50
    this.fovy=100
    this.viewport=viewport
    this.ang = Math.tan(this.fovy*(Math.PI/180)/2)
    this.near_far_diff = this.farZ-this.nearZ
    this.backbuffer=this.ctx.getImageData(0, 0, this.width, this.height)
    this.perspective_matrix = new mat(
        [
            [1/(this.aspect_ratio*this.ang),0,0,0],
            [0,1/this.ang,0,0],
            [0,0,-this.farZ/this.near_far_diff,-1],
            [0,0,-(this.farZ*this.nearZ)/this.near_far_diff,0]
        ]
    )

    this.load_mesh = function(loaded_model) {
        var model_loader = new mesh_loader()
        var mesh = model_loader.load_model(loaded_model)
        this.meshes.push(mesh)
    }
	
	this.clear_mesh= function() {
		this.meshes=[]
	}

    this.setup = function() {
        this.camera.set_tz(200)
    }

    this.present = function () {
        this.ctx.putImageData(this.backbuffer, 0, 0);
    }

    this.clear=function() {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.clear_color
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.stroke()
        this.ctx.closePath()
        // once cleared with black pixels, we're getting back the associated image data to
        // clear out back buffer
        this.backbuffer = this.ctx.getImageData(0, 0, this.width, this.height);
    }

    this.draw_point = function(point,c) {
        this.backbufferdata = this.backbuffer.data;
        // As we have a 1-D Array for our back buffer
        // we need to know the equivalent cell index in 1-D based
        // on the 2D coordinates of the screen
        var index = ((point.i >> 0) + (point.j >> 0) * this.width) * 4;



        // RGBA color space is used by the HTML5 canvas
        this.backbufferdata[index] = 255;
        this.backbufferdata[index + 1] = 255;
        this.backbufferdata[index + 2] = 255;
        this.backbufferdata[index + 3] = 255;

    }

    this.max = function(a,b) {
        if (a>b) {
            return a
        }
        else if (b>a){
            return b
        }
        else {
            return a
        }
    }

    this.min = function(a,b) {
        if (a<b) {
            return a
        }
        else if (b<a){
            return b
        }
        else {
            return a
        }
    }

    this.draw_line = function(p1,p2,c,w) {
        var x0 = this.max(this.min(p1.i >> 0,this.viewport.x+this.viewport.w),this.viewport.x);
        var y0 = this.max(this.min(p1.j >> 0,this.viewport.y+this.viewport.h),this.viewport.y);
        var x1 = this.max(this.min(p2.i >> 0,this.viewport.x+this.viewport.w),this.viewport.x);
        var y1 = this.max(this.min(p2.j >> 0,this.viewport.y+this.viewport.h),this.viewport.y);
        //SHOULD BE USING THE INTERSECTION
        //y = mx+c
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        while(true) {
            this.draw_point(new Vector(x0, y0),c);
            if((x0 == x1) && (y0 == y1)) break;
            var e2 = 2 * err;
            if(e2 > -dy) { err -= dy; x0 += sx; }
            if(e2 < dx) { err += dx; y0 += sy; }
        }
    }

    this.draw_face = function(face,points,w) {
        for (var i = 0; i<face.length-1; i++) {
            this.draw_line(
                new Vector(points[face[i]-1][0],points[face[i]-1][1]),
                new Vector(points[face[i+1]-1][0],points[face[i+1]-1][1]),
                this.wireframe_color,
                w
            )
        }
        this.draw_line(
            new Vector(points[face[0]-1][0],points[face[0]-1][1]),
            new Vector(points[face[face.length-1]-1][0],points[face[face.length-1]-1][1]),
            this.wireframe_color,
            w
        )
    }

    this.draw_circle = function(x,y,r,w){
        this.ctx.beginPath()
        this.ctx.lineWidth=w
        this.ctx.arc(x,y,r, 0, Math.PI*2, true)
        this.ctx.fillStyle = this.wireframe_color
        this.ctx.strokeStyle = this.wireframe_color
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.stroke()
    }

    this.update = function() {
        if (this.input_handler.get_mm_down()) {
            this.camera.set_tx(-(this.input_handler.get_m_delta_x()/400*this.camera.get_tz()) + this.camera.get_tx())
            this.camera.set_ty((this.input_handler.get_m_delta_y()/400*this.camera.get_tz()) + this.camera.get_ty())
            //console.log(this.camera.get_camera_transform())
        }
        else if (this.input_handler.get_m_down()) {
            this.camera.set_rx((this.input_handler.get_m_delta_y()/700) + this.camera.get_rx())
            this.camera.set_ry((this.input_handler.get_m_delta_x()/700) + this.camera.get_ry())
            //console.log(this.camera.get_camera_transform())
        }
        this.input_handler.set_prev_mx(this.input_handler.get_mx())
        this.input_handler.set_prev_my(this.input_handler.get_my())

        this.camera.set_ry(this.camera.get_ry()+0.005)

        //console.log(this.camera.tx,this.camera.ty,this.camera.tz)

    }

    this.get_mesh_screen_coords = function() {
        var mesh_screen_coords=[]
        for (var i=0;i<this.meshes.length;i++) {
            var vertices = this.meshes[i].vertices

            vertex_window_coords=[]
            for (var j = 0; j<vertices.length;j++) {
                //applying camera transform before perspective matrix to convert to NDC (normalised device coordinates)
                var NDC = this.perspective_matrix.mul(this.camera.get_camera_transform().mul(vertices[j]))
                var NDC_X = NDC.matrix[0][0]/NDC.matrix[0][3]
                var NDC_Y = -NDC.matrix[0][1]/NDC.matrix[0][3]
                //converting to window coordinates
                var window_x = this.width/2 + (this.width*NDC_X)
                var window_y = this.height/2 + (this.height*NDC_Y)
                vertex_window_coords.push([window_x,window_y])
            }
            mesh_screen_coords.push(vertex_window_coords)

        }
        return mesh_screen_coords
    }

    this.draw_viewport = function(){
        this.ctx.lineWidth=1
        this.ctx.strokeStyle=this.wireframe_color
        this.ctx.rect(
            this.viewport.x,
            this.viewport.y,
            this.viewport.w,
            this.viewport.h
        )
        this.ctx.stroke();
    }

    this.render = function() {

        this.draw_viewport()

        if(this.meshes.length<1)
            return

        var mesh_vertices = this.get_mesh_screen_coords()

        for (var i = 0; i<mesh_vertices.length; i++) {
            var points=mesh_vertices[i]
            var faces = this.meshes[i].faces
            // for (var j = 0; j<points.length; j++) {
            //     this.draw_circle(points[j][0],points[j][1],2,1)
            // }

            for (var j = 0; j<faces.length; j++) {
                if (faces[j].length>2) {
                    this.draw_face(faces[j],points,0.2)
                    //console.log(faces[j])
                }
            }
        }



    }



}



function render_loop() {
    display.clear()
    display.update()
    display.render()
    display.present()
    requestAnimationFrame(render_loop)
}


function run_engine(){
    display.setup()
	display.load_mesh($("#init_mesh").text())
    requestAnimationFrame(render_loop);
}



function readFile(evt) {
   var files = evt.target.files;
   var file = files[0];
   var reader = new FileReader();
   reader.onload = function(event) {
        var loaded_model = event.target.result
		display.clear_mesh()
        display.load_mesh(loaded_model)
   }
   reader.readAsText(file)

}

$('#myFile').on("input",readFile);

run_engine()
