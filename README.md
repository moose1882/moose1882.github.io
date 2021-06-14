# Welocme to my beta notes

Here is a bit of a what changes I made to get the beta data model working.

Overview

The app has an Index page that calls the app.js which contains the windows DOM functionality.

The data model was to contain:

- a unique indentifier
- a shard
- a name for the secret
- an email recipient

So I added a uuid generator function that generates a uuid based on page load time. refresh the page to start a new secret.

I created a new function to build the data model - called the shardShed - theShed().

This function is called with a button click on index.html. This is to componsate for the dynamic updating due to the activeListner. only after the secret and email textarea are completed would you envoke function theShed().

theShed() grabs two arrays that are populated off of the activeListner DOM controls. One is called parts, which holds all the shards generated and shardRcpt which holds the required emails. I add some data togther in the shardRcpt array so i do a bit of regex on the known seperator 'ZxxZ'.

Needed to split off the combine function into a seperate file, renaming the app.js to combine_app.js to ensure any mods I needed to do to app.js wouldn't effect the compbine function.
