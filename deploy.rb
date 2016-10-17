#!/usr/bin/env ruby
system "ember cordova:build --env=production"
system "ember cordova:open"