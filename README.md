## Shorty
Minimalistic url shortener written in Python3 using flask, MySQL and clipboard.js

You can paste, drag and type in (+ return) URLs to shorten them

__How it works__
_adding_
1. URL gets posted to /a
2. verify URL
3. add URL to database, get base 10 ID (insert id)
4. convert base 10 ID to base 62
5. convert base 62 ID to string ID using (alphabet) hashmap and return it

_accessing_
1. /{string_id} is opened
2. revert {string_id} using (alphabet) hashmap back to base 62 ID
3. revert base 62 ID back to base 10 ID
4. get record from database with base 10 ID
5. redirect to associated URL

__Setup__
1. make a copy of .env.example named .env
2. change variables in .env (they're self-explanatory)
3. create database, user and tables
4. run it like any other flask app

Database schema:
```
CREATE DATABASE urlshortener;
CREATE USER `mistershort`@`localhost` IDENTIFIED BY 'topsecret';
GRANT ALL ON urlshortener.* TO `mistershort`@`localhost`;
USE urlshortener;
CREATE TABLE urls(
	id iNT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	url VARCHAR(2000) NOT NULL
);
ALTER TABLE urls AUTO_INCREMENT=1;
```

Auto increment is offset by one because the first possible id 'a' is used as a POST endpoint (/a - shorthand for /add) for shortening urls