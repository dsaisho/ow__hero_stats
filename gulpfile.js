const gulp = require('gulp');
const {series} = require('gulp');
var glob = require("glob");
var flatten = require('gulp-flatten');
var replace = require('gulp-replace');

function format_ow_data() {
    return gulp.src(glob.sync("./_assets/data-table.txt"),)
          .pipe(replace(/<td [^>]+>(.*?)<\/td>/g, function (match) {
              let tdval=match.split('class="')[1].split('">')[0]
              tdval = tdval.replace('counter-data','')
              console.log(tdval);
              match = `<td>${tdval}</td>`
              return match;
          }))
          
          .pipe(gulp.dest('./_output'));
}
let images = '';
function get_hero_icons() {
//used to create html string of images so I can save them easier
      const getImages = gulp.src(glob.sync("./_assets/hero_icons.txt"),)
      //get all images
        .pipe(replace(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g, function (match) {
            //console.log(match)
            addImageToString(match)
            return match;
        }))
        .pipe(gulp.src(glob.sync("./_assets/hero_icons.txt"),)
        //now replace file contents with the string of images
        .pipe(replace(/<nav [^>]+>(.*?)<\/nav>/g, function (match) {
            match = images;
            return match;
        })))
        .pipe(gulp.dest('./_output'));
        console.log(images.length)
        return getImages;
}

function addImageToString(_img){
  //console.log('pushing',d,images.length)

  images += `<img src="${_img}" />`
  
}
// exports.build_assets = series(move_global_js, move_global_images, move_other_js);
exports.format_ow_data = format_ow_data;
exports.get_hero_icons = get_hero_icons;
// exports.move_global_js = move_global_js;
// exports.move_global_images = move_global_images;



////USE THIS TO CONVERT TXT OUTPUT TO JSON OBJECT:
//         https://www.convertjson.com/html-table-to-json.htm