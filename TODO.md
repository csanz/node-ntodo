# TODOs

* Add ntodo badge to track number of TODOs
* Add file watcher 
* Generate TODO.md generator based on all TODOs
* Add wiston logging
* Add the ability to add ntodo configuration at root of projects .ntodo
* Add the ability to save all TODOs in local global area ~/.ntodo/ntodo.db.json and gen reports
* Add the ability to sync your ntodo.db.json with the cloud
* Add summary reports based cloud integration 
* Assign a todo to someone with cloud integration
* Add notification to developer who received assignment with summary and who assigned it inside the terminal
* Ingrate with Slack
* Add bdget support with number of TODOs
* Add date of when was the TODO was added to ntodo.db.json
* *Add date when todo was added to git
* Send link to TODO/FIXME author if line is older than X (configurable)
* Add the ability to open todo right from the terminal by typing in ntodo open (NUMBER), it will trigger sublime ./bin/app.js:180:0 create subl-ntodo for expanding subl with more ntodo commands. 
* create git-ntodo lib for running grep + ntodo command together with git
* create sublime error nodejs pluggin, when error happen, you can simple type err and it opens up the file inside sublime (set err env variable to sublime path name and line)
* create a history file, keep history of recent calls (fifo) this way you can just do ntodo (NUMBER) and run the same call/exec
* integrate with standard... so you pipe standard into notodo and add all the TODOs into the code. then use ntodo to load up sublime
* Save standard todos * STANDARD: so you can find them faster. or * TODO(STANDARD):  
* Create file watch for folder you keep all your projects and track all TODOs/FIXMes, new and removed in order to generate a progress report/graph