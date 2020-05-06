/*
Created by Peridax
Open source edpuzzle extension
Feel free to use this code, please give credit where it's due!

---

Yes, I am aware this is very sloppily written, and I cut
a good amount of corners, and sometimes wrote excessive code.
With everything being said, this is my first extension after
not programming for a while. I'm getting back on my feet,
programming more, and learning new things daily. I also wrote
this in a few hours of programming and research. I do plan
on rewritting this in the future, but for now, it works, and
it is what it is. If edpuzzle's API stays the same, I already
have a plan on rewritting this in the case that I get a lot
of reports that the extension isn't working on certain
assignments, otherwise I will only fix this when needed, or
rewrite if I really NEED to optimize the code. Yes, the code
can be further optimized and cleaned up, but for now, once
again, it is what it is.

Second day of developing this extension, and I can already
say that I in fact will be rewritting this in a much more
optimized, up to date, and robust fashion. I'll utilize the
timestamps in the Edpuzzle API to prevent answers from popping
up where they shouldn't, etc...

Github: Peridax
Email: peridaxx@gmail.com
*/
var manifestData = chrome.runtime.getManifest();
var extensionName = manifestData.name;
var assignmentData = new Object();

function main() {

	if (window.location.href.includes("/assignments/") ) {
		if (document.querySelector("aside")) {

			var assignment = window.location.href.split("https://edpuzzle.com/assignments/").join("").split("/")[0];
			var observer = new MutationObserver((event) => {
				calculate();
			}).observe(document.querySelector("aside"), { attributes: true });

			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			document.body.appendChild(iframe);
			console = iframe.contentWindow.console;
			window.console = console;

			console.log(`[${extensionName}] Successfully initialized.. fetching data`);

			fetchAnswers(assignment);
			checkForHome();
		} else {
			alert(`${extensionName} is currently not enabled, please reload the webpage. If this error persists, Edpuzzle+ is currently broken and will be fixed shortly. Thanks!\n\n- ${manifestData.author}`);
		}
	} else {
		console.log(`[${extensionName}] Not on an assignment`);
		checkURL();
	}

}

function calculate() {

	var lists = $("ul li:contains('MULTIPLE CHOICE')");

	if (lists.length) {
		$(lists).each((index) => {
			let question = $(lists).eq(index).find("section[aria-label='Interaction statement']");
			
			for (x in assignmentData) {
				let html = assignmentData[x].body[0].html;
				let div = $("<div>");
				$(div).html(html);
				let text = $(div).text();

				if ($(question).text() == text) {
					for (y in assignmentData[x].choices) {
						if (assignmentData[x].choices[y].isCorrect) {
							let html = assignmentData[x].choices[y].body[0].html;
							let div = $("<div>");
							$(div).html(html);
							let text = $(div).text();

							$(question).find("p").html($(question).find("p").html() + "<br><br><span style='color: #38a06e; font-size: 18px; font-weight: bold;'>Answer: " + text + "</span>");
						}
					}

					assignmentData[x].body[0].html = "";
				}
			}
		});
	}

}

function fetchAnswers(assignmentId) {

	if (assignmentId && typeof assignmentId == "string") {
		$.get(`https://edpuzzle.com/api/v3/assignments/${assignmentId}`).success((data) => {
			console.log(`[${extensionName}] Successfully fetched data!`);
			data.medias[0].questions.length ? assignmentData = data.medias[0].questions : console.log(`[${extensionName}] Error fetching data`);
		});
	} else {
		console.log(`[${extensionName}] Error with assignment ID, unable to retry.\nPlease contact extension developer`);
	}

}

function checkForHome() {
	$("button").find("img[alt='Edpuzzle']").click(() => { location.replace("https://edpuzzle.com") });
	$("span:contains('My Classes')").click(() => { location.replace("https://edpuzzle.com") });
	window.onhashchange = () => { location.replace("https://edpuzzle.com") };
}

function checkURL() {
	if (window.location.href.includes("/assignments/")) {
		console.log(`[${extensionName}] Firing main function`);
		setTimeout(main, 1000);
	} else {
		setTimeout(checkURL, 1000);
	}
};

$(document).ready(checkURL);