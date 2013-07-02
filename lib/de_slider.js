/*global document: true, window: true*/
/*jslint indent: 2*/

var Images, DE_SLIDER;


//Image list class, circular linked list
Images = (function() {
  'use strict';
  var Image, divSlider, viewportWidth, my;

  //Single image class
  Image = function(image) {
    this.image = image;
    this.divImage = document.createElement('div');
    this.divImage.appendChild(image);
    this.divImage.style.position = 'absolute';
    this.divImage.style.top = '0px';
    this.divImage.style.left = viewportWidth + 'px';
    this.divImage.style.visibility = 'hidden';
    this.divImage.style.zIndex = 50;
    this.imageWidth = 0;
    this.imgMargin = 1;
    this.nextImage = 0;
    this.prevImage = 0;

    this.loaded = false;
    this.visible = false;
  };

  //check if image has loaded, if has store useful properties
  Image.prototype.complete = function() {
    if (this.loaded) {
      return true;
    }

    if (!this.image.complete) {
      return false;
    }

    this.loaded = true;
    divSlider.appendChild(this.divImage);
    this.imageWidth = this.image.width + this.imgMargin * 2;
    this.divImage.style.width = this.imageWidth + 'px';
    return true;
  };

  //public methods
  my = {};

  //array where image objects will be stored
  my.images = [];
  my.length = 0;

  //return a list of images centered on startIndex and extending to and past the width of the div
  my.centeredImageList = function(startIndex) {
    var margin, pixelAccum, imgCount, imageList, imageIndex, visibleList, i;
    imageList = [];
    imageIndex = 0;
    visibleList = [];

    if (!startIndex) {
      startIndex = 0;
    }

    margin = (viewportWidth - my.images[startIndex].imageWidth) / 2;
    imageList.push(my.images[startIndex]);
    visibleList[startIndex] = true;

    i = startIndex + 1;
    pixelAccum = 0;
    imgCount = 0;
    while (!(pixelAccum >= margin && imgCount >= 1) && i !== startIndex) {
      if (i === my.images.length) {
        i = 0;
      }
      imageList.push(my.images[i]);
      pixelAccum = pixelAccum + my.images[i].imageWidth;
      visibleList[i] = true;
      imgCount += 1;
      i += 1;
    }

    i = startIndex - 1;
    pixelAccum = 0;
    imgCount = 0;
    while (!(pixelAccum >= margin && imgCount >= 1) && i !== startIndex) {
      if (i < 0) {
        i = my.images.length - 1;
      }
      imageList.unshift(my.images[i]);
      pixelAccum = pixelAccum + my.images[i].imageWidth;
      visibleList[i] = true;
      imageIndex += 1;
      imgCount += 1;
      i -= 1;
    }

    return {
      //offset to center imagelist in div
      'pixelOffset': margin - pixelAccum,
      //list of imageobject to display
      'imageList' : imageList,
      //index of centered image in imageList
      'imageIndex' : imageIndex,
      //index of flags indicating which images are being displayed in array form
      'visibleList' : visibleList
    };
  };

  //load up Image linked list after all images have been loaded, callback when done
  my.init = function(div, callback) {

    var checkLoaded, loadedInterval, imageNodes, imageNodesLength, visible, i;

    divSlider = div;
    viewportWidth  = divSlider.clientWidth;
    imageNodes = divSlider.getElementsByTagName('img');
    imageNodesLength = imageNodes.length;

    //collect images, attach to divs
    for (i = 0; i < imageNodes.length; i += 1) {
      my.images.push(new Image(imageNodes[i].cloneNode()));
      if (my.images.length - 2 >= 0) {
        my.images[my.images.length - 1].prevImage = my.images[my.images.length - 2];
        my.images[my.images.length - 2].nextImage = my.images[my.images.length - 1];
      }
    }

    checkLoaded = function() {
      var imagesLoaded, totalWidth;
      imagesLoaded = true;
      totalWidth = 0;
      for (i = 0; i < my.images.length; i += 1) {
        if (!my.images[i].complete()) {
          imagesLoaded = false;
        } else {
          totalWidth = totalWidth + my.images[i].imageWidth;
        }
      }
      if (imagesLoaded) {
        window.clearInterval(loadedInterval);

        while (totalWidth < viewportWidth * 2.5) {
          for (i = 0; i < imageNodesLength; i += 1) {
            my.images.push(new Image(imageNodes[i].cloneNode()));
            my.images[my.images.length - 1].complete();
            totalWidth = totalWidth + my.images[my.images.length - 1].imageWidth;
            if (my.images.length - 2 >= 0) {
              my.images[my.images.length - 1].prevImage = my.images[my.images.length - 2];
              my.images[my.images.length - 2].nextImage = my.images[my.images.length - 1];
            }
          }
        }
        my.images[0].prevImage = my.images[my.images.length - 1];
        my.images[my.images.length - 1].nextImage = my.images[0];

        //Remove images in slider div
        for (i = 0; i < imageNodesLength; i += 1) {
          divSlider.removeChild(imageNodes[0]);
        }
        divSlider.style.overflow = 'hidden';

        //Add visible images:
        visible = my.centeredImageList();

        my.updateImages(visible);

        my.length = my.images.length;
        callback();
      }
    };
    //Do when all images have a width, are loaded
    loadedInterval = window.setInterval(function(){
      checkLoaded();
    }, 100);

  };

  //take output returned from centeredImageList, and positions images in list to already visible images
  my.updateImages = function(params) {
    var imageList, startIndex, margin, i;

    imageList = params.imageList;
    startIndex = params.imageIndex;


    if (!imageList[startIndex].visible) {
      if (!imageList[startIndex].prevImage.visible && !imageList[startIndex].nextImage.visible) {
        margin = (viewportWidth - imageList[startIndex].imageWidth) / 2;
        imageList[startIndex].divImage.style.left = margin + 'px';
        imageList[startIndex].divImage.style.visibility = 'visible';
      } else {
        if (imageList[startIndex].prevImage.visible) {
          imageList[startIndex].divImage.style.left = parseInt(imageList[startIndex].prevImage.divImage.style.left, 10) + imageList[startIndex].prevImage.imageWidth + 'px';
        } else {
          imageList[startIndex].divImage.style.left = parseInt(imageList[startIndex].nextImage.divImage.style.left, 10) - imageList[startIndex].imageWidth + 'px';
        }
      }
    }

    for (i = startIndex + 1; i < imageList.length; i += 1) {
      my.imageAppend(imageList[i]);
    }

    for (i = startIndex - 1; i >= 0; i -= 1) {
      my.imagePrepend(imageList[i]);
    }
  };

  //take output returned from centerdImageList and hide all images that aren't in the list
  my.hideImages = function(params) {
    var i;
    for (i = 0; i < my.images.length; i += 1) {
      if (!params.visibleList[i]) {
        my.images[i].divImage.style.visibility = 'hidden';
        my.images[i].visible = false;
      }
    }
  };

  //for each visible image in images, call each
  my.forEachVisible = function(each) {
    var i;
    for (i = 0; i < my.images.length; i += 1) {
      if (my.images[i].visible) {
        each(my.images[i]);
      }
    }
  };

  //make image visible and position it after the image linked previous to it
  my.imageAppend = function(image) {
    if (!image.visible) {
      image.divImage.style.left = parseInt(image.prevImage.divImage.style.left, 10) + image.prevImage.imageWidth + 'px';
      image.divImage.style.visibility = 'visible';
      image.visible = true;
    }
  };

  //make image visible and position it previous to the image linked next to it
  my.imagePrepend = function(image) {
    if (!image.visible) {
      image.divImage.style.left = parseInt(image.nextImage.divImage.style.left, 10) - image.imageWidth + 'px';
      image.divImage.style.visibility = 'visible';
      image.visible = true;
    }
  };

  return my;
}());

