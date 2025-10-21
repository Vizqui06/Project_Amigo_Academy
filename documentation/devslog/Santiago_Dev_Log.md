# Date: 18/10/2025
# Project / Module: Back End. LocalHost transition

## Goals for today
- Run the page using Localhost:3000 instead of GoLive extension


## Task completed
- Created the server.js file to run the page via localhost. There are a few mistakes to fix, primarily the path to get the courses information


## Use of Gen AI
None needed

Propmt:


Result:

---

## What i learned
- We hadn't installed node express to the project yet
- We used the import method instead of the require.


## Challenges
- Because we used the import method instead of the require, we had to change the type module of the json files.


## Resources Used
- Time is a resource



## Personal Reflection
- We need to start imporoving our communication as a team


--------------------------------

# Date: 19/10/2025
# Project / Module: General File organization - related to Back End 

## Goals for today
- Fixing file and folder organization inside the project


## Task completed
- Created public, data, api and courses folders to re-organize the already existing files into a better structure for the server.js to work propertly.


## Use of Gen AI

Propmt:

I have an error trying to get the file(s) of this path 'api/courses/:id'. I believe this error is in the server.js. Could you help me find and if possible, correct this file? Take into account this is the project's current file and folder organization:

(+) Folder
(-) File

+ Project
    + Courses
		- (id.json files)
	+ Data
		- Courses.json
		+ CSS
    + Images
- index.html
- package.json
- package-lock.json

I skipped some "node_modules" or "documentation" files and folders as I believe they are irrelevant to this mistake

*Attached the code of server.js.


Result:

A txt file made of symbols (| - ) and few words, potraying how the folder and file organization should be for the proper working of the server paths

(Example)
(+) Folder
(-) File

+ Project
	+ API
		+ Courses
			- (id.json files)
	+ Data
		- Courses.json
	+ Public
		+ CSS
		+ Images
		- index.html
	- package.json
	- package-lock.json

---

## What i learned
- That the path in server.js was wrong. 
- The project needed a "public" folder

## Challenges
- Had to explain to the AI (ChatGPT). How were the files and folders in my project organized

## Resources Used
- Servre.js code


## Personal Reflection
- AI is kind and patient with me.
- I believe if we had settled this from the start. We could have saved lots of time and AI Usage.
