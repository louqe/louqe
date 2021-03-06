search.lenses.duckduckgo = new Lens({
	id: "duckduckgo",
	url: "http://api.duckduckgo.com/?&format=json&q=",
	name: "Answers",
	icon: "puzzle-piece",
	generateAnswer: function(content) {
		content = JSON.parse(content);
		var resultado = false;
		var def_link = false;
		var ddgl = document.createElement('span');
		
		if ($(".ddg-official-site")) {
			$(".ddg-official-site").parentNode.removeChild($(".ddg-official-site"));
		}
		
		if (content.Results[0]) { 
			var lin = content.Results[0];
			var res = document.createElement('a');
			res.innerHTML = lin.Text + "<span class='url'>" + lin.FirstURL + "</span>";
			res.href = lin.FirstURL;
			if (lin.Icon && lin.Icon.URL.length > 0) {
				res.style.backgroundImage = "url(" + lin.Icon.URL + ")";
			}
			
			if (content.Type == "A") { // Official site - appears on the left panel, instead of the answers section
				document.getElementById('go_o').appendChild(res);
			} else {
				ddgl.appendChild(res);
				resultado = true;
			}
		}
		if (content.Abstract != "") {
			var abs = document.createElement('a');
			abs.innerHTML = content.Abstract + '<span class="inlink_banner">' + content.AbstractSource + '</span>';
			abs.href = content.AbstractURL;
			ddgl.appendChild(abs);
			
			resultado = true;
			def_link = true;
		}
		if (content.Answer != "") {
			var ans = document.createElement('div');
			ans.classList.add('answer');
			ans.innerHTML = content.Answer.split('">')[1].split('</a>')[0].replace(/,/g, "");
			ans.innerHTML = content.Answer;
			ddgl.appendChild(ans);
			
			resultado = true;
		}
		if (content.Definition != "") {
			var def = document.createElement('a');
			def.innerHTML = content.Definition + '<span class="inlink_banner">' + content.DefinitionSource + '</span>';
			if (content.DefinitionURL)
				def.href = content.DefinitionURL;
			ddgl.appendChild(def);
			
			resultado = true;
			def_link = true;
		}
		
		//if (resultado) ddgl.innerHTML += '<div id="ddg_banner">Instant answers powered by <a href="https://duckduckgo.com">DuckDuckGo</a>.</div>';
		
		return ddgl.innerHTML;
	}
});