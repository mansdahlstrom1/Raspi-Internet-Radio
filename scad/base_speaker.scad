echo(version=version());

$fn = 64;

function rgbToColor(r, g, b , a = 1) = [r / 255, g / 255, b / 255, 1];
spaceGray = rgbToColor(52, 61, 70, 1);

// all Measurments are in mm
mangaScreenHeight = 84;
mangaScreenWidth = 150;

speakerWidth = 55;
speakerHeight = 55;

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
    cube([mangaScreenWidth, 5, mangaScreenHeight]);
  }
}

module speaker() {
  union()
  {
    rotate([0, 45, 0]) { cube([50, 5, 50], center = true); }
    cube([speakerWidth, 5, speakerHeight], center = true);
  }
}

speakerLeftPos = -100 - (mangaScreenWidth / 2);
speakerRightPos = 100 + (mangaScreenWidth / 2);

translate([0, 0, 0]) { body(120, 120, 500, 3); }
translate([-(mangaScreenWidth / 2), -5, 18]) { mangaScreen(); }
translate([speakerRightPos, -5, 60]) { speaker(); }
translate([speakerLeftPos, -5, 60]) { speaker(); }
