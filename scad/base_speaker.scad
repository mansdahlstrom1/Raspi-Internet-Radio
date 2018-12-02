echo(version=version());

$fn = 64;

function rgbToColor(r, g, b , a = 1) = [r / 255, g / 255, b / 255, 1];
spaceGray = rgbToColor(52, 61, 70, 1);

// all Measurments are in mm
mangaScreenHeight = 84;
mangaScreenWidth = 150;

speakerWidth = 57;
speakerHeight = 57;

module roundedcube(width, height, depth, radius){
  hull(){
    translate([radius, radius, 0]) cylinder(h=depth, r=radius, center = true);
    translate([width - radius, radius, 0]) cylinder(h=depth, r=radius, center = true);

    translate([radius, height - radius, 0]) cylinder(h=depth, r=radius, center = true);
    translate([width-radius,height-radius,0]) cylinder(h=depth, r=radius, center = true);
  }
}

module body(width, height, depth, radius, wallWidth = 5) {
  color(spaceGray) {
    rotate([0, 270, 0]) {
      difference()
      {
        roundedcube(width, height, depth, radius);
        translate([wallWidth, wallWidth, 0]) {
          roundedcube(
            width-(wallWidth * 2),
            height-(wallWidth * 2),
            depth+(wallWidth*2),
            radius
          );
        }
      }
    }
  }
}

module mangaScreen() {
  { 
    cube([mangaScreenWidth, 2, mangaScreenHeight]);
  }
}

module speaker() {
  difference() {
    hull() {
      rotate([0, 45, 0]) { cube([47, 2, 47], center = true); }
      cube([speakerWidth, 2, speakerHeight], center = true);
    }
    rotate([90, 0 ,0]) cylinder(h=5, r = 27);
  }

}

speakerLeftPos = -60 - (mangaScreenWidth / 2);
speakerRightPos = 60 + (mangaScreenWidth / 2);

translate([0, 0, 0]) { body(120, 120, 400, 3); }
translate([-(mangaScreenWidth / 2), -2, 18]) { mangaScreen(); }
translate([speakerRightPos, -2, 60]) { speaker(); }
translate([speakerLeftPos, -2, 60]) { speaker(); }
