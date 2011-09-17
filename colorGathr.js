// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
	
  // Color Model
  // -----------

  window.Color = Backbone.Model.extend({
	
	// default attributes for a color
	defaults: function() {
		return {
			colorValue: gray,
			gathrd: false,
			player: null
		};
	};
	
	// Toggle the 'gathrd' state of this color
	toggle: function() {
	  this.save({gathrd: !this.get("gathrd")});
	}
	
  });

  // Color Collection
  // ----------------

  // The collection of Colors is backed by *localStorage* instead of a 
  // remote server
  window.Colors = Backbone.Collection.extend({
	
	// Reference to this collection's model.
	model: Color,
	
	// Save all the colors !
	localStorage: new Store("colors"),
	
	// Recieve A Color From A Player
	recive: function () {
		return this.filter(function(color){ return color.toggle(); })};
	}
	
  });

  // Create our global collection of **Colors**
  window.Colors = new Colors;
	
  // Color View
  // ----------
	
  // The DOM element for a color item...
  window.ColorView = Backbone.View.extend({
		
	// ... is a list tag.
	tagName: "li",
		
	// Cache the template function for a single item 
	template: _.template($('#color-template').html()),
		
	// The DOM events specific to a color.
	events: {
		// none I can think of
	},
		
	// The ColorView listens for changes to its model, re-rendering.
	initialize: function() {
		this.model.bind('gathr', this.render, this);
		this.model.bind('ungathr', this.remove, this);
	},
		
	// Re-render the color when it is gathrd
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setText();
      return this;
    },
	
	// To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setText: function() {
      var text = this.model.get('sharedFrom');
      this.$('.sharedFrom').text(text);
      //this.input = this.$('.todo-input');
      //this.input.bind('blur', _.bind(this.close, this)).val(text);
    },
	
	// Toggle the "gathrd" state of the ///. huh?
	toggleGathrd: function() { 
		this.model.toggle();
	},
		 
	// Remove the color, destory the model.
		clear: function() {
		this.model.destroy();
	}
		
  });
	
	// The Application
	// ---------------
	
	// Overall **AppView** is the top level piece of UI.
	window.AppView = Backbone.View.extend({
		
		// Bind to the exisiting skeleton of the App already present in the HTML
		el: $("#gathrColorsApp"),
		
		// The template for the line of statisits at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),
		
		// Delagated events for gathring a color
		events: {
			// not clear to me yet
		},
		
		// At initialization we bind to the relevant events on the 'Colors"
		// collection, when a color is gathr'd. Kick things off by
		// loading any prerexisting colors that might be saved in *localStorage*.
		
		initialize: function () {
			this.input = this.$("#new-color");
			
			/// ummmmm...
			Colors.fetch();
		},
		
		// Re-rending of the App just means refreshing the statisitcs -- the rest 
		// of the app doesn't change
		render: function() {
			this.$('#color-stats').html(this.statsTemplate({
				total:     Colors.length,
				gathrd:      Colors.gatherd().length,
				remaining:      Colors.remaining().length
			}));
		},
		
		// Add all colors in the **Colors** collection at once
		addAll: function() {
			Colors.each(this.addOne);	
		},
		
		// If you hit return in the main input field, and there is a code to process
		// create new **Color** model persisting it to *localStorage*.
		
		
		
	})
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
