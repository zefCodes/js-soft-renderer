function mat(matrix) {
    this.matrix=matrix
    this.columns=matrix.length
    this.rows=matrix[0].length

    this.mul=function(mat4) {
        res = []


        if (this.columns==mat4.rows) {
            for (var i = 0; i<mat4.columns;i++) {
                res.push([])
            }
            for (var i=0; i<this.rows; i++) {
                for (var j=0; j<mat4.columns; j++) {
                    sum=0
                    for (var k=0; k<this.columns; k++) {
                            ////console.log(" "+ this.matrix[k][i]+ " x " + mat4.matrix[j][k])
                            sum+=(this.matrix[k][i]*mat4.matrix[j][k])
                    }
                    res[j].push(sum)
                }
            }
            return new mat(res)
        }
        else {
            //console.log(this.rows)
            //console.log(mat4.columns)
            return null
        }
    }
}
