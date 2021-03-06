search.lenses.flickr = new Lens({
	id: "flickr",
	url: "http://api.flickr.com/services/rest/?method=flickr.tags.getClusterPhotos&api_key=2c20d4d9b0158e2b60baf150907f5176&format=json&nojsoncallback=1&tag=",
	name: "Photos",
	icon: "picture",
	delay: 1000,
	generateAnswer: function(response) {
		response = JSON.parse(response);
		var cont = "<div class='photo-ribbon'>";
		var pic_array = [];
		
		if (response.stat == "ok") {
			var photo_list = response.photos.photo;
			
			for (i in photo_list) {
				var photo = photo_list[i];
				var url = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server +  "/" + photo.id + "_" + photo.secret + ".jpg";
				var author = photo.username;
				var author_link = "http://www.flickr.com/photos/" + photo.owner + "/";
				var pic_link = author_link + photo.id;
				var title = photo.title;
				
				pic_array.push({
					class: "bigthumb",
					href: pic_link,
					html: '<img src="' + url + '" />' + title + '<br /><span class="author">' + author + '</span>'
				});
				//cont += '<div class="photo"><a href="' + pic_link + '" title="' + title + '"><img src="' + url + '" /></a><br />by <a href="' + author_link + '" title="' + author + '">' + author + '</a></div>';
			}
		}
		
		cont += "</div>";
		
		return pic_array;
	}
});