#!/usr/bin/env ruby
system "ember cordova:build --env=production"
system "open ember-cordova/cordova/platforms/ios/build/device"