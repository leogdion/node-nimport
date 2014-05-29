var shp = require('shp');

shp.readFile(__dirname + '/node_modules/shp/demo/TM_WORLD_BORDERS_SIMPL/TM_WORLD_BORDERS_SIMPL-0.3', function(error, data){
    console.log(JSON.stringify(data));
})