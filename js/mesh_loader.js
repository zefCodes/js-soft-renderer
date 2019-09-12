function mesh(vertices,faces) {
    this.vertices = vertices
    this.faces = faces
}

function mesh_loader() {
    this.load_model = function(loaded_model) {
        this.model_vertices = []
        this.model_faces = []
        var lines = loaded_model.split("\n")
        for (var i = 0; i<lines.length;i++) {
            if (lines[i][0]=="v" && lines[i][1]==" ") {
                var vertices = lines[i].match(/\S+/g)
                vertices.shift()
                vertices = vertices.map(function(val) {
                    val.data=Number(val.data)
                    return val
                })
                vertices.push(1)
                //console.log(vertices)
                this.model_vertices.push(new mat([vertices]))
            }

            if (lines[i][0]=="f" && lines[i][1]==" ") {
                var vertex_indices = lines[i].match(/\S+/g)
                vertex_indices.shift()
                var face = []
                //console.log(vertex_indices)

                for (var j =0;j<vertex_indices.length;j++) {
                    console.log(vertex_indices[j])
                    var data = vertex_indices[j].split("/")
                    face.push(Number(data[0]))
                }

                this.model_faces.push(face)
                console.log(face)
            }
        }
        return new mesh(this.model_vertices,this.model_faces)
    }
}
