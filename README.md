### add console.log build info to index.html

can log build info to console has Environment Build Date and version

version need you config

use:

  plugins:[

    new LogBuildInfo({version:'can require pacakge.json'})

  ]