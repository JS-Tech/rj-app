var fs = require('file-system');
var imagepickerModule = require("nativescript-imagepicker");
var permissions = require( "nativescript-permissions");
var platformModule = require("platform");
var camera = require("nativescript-camera");
var imageSource = require("image-source");

var Imagepicker = {

  select: function() {
    console.log("SELECT")
    if (platformModule.device.os === "Android" && platformModule.device.sdkVersion >= 23) {
      return permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "I need these permissions to read from storage")
      .then(function() {
        return Imagepicker._start();
      })
      .catch(function() {
        console.log("Unauthorized to access external storage")
      });
    } else {
      console.log("SELECT FINISHED")
      return Imagepicker._start();
    }
  },

  take: function() {
    camera.requestPermissions();

    return camera.takePicture().then(function(imageAsset) {
      return imageSource.fromAsset(imageAsset).then(function(imageSource) {

        return Imagepicker._saveTempfile(imageSource);

      });
    }).catch(function(e) {
      console.log(e);
    });
  },

  _start: function() {

    console.log("START")

    var context = imagepickerModule.create({
      mode: "single"
    });

    return context.authorize().then(function() {
      return context.present();
    }).then(function(selection) {

      console.log("SELECTED")

      return selection[0].getImage().then(function(imageSource) {

        console.dump(imageSource)

        return Imagepicker._saveTempfile(imageSource);
      });
    }).catch(function (e) {
        console.log(e);
    });
  },

  _saveTempfile: function(imageSource) {

    console.log("SAVE")
    console.log(imageSource)

    var folder = fs.knownFolders.documents();
    console.log(folder)

    var filename = "img_" + new Date().getTime() + ".jpeg";
    console.log(filename)
    var path = fs.path.join(folder.path, filename);
    console.log(path)
    var saved = imageSource.saveToFile(path, "jpeg");
    console.log("saved: " + saved)
    if(saved) {
      return { path: path, source: imageSource };
    }

    return false;
  }

}

module.exports = Imagepicker;
