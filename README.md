
Collaboration Tool: For delivering presentations online 
========================================================

URL: http://ec2-52-35-156-118.us-west-2.compute.amazonaws.com:8080/collabrationTool/
===

Built on :
==========
Java Server Faces, Web Socket, HTML5 Canvas and WebRTC

How to use tool:
================
1. User can create or join a meeting 
2. User who creates a meeting can upload a ppt file and use the file for delivering presentation 
3. Users who joined the meeting will be able to see the contents of presentation (will see live changes made by user)
4. All users involved in the meeting can participate in chat.

Things I am currently working on:
==================================
To build scalable one to many video streaming using HTML5 WebRTC where the stream of person delivering presentation is sent to all other users 

Implementation Details:
========================
1. Java Server Faces 2.2 is used primarily for web application.
2. Apache POI api is used for converting ppt files into images and display.
3. Web Sockets is used for sending chat messages and user (one delivering presentation) mouse events.
4. HTML5 canvas element is used to write on top of presentation and all those edits are shown to other users by sending mouse event data through web socket.
