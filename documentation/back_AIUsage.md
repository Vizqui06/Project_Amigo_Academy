AI Usage Report: Academia del Amigo Project

This document outlines how our team used an AI assistant as a conceptual and technical advisor during the development of the "Academia del Amigo" backend, in compliance with the project's AI usage policy.

Overview of AI Assistance
 
Throughout this project, the AI has work as a tool primarily for debugging and fixing/correcting the paths of certain files, mainly in the server.js file and proving the proper organization to the 'api' and 'courses' .json files. 

The prompts we sent to the AI were, first of all, well structured. The prompts were mainly focused on the organization of folders and files (Because we had some problems with the proper organization of some files such as public, courses etc.) Besides, enough context of the file organization and desired functionality of certain (not all) files inside the project's folder.
As a good practice, when correcting, updating or fixing 'paths' in files. First we provided the AI with the main organization of files and folders of the project.

Some AI Prompt Examples are the following:



1.- Error in the server.js file

" I have an error trying to get the file(s) of this path 'api/courses/:id'. I believe this error is in the server.js file. Could you help me find and if possible, correct this file? Take into account this is the project's current file and folder organization:

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

I skipped some "node_modules" or "documentation" files and folders as I believe they are irrelevant to this mistake"
Then attached the "server.js" file or directly pasted the code or sections of the code.


2.- Optimization in the index.html file

Some context first:
When we started adding the courses/#.json files. Some of this information was already displayed in the index.html file, however it was displayed manually. When creating the route to the json files. AI suggested to change a section of the index.html file to display each of the courses by using a for each function that gathered information from the json files inside the courses folder. This change was implemented using AI. However most of the Text displayed was changed manually.


3.- Correct "Sign up with Google" implementation.

Some context first:
We already had a Client service on Google Cloud and the basic env vars on Render (the secrets were given by Google in a JSON file after created the client service).
When tested the function in local, it didn't worked, it send us to a blank page with an "cannot GET" error typed on the superior left corner & in the render page, 
the sign up function wasn't there. 

Now, AI helped us to manual redeploy, update env vars of Cloud, Render and our repo so finally avoid mismatching error, improve our CSS file to make a space on header
so the Sign Up button could fit, created a JS file to improve (not fixed yet) the contact form and helped us commenting everything on server.js so debbugging can be 
easier to do. After all these AI "helps", the localhost and Render pages still didn't work, so, reading real documentation, we founded the mistakes (silly ones) and finally get both pages working correctly. In fact, there were two main problems, unactualized URL in Render and Cloud and there was none emails put on Clients section
to test, this means no one could use the sign up function because no one was registered to test it to do so. Now we are eliminating all debug line codes given by AI. 