//controls the sliding of the images
var DE_SLIDER = (function() {
  'use strict';
  var divSlider, state, currentImage, slideRate, slideCounter, slideAmount, slideMod, slideInterval, slideTimer, slideLeft, visible;

  divSlider = document.getElementById('de_slider');
  state = '';
  currentImage = 0;

  //set timer to automatically slide images left at timed interval
  function setTimer() {
    slideTimer = window.setInterval(function(){
      slideLeft();
    }, 3000);
  }

  //clear timer
  function clearTimer() {
    window.clearInterval(slideTimer);
  }

  //if module is currently not sliding images left, load and position all images, slide left, and hide all other images
  //if module is sliding images right, slide images back to original position.
  slideLeft = function() {
    var widthToNext, slideLoop;
    if (state !== 'left') {
      if (state !== 'right') {
        state = 'left';
        //shift images in list to the left && recalc visible images
        //Add visible images:
        currentImage += 1;
        if (currentImage === Images.length) {
          currentImage = 0;
        }
        visible = Images.centeredImageList(currentImage);

        widthToNext = (Images.images[currentImage].prevImage.imageWidth + Images.images[currentImage].imageWidth) / 2;
        slideRate = parseInt(widthToNext / 25, 10);
        slideCounter = parseInt(widthToNext / slideRate, 10);
        slideAmount = slideCounter;
        slideMod = parseInt(widthToNext % slideRate, 10);

        Images.updateImages(visible);

      } else {
        state = 'left';
        currentImage += 1;
        window.clearInterval(slideInterval);
        if (slideMod) {
          Images.forEachVisible(function(image) {
            image.divImage.style.left = (parseInt(image.divImage.style.left, 10) + slideMod) + 'px';
          });
        }
      }

      slideLoop = function() {
        //slide visible divImages
        if (slideCounter > 0) {
          Images.forEachVisible(function(image) {
            image.divImage.style.left = (parseInt(image.divImage.style.left, 10) - slideRate) + 'px';
          });
          slideCounter -= 1;
        } else {
          window.clearInterval(slideInterval);
          clearTimer();
          setTimer();
          if (slideMod) {
            Images.forEachVisible(function(image) {
              image.divImage.style.left = (parseInt(image.divImage.style.left, 10) - slideMod) + 'px';
            });
          }
          Images.hideImages(visible);
          state = '';
        }
      };

      slideInterval = window.setInterval(function(){
        slideLoop();
      }, 33);
    }
  };


  //if module is currently not sliding images right, load and position all images, slide right, and hide all other images
  //if module is sliding images left, slide images back to original position.
  function slideRight() {
    var widthToNext, slideLoop;
    if (state !== 'right') {
      if (state !== 'left') {
        state = 'right';

        currentImage -= 1;
        if (currentImage < 0) {
          currentImage = Images.length - 1;
        }

        visible = Images.centeredImageList(currentImage);

        widthToNext = (Images.images[currentImage].nextImage.imageWidth + Images.images[currentImage].imageWidth) / 2;
        slideRate = parseInt(widthToNext / 25, 10);
        slideCounter = 0;
        slideAmount = parseInt(widthToNext / slideRate, 10);
        slideMod = parseInt(widthToNext % slideRate, 10);
        //shift images in list to the right && recalc visible images

        Images.updateImages(visible);

      } else {
        state = 'right';
        currentImage -= 1;
        window.clearInterval(slideInterval);
        if (slideMod) {
          Images.forEachVisible(function(image) {
            image.divImage.style.left = (parseInt(image.divImage.style.left, 10) - slideMod) + 'px';
          });
        }
      }

      slideLoop = function() {
        //slide visible divImages
        if (slideCounter < slideAmount) {
          Images.forEachVisible(function(image) {
            image.divImage.style.left = (parseInt(image.divImage.style.left, 10) + slideRate) + 'px';
          });
          slideCounter += 1;
        } else {
          window.clearInterval(slideInterval);
          clearTimer();
          setTimer();
          if (slideMod) {
            Images.forEachVisible(function(image) {
              image.divImage.style.left = (parseInt(image.divImage.style.left, 10) + slideMod) + 'px';
            });
          }
          state = '';
        }
      };

      slideInterval = window.setInterval(function(){
        slideLoop();
      }, 33);
    }
  }

  //initialize Images, when done display prev and next buttons attach to sliding functions
  Images.init(divSlider, function() {
    var selectPrev, selectNext;
    if (Images.length > 0) {
      selectPrev = document.createElement('div');
      divSlider.appendChild(selectPrev);
      selectPrev.id = 'de_slider_prev';
      selectPrev.style.visibility = 'visible';

      selectNext = document.createElement('div');
      divSlider.appendChild(selectNext);
      selectNext.id = 'de_slider_next';
      selectNext.style.visibility = 'visible';

      selectPrev.onclick = function() {
        slideRight();
      };

      selectNext.onclick = function() {
        slideLeft();
      };

      setTimer();
    }
  });

}());