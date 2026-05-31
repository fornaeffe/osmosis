(function() {
	var defaultLanguage = "it";
	var supportedLanguages = ["it", "en"];
	var storageKey = "osmosis-language";
	var currentTitleKey = "app.title";

	var resources = {
		it: {
			app: {
				title: "Osmosis simulator",
				canvasUnsupported: "Questo browser non supporta canvas.",
				controls: "Controlli",
				start: "Avvia",
				waterMolecules: "Molecole d'acqua:",
				sodiumIons: "Ioni sodio:",
				waterLabel: "Acqua",
				helpCredits: "Aiuto e crediti",
				languageLabel: "Lingua"
			},
			help: {
				title: "Osmosis simulator - Aiuto",
				heading: "Aiuto",
				intro: "Osmosis simulator \u00e8 uno strumento didattico per spiegare a livello microscopico il fenomeno dell'osmosi.",
				membrane: "Al centro \u00e8 mostrata una membrana semipermeabile (permeabile all'acqua, ma non agli ioni sodio). A sinistra della membrana sono presenti ioni sodio (viola), sia a sinistra che a destra sono presenti molecole d'acqua (rappresentate con cerchi rossi per l'ossigeno e bianchi per l'idrogeno).",
				controls: "In alto a sinistra \u00e8 presente un elenco espandibile di controlli.<br />\u00c8 possibile avviare o bloccare la simulazione.<br />\u00c8 possibile variare la quantit\u00e0 di molecole d'acqua da 1 a 50 (le nuove molecole vengono piazzate in modo casuale).<br />\u00c8 possibile variare la quantit\u00e0 di ioni sodio da 1 a 20 (i nuovi ioni vengono piazzati in modo casuale nella met\u00e0 sinistra della finestra).",
				simulation: "Avviando la simulazione con l'interruttore presente nell'elenco dei comandi le molecole iniziano a muoversi con velocit\u00e0 casuali. Gli ioni sodio non possono attraversare la membrana, le molecole d'acqua s\u00ec. Se le molecole d'acqua incontrano gli ioni sodio, stabiliscono con essi una interazione: in presenza di ioni sodio le molecole d'acqua, che all'inizio sono disposte casualmente, si concentreranno nel lato sinistro della finestra. Rimuovendo gli ioni sodio le molecole d'acqua, per diffusione, si distribuiranno nuovamente in modo pressoch\u00e9 equo ai due lati della membrana.",
				creditsHeading: "Attribuzioni",
				developedBy: "Sviluppato da Luca Fornasari: <a href=\"mailto:fornaeffe@gmail.com\">fornaeffe@gmail.com</a>",
				codeOrigin: "Origine delle parti di codice indicata nel codice stesso",
				contribute: "Se desiderate suggerire modifiche, segnalare bug o contribuire allo sviluppo di questa web app, <a href=\"mailto:fornaeffe@gmail.com\">scrivetemi</a> o visitate il <a href=\"https://github.com/fornaeffe/osmosis\">repository</a>."
			}
		},
		en: {
			app: {
				title: "Osmosis simulator",
				canvasUnsupported: "This browser does not support canvas.",
				controls: "Controls",
				start: "Start",
				waterMolecules: "Water molecules:",
				sodiumIons: "Sodium ions:",
				waterLabel: "Water",
				helpCredits: "Help & Credits",
				languageLabel: "Language"
			},
			help: {
				title: "Osmosis simulator - Help",
				heading: "Help",
				intro: "Osmosis simulator is an educational tool for explaining osmosis at a microscopic level.",
				membrane: "The center of the screen shows a semipermeable membrane (permeable to water, but not to sodium ions). Sodium ions (purple) are on the left of the membrane, while water molecules are on both sides (shown with red circles for oxygen and white circles for hydrogen).",
				controls: "At the top left there is an expandable list of controls.<br />You can start or pause the simulation.<br />You can vary the number of water molecules from 1 to 50 (new molecules are placed randomly).<br />You can vary the number of sodium ions from 1 to 20 (new ions are placed randomly in the left half of the window).",
				simulation: "When you start the simulation with the switch in the control list, the molecules begin moving at random speeds. Sodium ions cannot cross the membrane, while water molecules can. If water molecules encounter sodium ions, they interact with them: in the presence of sodium ions, the water molecules, which are initially arranged randomly, will concentrate on the left side of the window. Removing the sodium ions lets the water molecules diffuse and distribute themselves almost evenly again on both sides of the membrane.",
				creditsHeading: "Credits",
				developedBy: "Developed by Luca Fornasari: <a href=\"mailto:fornaeffe@gmail.com\">fornaeffe@gmail.com</a>",
				codeOrigin: "The origin of code fragments is indicated in the code itself",
				contribute: "To suggest changes, report bugs, or contribute to the development of this web app, <a href=\"mailto:fornaeffe@gmail.com\">write to me</a> or visit the <a href=\"https://github.com/fornaeffe/osmosis\">repository</a>."
			}
		}
	};

	function normalizeLanguage(language) {
		if (!language) return defaultLanguage;

		var shortCode = String(language).toLowerCase().split("-")[0].split("_")[0];
		return supportedLanguages.indexOf(shortCode) >= 0 ? shortCode : defaultLanguage;
	}

	function getUrlLanguage() {
		var match = window.location.search.match(/[?&]lang=([^&]+)/);
		return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
	}

	function getStoredLanguage() {
		try {
			return window.localStorage.getItem(storageKey);
		} catch (error) {
			return null;
		}
	}

	function persistLanguage(language) {
		try {
			window.localStorage.setItem(storageKey, language);
		} catch (error) {
			// The selector still works for the current page if storage is unavailable.
		}
	}

	function updateUrlLanguage(language) {
		try {
			if (!window.history || !window.history.replaceState) return;

			var search = window.location.search.replace(/^\?/, "");
			var parts = search ? search.split("&") : [];
			var nextParts = [];
			var foundLanguage = false;

			for (var i = 0; i < parts.length; i++) {
				if (!parts[i]) continue;

				var name = decodeURIComponent(parts[i].split("=")[0]);
				if (name === "lang") {
					nextParts.push("lang=" + encodeURIComponent(language));
					foundLanguage = true;
				} else {
					nextParts.push(parts[i]);
				}
			}

			if (!foundLanguage) nextParts.push("lang=" + encodeURIComponent(language));

			window.history.replaceState(null, document.title, window.location.pathname + "?" + nextParts.join("&") + window.location.hash);
		} catch (error) {
			// The stored language still keeps the selected locale for future visits.
		}
	}

	function getInitialLanguage() {
		return normalizeLanguage(
			getUrlLanguage() ||
			getStoredLanguage() ||
			document.documentElement.getAttribute("lang")
		);
	}

	function getValue(language, key) {
		var parts = key.split(".");
		var value = resources[language];

		for (var i = 0; i < parts.length; i++) {
			if (!value || !Object.prototype.hasOwnProperty.call(value, parts[i])) return null;
			value = value[parts[i]];
		}

		return typeof value === "string" ? value : null;
	}

	function translate(key) {
		var language = normalizeLanguage(document.documentElement.getAttribute("lang"));
		return getValue(language, key) || getValue(defaultLanguage, key) || key;
	}

	function translateTextElements() {
		var elements = document.querySelectorAll("[data-i18n]");

		for (var i = 0; i < elements.length; i++) {
			var key = elements[i].getAttribute("data-i18n");
			if (key) elements[i].textContent = translate(key);
		}
	}

	function translateHtmlElements() {
		var elements = document.querySelectorAll("[data-i18n-html]");

		for (var i = 0; i < elements.length; i++) {
			var key = elements[i].getAttribute("data-i18n-html");
			if (key) elements[i].innerHTML = translate(key);
		}
	}

	function translateAttributeElements() {
		var elements = document.querySelectorAll("[data-i18n-attrs]");

		for (var i = 0; i < elements.length; i++) {
			var attributes = elements[i].getAttribute("data-i18n-attrs");
			if (!attributes) continue;

			var pairs = attributes.split(";");
			for (var j = 0; j < pairs.length; j++) {
				var pair = pairs[j].split(":");
				if (pair.length !== 2) continue;

				var attributeName = pair[0].trim();
				var key = pair[1].trim();
				if (attributeName && key) elements[i].setAttribute(attributeName, translate(key));
			}
		}
	}

	function updateLanguageSelectors() {
		var selectors = document.querySelectorAll("[data-i18n-language-selector]");
		var language = normalizeLanguage(document.documentElement.getAttribute("lang"));

		for (var i = 0; i < selectors.length; i++) {
			selectors[i].value = language;
		}
	}

	function updateHelpLinks() {
		var links = document.querySelectorAll("[data-i18n-help-link]");
		var language = normalizeLanguage(document.documentElement.getAttribute("lang"));

		for (var i = 0; i < links.length; i++) {
			links[i].setAttribute("href", "help.html?lang=" + encodeURIComponent(language));
		}
	}

	function applyDomTranslations(language) {
		var nextLanguage = normalizeLanguage(language || document.documentElement.getAttribute("lang"));
		document.documentElement.setAttribute("lang", nextLanguage);
		document.title = translate(currentTitleKey);

		translateTextElements();
		translateHtmlElements();
		translateAttributeElements();
		updateLanguageSelectors();
		updateHelpLinks();

		document.dispatchEvent(new CustomEvent("osmosis:languagechange", {
			detail: { language: nextLanguage }
		}));
	}

	function bindLanguageSelectors() {
		var selectors = document.querySelectorAll("[data-i18n-language-selector]");

		for (var i = 0; i < selectors.length; i++) {
			selectors[i].onchange = function() {
				var nextLanguage = normalizeLanguage(this.value);
				persistLanguage(nextLanguage);
				updateUrlLanguage(nextLanguage);
				applyDomTranslations(nextLanguage);
			};
		}
	}

	function setupPageI18n(titleKey) {
		currentTitleKey = titleKey || "app.title";
		applyDomTranslations(getInitialLanguage());
		bindLanguageSelectors();
	}

	window.osmosisI18n = {
		applyDomTranslations: applyDomTranslations,
		getLanguage: function() {
			return normalizeLanguage(document.documentElement.getAttribute("lang"));
		},
		setupPageI18n: setupPageI18n,
		translate: translate
	};
})();
