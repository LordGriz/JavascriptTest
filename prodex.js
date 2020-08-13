var targetNodes = $("div.myquest-root");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = {
  childList: true,
  characterData: true,
  attributes: true,
  subtree: true
};

targetNodes.each(function () {
  myObserver.observe(this, obsConfig);
});

waitForElements();

function mutationHandler(mutationRecords) {
  console.info("mutationHandler:");

  const frameName = "iframe.results-detail__iframe";
  $(frameName).on('load', function () {

    window.onbeforeunload = function () {
      window.setTimeout(function () {
        window.location.replace("https://myquest.questdiagnostics.com/dashboard");
      }, 0);
      window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
    }
  });
}


function waitForElements() {
  const frameName = "iframe.results-detail__iframe";


  // waitForEl("#rs_AbnormalWarning_txt0-0", function(el) {
  //   el.html("&nbsp");
  // }, 100);


  // Filter results
  //      
  // Review to zero
  waitForElInFrame(frameName, "#resultsNeedReview-0", function (el) {
    el.find(".qd-filter-panel__numeric-value").html(0);
  }, 100);

  // Expected to 9
  waitForElInFrame(frameName, "#resultsExpectedRange-0", function (el) {
    el.find(".qd-filter-panel__numeric-value").html(9);
  }, 100);


  // Test selectors
  waitForElInFrame(frameName, "div.multiplepanel", function (el) {

    const mpDiv = el.find("#9479082000160");

    mpDiv.attr("data-expectedrange", "true");

    // Remove Out of Range
    mpDiv.find("div.labRowAbnormal").html("<span class=\"seeDetailsText\"></span>");

    // Add negative
    mpDiv.find("div.dataRange").find("div.abnormalText")
      .removeClass("abnormalText")
      .addClass("seeDetailsText")
      .html("NEGATIVE");

    mpDiv.on("click", function () {

      waitForElInFrame(frameName, "#cit-column-report-detail-profile-0", function (el) {
        const historyDiv = el.find("div[data-history-result-id=\"9479082000160\"]");
        // const historyDiv = el.find("dataHistoryGraph9479082000160");
        historyDiv.find("div.abnormalEntry")
          .removeClass("abnormalEntry")
          .addClass("abnormalOverrideEntry");

        historyDiv.find("div.patternGraphBox")
          .html("<span>NEGATIVE</span>");
      }, 100);
    });
  }, 100);


  // Test details
  waitForElInFrame(frameName, "#cit-column-report-detail-profile-0", function (el) {
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

    // const historyDiv = el.find("div[data-history-result-id=\"9479082000160\"]");
    // historyDiv.find("div.abnormalEntry")
    //   .removeClass("abnormalEntry")
    //   .addClass("abnormalOverrideEntry");

    // historyDiv.find("div.patternGraphBox")
    //   .html("<span>NEGATIVE</span>");


  }, 100);

  // waitForElInFrame(frameName, "#dataHistoryGraph9479082000160", function (el) {
  //   const historyDiv = el; //.find("div[data-history-result-id=\"9479082000160\"]");
  //   // const historyDiv = el.find("dataHistoryGraph9479082000160");
  //   historyDiv.find("div.abnormalEntry")
  //     .removeClass("abnormalEntry")
  //     .addClass("abnormalOverrideEntry");

  //   historyDiv.find("div.patternGraphBox")
  //     .html("<span>NEGATIVE</span>");
  // }, 500);


  // Print
  waitForElInFrame(frameName, "#print-profile-0", function (el) {
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

function waitForEl(selector, callback, maxtries = false, interval = 100) {
  const poller = setInterval(() => {
    const el = jQuery(selector);
    const retry = maxtries === false || maxtries-- > 0
    if (retry && el.length < 1) {
      //console.log(`Not found: ${maxtries}`)
      return // will try again
    }
    clearInterval(poller)
    callback(el || null)
  }, interval);
}

function starter() {
  alert("Started");
}