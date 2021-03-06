/*
 * Este archivo se encarga de gestionar el filtro de marcadores
 * y las respuestas instantáneas en la búsqueda
 */
 
/*
 * BUGS
	La búsqueda se rompe con el símbolo +
 * TODO
	
 */

var search = {
	/*engines: [
		{
			name: "Google",
			favicon: "http://www.google.es/favicon.ico",
			url: {
				left: "http://www.google.es/search?q=",
				right: ""
			}
		},
		{
			name: "DuckDuckGo",
			favicon: "http://www.duckduckgo.com/favicon.ico",
			url: {
				left: "http://www.duckduckgo.com/?q=",
				right: ""
			}
		},
		{
			name: "Bing",
			favicon: "http://www.bing.com/favicon.ico",
			url: {
				left: "http://www.bing.com/search?q=",
				right: ""
			}
		},
		{
			name: "Youtube",
			favicon: "http://www.youtube.com/favicon.ico",
			url: {
				left: "http://www.youtube.com/results?search_query=",
				right: ""
			}
		},
		{
			name: "WolframAlpha",
			favicon: "http://www.wolframalpha.com/favicon.ico",
			url: {
				left: "http://www.wolframalpha.com/input/?i=",
				right: ""
			}
		}
	],*/
	engines: [],
	lenses: {},
	actions: {},
	highlighted: -1,
	last_query: "",
	Display: function() {
		
	},
	Instant: function() {
		var orig_query = $('#search_form > input').value;
		
		if (orig_query != search.last_query) {
			var sections = 1, links = 1, href = 1, name = 0;
			
			var regex = /^(http[s]?:\/\/|ftp:\/\/)?(localhost|([0-9A-Za-z-\.@:%_\+~#=])+((\.[A-Za-z][A-Za-z]+))+)([0-9A-Za-z-\.?&*@:%_\+~#=\/])*$/;
			var re = new RegExp(regex);
			if (orig_query.match(re)) {
				var link = orig_query;
				
				if (orig_query.indexOf('http://') != 0 && orig_query.indexOf('https://') != 0 && orig_query.indexOf('ftp://') != 0) {
					link = "http://" + orig_query;
				}
				
				$('#go_o').innerHTML = "<a href=\"" + link + "\" style=\"background-image: url(chrome://favicon/" + link + ");\">Ir<span class=\"url\">" + link + "</span></a>";
			} else {
				$('#go_o').innerHTML = "";
			}

			search.last_query = orig_query;
			var query = $('#search_form > input').value.toLowerCase().replace(/\)/g, '\\)').replace(/\(/g, '\\(');
			
			for (var e in search.lenses) {
				search.lenses[e].query(encodeURIComponent(orig_query));
			}
			
			/*search.best = [];
			var min_relev = -1;
			
			var removed_list = "";
			var no_coincidences = true;
			
			for (var i = 0; i < bookmarks.towers.length; i++) {
				var this_tower = bookmarks.towers[i];
				var any_link_in_tower = false;
				
				for (var j = 0; j < this_tower[sections].length; j++) {
					var this_section = this_tower[sections][j];
					var any_link_in_section = false;
					
					for (var k = 0; k < this_section[links].length; k++) {
						var l_name = this_section[links][k][name];
						var l_url = this_section[links][k][href].replace('http','').replace('s://','').replace('://','');
						
						if ($('#l'+i+'_'+j+'_'+k)) {
							var relevancia = -1;
							var words = query.split(' ');
							
							/* Buscamos cada palabra de búsqueda en los nombres y enlaces,
							   confeccionando una medida de la relevancia de cada uno a
							   partir del lugar de aparición de lo buscado                 /
							
							var rel_name = -1;
							var rel_url = -1;
							var todas_coinciden = true;
							
							for (var l = 0; l < words.length && todas_coinciden; l++) {
								var this_word = words[l];
								
								if (this_word != "") {
									var n_r = l_name.toLowerCase().search(this_word);
									var l_r = l_url.search(this_word);
									todas_coinciden = n_r > -1 || l_r > -1;
									
									if (n_r > -1) {
										if (rel_name == -1)
											rel_name = 0;
										
										rel_name = rel_name + n_r;
									}
									if (l_r > -1) {
										if (rel_url == -1)
											rel_url = 0;
										
										rel_url = rel_url + l_r;
									}
								}
							}
							
							if (todas_coinciden) {
								any_link_in_tower = true;
								any_link_in_section = true;
								
								var relevancia = 0;
								var penalizacion = 8;
								
								if (rel_url == -1) {
									relevancia += penalizacion;
								} else {
									relevancia += rel_url;
								}
								
								if (rel_name == -1) {
									relevancia += penalizacion;
								} else {
									relevancia += rel_name;
								}
							
								//$('#l'+i+'_'+j+'_'+k).style.display = 'block';
								
								var obj_encontrado = {
									name: l_name,
									href: l_url,
									from: this_tower[name]
								};
								
								// Por terminar aún...
								if (relevancia < min_relev) {
									search.best.unshift(obj_encontrado);
									
									if (search.best.length > 3) {
										search.best.pop();
									}
								} else if (search.best.length < 3) {
									search.best.push(obj_encontrado);
									
									min_relev = relevancia < min_relev || min_relev == -1 ? relevancia : min_relev;
								}
								
								// Ordenar los resultados más relevantes, eliminar
								// los menos relevantes, dejando solo 3.
							} else {
								//$('#l'+i+'_'+j+'_'+k).style.display = 'none';
								// Hacemos invisible el enlace
								removed_list += '#l'+i+'_'+j+'_'+k+', ';
							}
						}	
					}
					
					if (!any_link_in_section) {
						removed_list += '#section_'+i+'_'+j+', ';
					}
				}
				
				if (!any_link_in_tower) {
					removed_list += '#tower_'+i+', ';
				} else {
					no_coincidences = false;
				}
			}
			
			if (no_coincidences) {
				$("#bookmarks h1").classList.add("no-results");
			} else {
				$("#bookmarks h1").classList.remove("no-results");
			}
			
			removed_list += "dummy { display: none !important; }";
			
			if (!$('#search_css')) {
				var n_style = document.createElement('style');
				n_style.id = "search_css";
				$('body').appendChild(n_style);
			}
			$('#search_css').innerHTML = removed_list;*/
			
			var html_out = "";
			
			if (query == "") {
				$("body").classList.remove("search_mode");
				location.hash = "";
			} else {
				if (location.hash == "#search/start") location.hash = "#search/everything";
				$("body").classList.add("search_mode");
			
				/* Mejores resultados de marcadores
				var mejores = "";
				if (search.best.length > 0) {
					var tope = search.best.length;
					for (var m = 0; m < tope; m++) {
						var enl = search.best[m];
						
						if (!enl.href.match(/^((http[s]*|ftp|chrome[\-a-z]*):\/\/|javascript:)/)) {
							enl.href = "http://" + enl.href;
						}
						
						mejores += '<a href="' + enl.href + '" style="background-image: url(chrome://favicon/' + enl.href + ')">' + enl.name + '<span class="from"> in ' + enl.from + '</span><span class="url">' + enl.href + '</span></a>';
					}
				}
				
				html_out += mejores;*/
			}
			
			// Buscadores
			/*var search_html = "";
			
			for (i in search.engines) {
				engine = search.engines[i];
				
				search_html += '<a href="' + engine.url.left + encodeURIComponent(orig_query) + engine.url.right + '" style="background-image: url(' + engine.favicon + ')" class="search-item"><i class="icon-search icon-small"></i>' + engine.name + '</a>';
			}*/
			
			//$('#bookmarks_o').innerHTML = html_out;
			$('#engines_o').innerHTML = search_html;
			search.HighlightItem(0);
		}
	},
	HighlightItem: function(ind) {
		var env = $("section.displayed");
		if (env) {
			var all_links = env.querySelectorAll("a[href]");
			if (all_links[ind]) {
				if (env.querySelector("a.highlight")) {
					env.querySelector("a.highlight").classList.remove("highlight");
				}
				all_links[ind].classList.add("highlight");
				all_links[ind].scrollIntoViewIfNeeded();
			
				search.highlighted = ind;
			}
		}
	},
	HighlightByKey: function(ev) {
		ev = ev || window.event;
		
		if ($("body.search_mode")) {
			if (ev.keyCode == 38) {
				ev.preventDefault();
				search.HighlightItem(search.highlighted - 1);
			} else if (ev.keyCode == 40) {
				ev.preventDefault();
				search.HighlightItem(search.highlighted + 1);
			}
		} else if (ev.keyCode == 37) {
			start.speeddial.highlightItem(start.speeddial.highlighted - 1);
		} else if (ev.keyCode == 39) {
			start.speeddial.highlightItem(start.speeddial.highlighted + 1);
		}
	},
	FormSubmit: function() {
		var env = $("section.displayed");
		if ($("body.search_mode")) {
			if (env.querySelector("a.highlight")) {
				event.preventDefault();
				document.location.href = env.querySelector("a.highlight").href;
			}
		} else if ($("#speeddial a.highlight")) {
			event.preventDefault();
			document.location.href = $("#speeddial a.highlight").href;
		} else {
			return false;
		}
	},
	Load: function() {
		this.Display();
		$('#search_form > input').focus();
		$('#search_form > input').oninput = function() { search.Instant(); };
		$('#search_form > input').onpaste = function() { search.Instant(); };
		$('#search_form > input').onkeyup = function() { search.Instant(); };
		$('#search_form > input').onkeydown = function() { search.HighlightByKey(); };
		$('#search_form').onsubmit = function() { search.FormSubmit(); };
		
		//search.handlers = {};
		
		for (var e in search.lenses) {
			search.lenses[e].load();
		}
	}
};
