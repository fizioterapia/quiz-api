# Quiz API

My Quiz API written in Node using express library to create Quiz-like website in Vue.  
This **isn't meant to be used** right now, because it isn't completed.

# Callbacks

```
(GET) applicationAddress/start:
    returns JSON with quiz questions and id

(POST) applicationAddress/finish:
    returns JSON with the same informations as above but with correct answers to verify how much points/percentage you got

(GET) applicationAddress/question/:questionID
    returns JSON with question from ./files/questions.json.
```
