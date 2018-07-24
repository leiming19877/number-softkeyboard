/**
 * @author leiming
 * @date 2016-11-05
 * softkeyoborad input control component for number input
 * 
 */
(function($){
	//soft keyboard container dom id
	var CONTAINER_ID = "_softkeyboard";
	var CONTAINER_WIDTH = 300;//
	var ARROW_HEIGHT = 10;
	//actual container height is 393 height,in here greeter it does not matter
	var CONTAINER_HEIGHT = 393+ARROW_HEIGHT;

	//_softkeyboard html template
	var TEMPLATE = [
	                '<div class="m-softkeyboard" id="_softkeyboard" name="_softkeyboard" >',
	                '<ul class="c-panel">',
	                '<li><input class="n-btn" type="button" value="7" /></li>',
	                '<li><input class="n-btn" type="button" value="8" /></li>',
	                '<li><input class="n-btn" type="button" value="9" /></li>',
	                '<li><input class="n-btn" type="button" value="4" /></li>',
	                '<li><input class="n-btn" type="button" value="5" /></li>',
	                '<li><input class="n-btn" type="button" value="6" /></li>',
	                '<li><input class="n-btn" type="button" value="1" /></li>',
	                '<li><input class="n-btn" type="button" value="2" /></li>',
	                '<li><input class="n-btn" type="button" value="3" /></li>',
	                '<li><input class="n-btn" type="button" value="0" /></li>',
	                '<li><div class="n-btn n-btn-del"></div></li>',
	                '<li><input class="n-btn n-btn-ok" type="button" value="确定" /></li>',
	                '</ul>',
	                '<div class="arrow arrow-top"></div>',
	                '</div>'
	                ].join('');
	/**
	 * build SoftKeyboard Class
	 * @returns SoftKeyboard
	 */
	function SoftKeyboard(){
		this.$container = null;//_softkeyboard jQuery object
		this.$input = null;// this $input object is jQuery object
		this.init();//init object
	}
	
	/**
	 * init $container child element
	 */
	SoftKeyboard.prototype.init = function(){
		//if is already exist dom id don't init 
		if(document.getElementById('_softkeyboard')){
			return ;
		}
		var self = this;
		$(document).ready(function(){
			//local load 
			if(TEMPLATE){
				$('body').append(TEMPLATE);
				self.$container = $("#"+CONTAINER_ID);
				self.initEvent();
			}else{
				//this to network get template,but don't this network is not work
				$.get("../js/softkeyboard-template.html",function(result){
					TEMPLATE = result;
					$('body').append(TEMPLATE);
					self.$container = $("#"+CONTAINER_ID);
					self.initEvent();
				});
			}
		});		
	}
	
	/**
	 * bind event for $container child element
	 */
	SoftKeyboard.prototype.initEvent = function(){
		var self = this;
		//for stop propagation event phase
		this.$container.on("click",function(e){
			e.stopPropagation();
		});
		//for document hide container
		$(document).on("click",function(e){
			var target = e.target;
			if(self.$input && self.$input.get(0) != target){
				self.$container.hide();
			}
		});
		//for insert number value
		this.$container.on("click","input.n-btn:not(.n-btn-del,.n-btn-ok)",function(e){
			if(self.$input.val() === '0'){
				self.$input.val(this.value);
				//trigger input  event,but I user this method found can't trigger input
				//so I user navtive h5 event,It's work ok
				//self.$input.trigger("input");
				// create event
				var evt = document.createEvent("HTMLEvents");
				// init evetn
				evt.initEvent("input", false, false);
				//trigger
				self.$input.get(0).dispatchEvent(evt);
			}else{
				self.$input.val(self.$input.val()+this.value);
				//trigger input  event
				//trigger input  event,but I user this method found can't trigger input
				//so I user navtive h5 event,It's work ok
				//self.$input.trigger("input");
		
				var evt = document.createEvent("HTMLEvents");
		
				evt.initEvent("input", false, false);
			
				self.$input.get(0).dispatchEvent(evt);
			}
		});
		//for delete last value
		this.$container.on('click',".n-btn-del",function(e){
			if(self.$input.val() === ''){
				//when empty do nothing
			}else{
				var len = self.$input.val().length;
				self.$input.val(self.$input.val().substring(0,len-1));
				//trigger input event
				self.$input.trigger("input");
			}
		 });
		//for 确定 botton hide component
		this.$container.on('click',".n-btn-ok",function(e){
			self.$container.hide();
			//trigger input change event
			self.$input.trigger("change");
		 });
	}
	
	/**
	 * get $input element position and width and left
	 */
	SoftKeyboard.prototype.getInputPosition = function(){
		var p ={
				'x':0,
				'y':0,
				'w':0,
				'h':0
		};//define init object
		var inputOffset = this.$input.offset();
		p.x = inputOffset.left;
		p.y = inputOffset.top;
		p.w = this.$input.outerWidth();
		p.h = this.$input.outerHeight();
		return p;
	}
	/**
	 * get $input element position and width and left
	 */
	SoftKeyboard.prototype.show = function($input){	
		this.$input = $input;
		var p = this.getInputPosition();
		var d = this.getDistanceLeftAndRight(p);
		this.$container.css({
			'left':p.x+p.w/2-150,
			'top':p.y+p.h+10
		});
		this.$container.show();
		var sl = document.body.scrollLeft;
		var st = document.body.scrollTop;
		if(d.xDis < 0 && d.yDis < 0 ){
			window.scrollTo(sl+Math.abs(d.xDis),st+Math.abs(d.yDis));
		}else if(d.xDis < 0 && d.yDis >0){
			window.scrollTo(sl+Math.abs(d.xDis),0);
		}else if(d.xDis > 0 && d.yDis < 0){
			window.scrollTo(0,st+Math.abs(d.yDis));
		}
	}
	
	/**
	 * get Container distance left and right 
	 * if xDis lass than zero ,body will scroll
	 * if yDis lass than zero,body will scroll
	 */
	SoftKeyboard.prototype.getDistanceLeftAndRight = function(inputPosition){
		var sW = document.documentElement.scrollWidth;
		//var sH = document.documentElement.scrollHeight;
		//current client scrollTop+offsetHeight
		var sH = document.body.scrollTop+document.body.offsetHeight;
		var p = inputPosition;
		//container arrow direct position 
		var cPosition = {
				'left':p.x+p.w/2-150,
				'top':p.y+p.h
		}
		var d = {
				xDis:sW-cPosition.left-CONTAINER_WIDTH,
				yDis:sH-cPosition.top-CONTAINER_HEIGHT
		}
		return d;
	}
	//new instants SoftKeyboard object 
	var keyboard = new SoftKeyboard();
	
	//extends jquery fn
	$.fn.softKeyboard = function(option){
		this.each(function(index,ele){
			var self = $(this);
			//just only for input text number and etc...
			if(self.is("input[type='text']") && !self.data("softKeyboard")){
				self.on("click",function(e){					
					keyboard.show(self);
				});
				//set self data
				self.data("softKeyboard","softKeyboard");
			}
		});
	}
})(jQuery);