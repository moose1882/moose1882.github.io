// Co-ordinates the interaction of elements on the page
//dazOps

(function() {
  var DOM = {};
  DOM.required = $(".required");
  DOM.total = $(".total");
  DOM.secret = $(".secret");
  DOM.distributesize = $(".distributesize");
  DOM.recreatesize = $(".recreatesize");
  DOM.error = $(".error");
  DOM.generated = $(".generated");
  DOM.emails = $(".emails");
  DOM.combined = $(".combined");
  DOM.secret_name = $(".secret_name");
  document.getElementById("clickMe").onclick = theShed; //call the function to build a shardShed for each recipient

  var shardRcpt = []; // add the shards to an array. to be used to send to reciepients
  var emailRecpt = []; // add the emails to an array.
  var genUUID = generateUUID(); // grab a UUID for this pageload
  var finishedShed = [];
  required = parseFloat(DOM.required.value);
  numberOfShards = required - 1;
  emailsStr = DOM.emails.value;
  emails = emailsStr.trim().split(/\s+/); // Validate and sanitize the email list
  var k = 0;
  function init() {
    // Events
    DOM.required.addEventListener("input", generateShards);
    DOM.total.addEventListener("input", generateShards);
    DOM.secret.addEventListener("input", generateShards);
    DOM.emails.addEventListener("input", combineEmails);
  }

  function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function theShed() {
    //generateShards(); // refreshs the display
    shardRcpt = [];
    finishedShed = [];
    DOM.generated.textContent = "";
    // Form validation
    if (emails.length < parseFloat(DOM.total.value)) {
      DOM.error.textContent =
        "Number of Emails must be equal to: " + parseFloat(DOM.total.value);
      return;
    } else if (emails.length > parseFloat(DOM.total.value)) {
      DOM.error.textContent =
        "Number of Emails must be equal to: " +
        parseFloat(DOM.total.value) +
        ". Extra emails will be ingnored";
    } else {
      DOM.error.textContent = "";
    }

    for (var w = 0; w < shares.length; w++) {
      //generateShards(); // refreshs the display
      // appends each shard to the shardRcpt array.
      shardRcpt.push(shares[w]);
    }

    for (k < shares.length; k++; ) {
      // prepends an email address to the shardRcpt object.
      // Changed the array loop from number of emails to number of shares as share # is the constraint.
      // Not logical to have more email addresses then shards to share.
      emailRecpt.push(emails[k]); // add all emails to emailRecpt array
    }
    shardRcpt_length = shardRcpt.length;
    /** // Have to cater for both weighted and fullDistro.
    if (weightedShard === "weighted") {
      loopLength = shardRcpt_length - required;
    } else {
      loopLength = (shardRcpt_length);
    }*/
    for (var i = 0; i < shardRcpt_length; i++) {
      // Start adding emails and shards to arrays
      //capture radio btn state.
      //If eq 'weighted' then add 1 to the total shards required
      //If eq to fullConsent then keep same number of shard
      // set up DSM's shards
      dsmShard_length = shardRcpt_length - required + 1;
      if (i === dsmShard_length && weightedShard === "weighted") {
        for (var u = i; u < shardRcpt_length; u++) {
          shardRcpt[u] = emails[0] + "ZxxZ" + shardRcpt[u]; // If tjhis is weighted, then attach the last shard to the first email
          i++;
        }
      } else {
        shardRcpt[i] = emails[i] + "ZxxZ" + shardRcpt[i]; //add [i] element from email array to the fromt of the shard array
      }
    }

    //
    //Start making the shardShed
    //
    for (var q = 0; q < shardRcpt.length; q++) {
      var shardShed = new Object(); // declare the JSON data model for each shard
      //metaData
      stripEmail = shardRcpt[q].split(/[Z,\/ -]/); // get the email
      shardShed.id = q;
      shardShed.secret_name = DOM.secret_name.value;
      shardShed.secret_uuid = genUUID;

      //payload
      stripShard = shardRcpt[q].split(/[Z,\/ -]/); //get the shard
      shardShed.shard_email = stripEmail[0];
      shardShed.shard = stripShard[2];
      //completed, unique shardShed per email address
      finishedShed[q] = shardShed;
      sendShard(shardShed.shard_email, shardShed.secret_name, shardShed.shard);
    }
    console.log("finishedShed");
    console.log(finishedShed);

    //send shardShed via emailJS
    //sendShard(shardShed.shard_email);
    return finishedShed;
  }

  function generateShards() {
    // Clear old generated
    console.log(weightedShard);
    DOM.generated.innerHTML = "";
    // Get the input values
    secret = DOM.secret.value;
    var secretHex = secrets.str2hex(secret);
    var total = parseFloat(DOM.total.value);
    required = parseFloat(DOM.required.value);
    if (weightedShard === "weighted") {
      total = total + (required - 1); // MSD needs to be allocated enough shards to unlock themselves. Need to have 'required' extra shards.
    } else {
      total = total;
    }

    // validate the input
    if (total < 2) {
      DOM.error.textContent = "Total Shards must be at least 1";
      return;
    } else if (total > 255) {
      DOM.error.textContent = "Total Shards must be at most 255";
      return;
    } else if (required < 2) {
      DOM.error.textContent = "Required Shards to open must be at least 1";
      return;
    } else if (required > 255) {
      DOM.error.textContent = "Required Shards to open must be at most 255";
      return;
    } else if (isNaN(total)) {
      DOM.error.textContent = "Invalid value for total number of Shards";
      return;
    } else if (isNaN(required)) {
      DOM.error.textContent = "Invalid value for required Shards to open";
      return;
    } else if (required > total) {
      DOM.error.textContent = "Required Shards to open must be less than total";
      return;
    } else if (secret.length == 0) {
      DOM.error.textContent = "Secret is blank";
      return;
    } else {
      DOM.error.textContent = "";
    }
    // Generate the parts to share
    var minPad = 1024; // see https://github.com/amper5and/secrets.js#note-on-security
    shares = secrets.share(secretHex, total, required, minPad);
    // Display the parts
    for (var w = 0; w < shares.length; w++) {
      share = shares[w];
      var li = document.createElement("li");
      li.classList.add("part");
      li.textContent = share;
      DOM.generated.appendChild(li);
    }
    DOM.distributesize.textContent = total;
    DOM.recreatesize.textContent = required;
  }

  function combineEmails() {
    // Clear old text
    DOM.combined.textContent = "";
    // Get the parts entered by the user
    emailsStr = DOM.emails.value;
    // Validate and sanitize the input
    emails = emailsStr.trim().split(/\s+/);

    // Display the combined emails
    DOM.combined.textContent = emailsStr;
  }

  init();
})();

/** email list for testing

moose1882+1@gmail.com
moose1882+2@gmail.com
moose1882+3@gmail.com
moose1882+4@gmail.com
moose1882+5@gmail.com
moose1882+6@gmail.com
moose1882+7@gmail.com
moose1882+8@gmail.com
moose1882+9@gmail.com
moose1882+10@gmail.com
moose1882+11@gmail.com
moose1882+12@gmail.com
moose1882+13@gmail.com
moose1882+14@gmail.com
moose1882+15@gmail.com
*/
