function input_handler() {
    this.m_down=false
    this.mm_down=false
    this.prev_my=0
    this.prev_mx=0
    this.mx=0
    this.my=0
    this.zoom=0

    this.set_m_down = function(val) {
        this.m_down=val
    }

    this.set_mm_down = function(val) {
        this.mm_down=val
    }

    this.get_m_down = function() {
        return this.m_down
    }

    this.get_mm_down = function() {
        return this.mm_down
    }

    this.set_mx = function(val) {
        this.mx=val
    }

    this.set_my = function(val) {
        this.my=val
    }

    this.get_mx = function() {
        return this.mx
    }

    this.get_my = function() {
        return this.my
    }

    this.set_prev_mx = function(val) {
        this.prev_mx=val
    }

    this.set_prev_my = function(val) {
        this.prev_my=val
    }

    this.get_m_delta_x = function() {
        return this.mx-this.prev_mx
    }

    this.get_m_delta_y = function() {
        return this.my-this.prev_my
    }

    this.set_zoom = function(val) {
        this.zoom=val
    }

    this.get_zoom = function() {
        return this.zoom
    }
}
