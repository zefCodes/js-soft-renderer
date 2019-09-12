function camera() {
    this.tx=0
    this.ty=0
    this.rx=0
    this.ry=0
    this.tz=0

    this.set_tx = function(val) {
        this.tx=val
    }
    this.set_tz = function(val) {
        this.tz=val
    }
    this.set_ty = function(val) {
        this.ty=val
    }
    this.get_tx = function() {
        return this.tx
    }
    this.get_tz = function() {
        return this.tz
    }
    this.get_ty = function() {
        return this.ty
    }

    this.set_rx = function(val) {
        this.rx=val
    }
    this.set_ry = function(val) {
        this.ry=val
    }

    this.get_rx = function() {
        return this.rx
    }
    this.get_ry = function() {
        return this.ry
    }

    this.get_camera_transform = function() {

        var tr_matrix = new mat (
            [
                [1,0,0,0],
                [0,1,0,0],
                [0,0,1,0],
                [-this.tx,-this.ty,-this.tz,1]
            ]
        )

        var rot_x_matrix = new mat (
            [

                [1,0,0,0],
                [0,Math.cos(this.rx),Math.sin(this.rx),0],
                [0,-Math.sin(this.rx),Math.cos(this.rx),0],
                [0,0,0,1]

            ]
        )

        var rot_y_matrix = new mat (
            [

                [Math.cos(this.ry),0,-Math.sin(this.ry),0],
                [0,1,0,0],
                [Math.sin(this.ry),0,Math.cos(this.ry),0],
                [0,0,0,1]

            ]
        )

        return tr_matrix.mul(rot_x_matrix).mul(rot_y_matrix)
    }
}
