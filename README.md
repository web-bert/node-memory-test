node-memory-test
================

Testing how node handles large JSON files in memory. The purpose of this is to generate JSON files with lots of items in them and test how node handles loading that into memory, and then see how long it takes to retrieve a random value from it.

Usage
=====

1) Edit the app.js file and change the LINES variable to the amount of lines you want to test

2) Run:
```javascript
node app
```

If the file does not exist, it will be created in the json folder.

3) To test the response of the server, curl the url (or hit it in your browser):
```bash
curl http://127.0.0.1:3000/
```

Hitting the URL will generate a random key and retrive it from the hash.

If you want to load test node, use apache bench and see what happens:
```bash
ab -n 1000 -c 100 http://127.0.0.1:3000/
```