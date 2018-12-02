echo(version=version());

$fn = 64;

// all Measurments are in mm
mangaScreenHeight = 84;
mangaScreenWidth = 150;

speakerWidth = 55;
speakerHeight = 55;

module roundedcube(width, height, depth, radius){
  hull(){
    translate([radius,radius, 0]) cylinder(h=depth, r=radius, center = true);
    translate([width - radius, radius, 0]) cylinder(h=depth, r=radius, center = true);

    translate([radius, height - radius, 0]) cylinder(h=depth, r=radius, center = true);
    translate([width-radius,height-radius,0]) cylinder(h=depth, r=radius, center = true);
  }
}

// 100, 100, 20, 3, 1
module body(width, height, depth, radius, wallWidth = 5) {
  color([52 / 255, 61 / 255, 70 / 255, 1]) {
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

module hollowCylinder(d=5, h=10, wallWidth=1, $fn=128)
{
	difference()
	{
		cylinder(d=d, h=h);
		translate([0, 0, -0.1]) { cylinder(d=d-(wallWidth*2), h=h+0.2); }
	}
}

module hollowCube(d=5, h=10, wallWidth=1, $fn=128)
{
	difference()
	{
		cube(d=d, h=h);
		translate([0, 0, -0.1]) { cube(d=d-(wallWidth*2), h=h+0.2); }
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
    rotate([0, 45, 0]) { cube([50, 1, 50], center = true); }
    cube([speakerWidth, 1, speakerHeight], center = true);
  }
}

// hollowCylinder(d=10, h=20, wallWidth=1, $fn=128);

speakerLeftPos = -100 - (mangaScreenWidth / 2);
speakerRightPos = 100 + (mangaScreenWidth / 2);

translate([0, 0, 0]) { body(120, 120, 500, 3); }
translate([-(mangaScreenWidth / 2), -5, 18]) { mangaScreen(); }
translate([speakerRightPos, -5, 60]) { speaker(); }
translate([speakerLeftPos, -5, 60]) { speaker(); }
