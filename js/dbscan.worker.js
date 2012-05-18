onmessage = function (e) {
    dbscan(e.data.data, e.data.eps, e.data.minPts, e.data.distFuncName);
};

Distance = {
    fn: {}
}

//Minkowski p=1
Distance.fn.manhattan = function (p1, p2) {
    return Math.abs((p1.x - p2.x) + (p1.y - p2.y));
}
//Minkowski p=2
Distance.fn.euclid = function (p1, p2) {
    return Math.sqrt((p1.x - p1.y) ^ 2 + (p2.x - p2.y) ^ 2);
};


function dbscan(data, eps, minPts, distFuncName) {

    this.data = []; //dataset, e.g. [{x}
    this.eps = eps; //epsilon
    this.minPts = minPts; // minimum count of neighbors within eps
    this.distanceFunction = Distance.fn[distFuncName] || Distance.fn.manhattan;
    this.clusters = [];

    this.getNeighbors = function (p) {
        var neighbors = [];

        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].x === p.x && this.data[i].y === p.y) continue;
            if (this.distanceFunction(p, this.data[i]) <= this.eps) {
                neighbors.push(this.data[i]);
            }
        }
        return neighbors;
    }


    this.recursiveExpandCluster = function (p, c) {
        //add P to cluster C
        c.addPoint(p);
        //if P is not visited
        if ( !! !p.visited) {
            //mark P as visited
            p.visited = true;
        } else return;

        //N = getNeighbors(P, eps)
        var n = this.getNeighbors(p);
        //if sizeof(N) >= MinPts
        if (n.length >= this.minPts) {

            //for P' in N
            for (var i = 0; i < n.length; i++) {
                //if P' is not yet member of any cluster
                var isMember = false;
                for (var k = 0; k < this.clusters.length; k++) {
                    if (this.clusters[k].hasPoint(n[i])) {
                        isMember = true;
                        break;
                    }
                }
                //recursiveExpandCluster(P', C, eps, MinPts)
                if (!isMember) recursiveExpandCluster(n[i], c);
            }
        }
    }


    for (var i = 0; i < data.length; i++) {
        this.data.push(new Point(data[i].x, data[i].y));
    }


    for (var i = 0; i < data.length; i++) {
        //for each unvisited point P in dataset D
        if ( !! this.data[i].visited) continue;
        //mark P as visited
        this.data[i].visited = true;

        //N = getNeighbors(P, eps)
        var n = this.getNeighbors(this.data[i]);
        //if sizeof(N) < MinPts
        if (n.length < this.minPts) {
            //mark P as NOISE
            this.data[i].noise = true;
        } else {
            //C = next cluster
            var c = new Cluster();
            //add P to cluster C
            c.addPoint(this.data[i]);
            //for P' in N
            for (var i = 0; i < n.length; i++) {

                //if P' is not yet member of any cluster
                var isMember = false;
                for (var k = 0; k < this.clusters.length; k++) {
                    if (this.clusters[k].hasPoint(n[i])) {
                        isMember = true;
                        break;
                    }
                }
                //recursiveExpandCluster(P', C, eps, MinPts)
                if (!isMember) recursiveExpandCluster(n[i], c);
            }
        }
    }

    postMessage({
        status: "COMPLETE"
    });

}



function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Cluster(color) {
    this.color = color || 0x141414 + (0xFFFFFF - 0x141414) * Math.random() | 0;
    this.points = [];

    this.addPoint = function (p) {
        this.points.push(p);
        postMessage({
            x: p.x,
            y: p.y,
            visited: p.visited,
            color: this.color
        });
    }

    this.hasPoint = function (p) {
        for (var i = 0; i < points.length; i++) {
            if (this.points[i].x === p.x && this.points[i].y === p.y) {
                return true;
            }
        }
        return false;
    }
}