var targetNodes         = $("div.myquest-root");
var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
var myObserver          = new MutationObserver (mutationHandler);
var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };

//--- Add a target node to the observer. Can only add one node at a time.
targetNodes.each ( function () {
    myObserver.observe (this, obsConfig);
} );

function mutationHandler (mutationRecords) {
    console.info ("mutationHandler:");

    const frameName = "iframe.results-detail__iframe";
    $(frameName).on('load', function() {
  
      window.onbeforeunload = function() { 
        window.setTimeout(function () { 
          window.location = 'https://myquest.questdiagnostics.com/dashboard';
        }, 0); 
        window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
      }            
    });
}

const targetNode = document.getElementById('some-id');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

waitForElements();

function waitForElements() {
  const frameName = "iframe.results-detail__iframe";
  
    // Filter results
  //      
  // Review to zero
  waitForElInFrame(frameName, "#resultsNeedReview-0", function(el) {
    el.find(".qd-filter-panel__numeric-value").html(0);
  }, 100);

  // Expected to 9
  waitForElInFrame(frameName, "#resultsExpectedRange-0", function(el) {
    el.find(".qd-filter-panel__numeric-value").html(9);
  }, 100);


  // Test selectors
  waitForElInFrame(frameName, "div.multiplepanel", function(el) {

    const mpDiv = el.find("#9479082000160");

    mpDiv.attr("data-expectedrange", "true");

    // Remove Out of Range
    mpDiv.find("div.labRowAbnormal").html("<span class=\"seeDetailsText\"></span>");

    // Add negative
    mpDiv.find("div.dataRange").find("div.abnormalText")
      .removeClass("abnormalText")
      .addClass("seeDetailsText")
      .html("NEGATIVE");
  }, 100);


  // Test details
  waitForElInFrame(frameName, "#cit-column-report-detail-profile-0", function(el) {
    const detailDiv = el.find("div[data-result-id=\"9479082000160\"]");

    // Remove Out of Range
    detailDiv.find("span.abnormalText")
      .removeClass("abnormalText")
      .addClass("seeDetailsText")
      .html("");

    // Add negative
    detailDiv.find("div.abnormalText")
      .removeClass("abnormalText")
      .addClass("seeDetailsText")
      .html("<span>NEGATIVE</span> <span>ng/mL</span>");
  }, 100);


  // Print
  waitForElInFrame(frameName, "#print-profile-0", function(el) {
    const printDiv = el.find("div[data-print-result-id=\"9479082000160\"]");

    // Remove alert icon
    printDiv.find("div.icon").remove();

    // Change heading to regular text
    printDiv.find("span.abnormalText")
      .removeClass("abnormalText")
      .addClass("seeDetailsText");

    // Add negative
    printDiv.find("div.abnormalText")
      .removeClass("abnormalText")
      .addClass("seeDetailsText")
      .html("<div class=\"value1\">NEGATIVE</div>");
  }, 100);  
  
}

function waitForElInFrame(frame, selector, callback, maxtries = false, interval = 100) { 
  const poller = setInterval(() => {
    const el = $(frame).contents().find(selector);
    const retry = maxtries === false || maxtries-- > 0
    if (retry && el.length < 1) {
      //console.log(`Not found: ${maxtries}`)
      return // will try again
    }
    clearInterval(poller)
    callback(el || null)
  }, interval);
}