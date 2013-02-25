Ext.define('SideNav.controller.SideNav', {
  extend: 'Ext.app.Controller',
  
  config: {
    
    views: ['SideNav.view.SideNav'],
    
    refs: {
      sideNav: 'sidenav',
      main: 'sidenav #main',
      contentContainer: 'sidenav #contentContainer',
      showLeftBtn: 'sidenav #showLeftBtn',
      showRightBtn: 'sidenav #showRightBtn',
      left: 'sidenav #left',
      right: 'sidenav #right'
    },
    
    control: {
      sideNav: {
        activate: 'addMainListeners'
      },
      showLeftBtn: {
        release: 'toggleLeft'
      },
      showRightBtn: {
        release: 'toggleRight'
      }
    },
    
    routes: {
    },
    
    handleSelector: 'top-toolbar'
    
  },
  
  init: function() {
    this.getApplication().on('appReady', function() {
      Ext.Viewport.add(Ext.create('SideNav.view.SideNav'));
    }, this);
  },
  
  addMainListeners: function() {
    
    this._leftShown = false;
    this._rightShown = false;
    
    this.getMain().getDraggable().setConstraint({
        min: { x: 0 - this.getLeft().element.getWidth(), y: 0 },
        max: { x: this.getRight().element.getWidth(), y: 0 }
    });
    
    this.getMain().getDraggable().on({
      dragstart: {
        fn: this.onDragStart,
        order: 'before',
        scope: this
      },
      dragend: {
        fn: this.onDragEnd,
        scope: this
      }
    });
    
  },
  
  checkMainShown: function() {
    if(this._leftShown || this._rightShown) {
      this.moveMain(0);
    }
  },
  
  // a drag has just finished: so move main to the nearest logical place
  mainSnapTo: function(draggable, e) {
    
    var velocity = Math.abs(e.deltaX / e.deltaTime),
    direction = (e.deltaX > 0) ? "right" : "left",
    offsetObj = Ext.clone(draggable.offset), offset = offsetObj.x,
    thresholdView = this.getLeft();
    
    if(offset < 0) thresholdView = this.getRight();
    
    var startOffsetObj = Ext.clone(draggable.dragStartOffset), startOffset = startOffsetObj.x,
    distance = offset - startOffset,
    threshold = parseInt(thresholdView.element.getWidth() * .70),
    twoThreshold = parseInt(thresholdView.element.getWidth() * .70) +
      parseInt(thresholdView.element.getWidth()),
    newOffset = startOffset,
    mustMove = velocity > 0.75 ? true : false;
    
    if(distance < 0) distance = 0 - distance;
    
    if((startOffset == 0 && (mustMove || distance > threshold)) ||
    (startOffset != 0 && distance > twoThreshold)) {
      if(direction == 'right') {
        newOffset = this.getLeft().element.getWidth();
      } else {
        newOffset = 0 - this.getRight().element.getWidth();
      }
    } else if(distance > threshold || mustMove) {
      newOffset = 0;
    }
    
    this.moveMain(newOffset);
  },
  
  // prevent the drag if it's not from the top toolbar
  onDragStart: function(draggable, e) {
    
    if(!Ext.isDefined(this._dragI)) this._dragI = 0;
    
    var dragI = this._dragI,
    xpos = Ext.clone(draggable.offset).x,
    
    // this is the method that makes sure the correct side is shown given draggable offset
    checkZIndices = function(draggable, dragI, lastxpos) {
      if(this._dragI != dragI) return;
      
      var xpos = Ext.clone(draggable.offset).x;
      
      if((xpos < 0 && lastxpos >= 0) || (xpos > 0 && lastxpos <= 0)) {
        if(xpos < 0) {
          this.getLeft().setZIndex(1);
          this.getRight().setZIndex(2);
        } else {
          this.getLeft().setZIndex(2);
          this.getRight().setZIndex(1);
        }
      }
      
      Ext.defer(checkZIndices, 50, this, [ draggable, dragI, xpos ], false);
    };
    
    node = e.target;
    while (node = node.parentNode) {
      if (node.className && node.className.indexOf(this.getHandleSelector()) > -1) {
        Ext.defer(checkZIndices, 50, this, [ draggable, dragI, xpos ], false);
        return true;
      }
    }
    return false;
  },
  
  onDragEnd: function(draggable, e) {
    this._dragI++;
    this.mainSnapTo(draggable, e);
  },
  
  // show or hide the left
  toggleLeft: function() {
    
    if(this._leftShown) {
      this.moveMain(0);
    } else {
      this.getLeft().setZIndex(2);
      this.getRight().setZIndex(1);
      this.moveMain(this.getLeft().element.getWidth());
    }
    
  },
  
  // show or hide the right
  toggleRight: function() {
    
    if(this._rightShown) {
      this.moveMain(0);
    } else {
      this.getLeft().setZIndex(1);
      this.getRight().setZIndex(2);
      this.moveMain(0 - this.getRight().element.getWidth());
    }
    
  },
  
  // move the main container
  moveMain: function(offset, callback) {
    offset = offset && Ext.isNumber(offset) ? offset : 0;
    
    this._leftShown = offset > 0 ? true : false;
    this._rightShown = offset < 0 ? true : false;
    
    var draggable = this.getMain().draggableBehavior.draggable;
    
    if(Ext.isFunction(callback)) {
      var translatable = draggable.getTranslatable();
      var hereCallback = Ext.bind(function() {
        translatable.un('animationend', hereCallback);
        callback();
      }, this);
      translatable.on('animationend', hereCallback);
    }
    
    draggable.setOffset(offset, 0, {
      duration: 100
    });
    
    if(offset == 0) {
      // make sure content container is not masked
      this.getMain().setMasked(false);
    } else {
      this.getMain().setMasked({
        transparent: true,
        listeners: {
          tap: {
            fn: this.moveMain,
            scope: this
          }
        }
      });
    }
  }
  
});