(function() {
	document.querySelector('.form__input').focus(); // gives immediate focus to the form
	var domList = document.querySelector('#js-result');
	var domInput = document.querySelector('#js-input');
	var title = document.querySelector('.header__title');

	var autocompleteURL = '/suggest/?q='; // function scoped variable for the search string
	var searchQueryURL = '/search/?q='; // endpoint to request search results
	var inputString = '';
	var resultScnTitle = document.querySelector('#js-resTitle');
	var resultScnList = document.querySelector('#js-resList');

	displayReset();
	// ADD LISTENER TO COMBINE IT ALL TOGETHER
	request.addListener('#js-submit', 'keyup', function(event) {
		event.preventDefault();
		displayReset();
		inputString = domInput.value.trim();
		//STETCH: if statement to handle highlight deletion
		// Creates our Search String
		if (inputString === '') {
			removeChildren();
		}
		if ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 32) {
			// Do we care about punctuation and add more key codes ie space bar? (stretch!!!)
			if (inputString !== '') {
				request.fetch(autocompleteURL + inputString, displaySuggestions);
			}
		} else if (event.keyCode === 8 && inputString !== '') {
			// on backspace
			request.fetch(autocompleteURL + inputString, displaySuggestions);
		} else if (event.keyCode === 13) {
			//"ENTER"
			inputString = domInput.value;
			request.fetch(searchQueryURL + inputString, displayResults);
		}
	});

	// add listener to the form for dropdown content menu
	domList.addEventListener('click', function(event) {
		request.fetch(
			searchQueryURL + event.target.firstChild.textContent,
			displayResults
		);
		replaceInput(event);
	});

	request.addListener('#js-submit', 'keydown', function(event) {
		if (event.keyCode === 13) {
			//"ENTER"
			event.preventDefault();
		}
	});

	// DOM MANIPULATION FUNCTIONS

	// Invalid input handle
	function inputValidator() {
		var figure = document.createElement('figure');
		var unicorn = document.createElement('img');
		unicorn.classList.add('is--smallSVG');
		unicorn.src = 'public/emoji/unicorn.svg';
		figure.appendChild(unicorn);
		title.textContent = 'What the FAC is this animal?';
		title.appendChild(figure);
	}

	// Remove list
	function removeChildren() {
		while (domList.firstChild) {
			domList.removeChild(domList.firstChild); // refreshes tracklist for repeadted searches
		}
	}
	// Function to display autocomplete suggestions
	function displaySuggestions(response) {
		response.forEach(function(item) {
			var domItem = document.createElement('li');
			domItem.classList.add('form__suggestions__item');

			var title = document.createElement('span');
			title.classList.add('form__suggestions__text');
			title.textContent = item;
			domItem.appendChild(title);

			domList.appendChild(domItem);
		});
	}

	// Function to display result query
	function displayResults(response) {
		console.log(response);
		if (response.length === 0) {
			// Search validation
			inputValidator();
		} else {
			resultScnTitle.textContent = response[0].CommonName;
			var keys = [
				'Order',
				'Suborder',
				'Infraorder',
				'Superfamily',
				'Family',
				'Subfamily',
				'Tribe',
				'Genus',
				'Subgenus',
				'Species',
				'Subspecies'
			];
			keys.forEach(function(key) {
				var text = response[0][key];
				if (text) {
					var resItem = document.createElement('li');
					resItem.classList.add('result__item');
					
					var resKey = document.createElement('span');
					resKey.classList.add('result__key')
					resKey.textContent = key + ': ';
					resItem.appendChild(resKey);

					var resValue = document.createElement('span');
					resValue.classList.add('result__value')
					resValue.textContent = response[0][key];
					resItem.appendChild(resValue);
					
					resultScnList.appendChild(resItem);
				}
			});
		}
	}

	// after results have been displayed; reset stuff;
	function displayReset() {
		removeChildren();
		resultScnTitle.textContent = '';
		title.textContent = 'Scientific Taxonomy for Mammals of the World'; // why does this work?? why do we n ot need to remove child node to lose the unicorn?
		while (resultScnList.firstChild) {
			resultScnList.removeChild(resultScnList.firstChild); // refreshes tracklist for repeadted searches
		}
	}

	// once click on the list, will update input
	function replaceInput(event) {
		domInput.value = event.target.firstChild.textContent;
		removeChildren();
	}

	document.querySelector('.form').reset(); // resets search form input field
})();
