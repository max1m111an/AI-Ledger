# login
1. **Endpoint description**

> __login__ - method to login user by _enter data_ and _pass_
>
> ***POST***
>
> ***/login***
2. **Request body**

> {
> "enter_data": "login || email",
> "password": "string"
> }
3. **Test request**

> {
> "enter_data": "Gantz",
> "password": "qwerty.1"
> }

> {
> "enter_data": "gantzzer@gmail.com",
> "password": "qwerty.1"
> }
4. **Response body**

> {
> "status": 200 | int
> }

---
# logout
1. **Endpoint description**

> __logout__ - method to logout
>
> ***DELETE***
>
> ***/logout***
2. **Request body**

> \<empty\>
3. **Test request**

> \<empty\>
4. **Response body**

> {
> "status": 200 | int
> }

---
# hello
1. **Endpoint description**

> __hello__ - method to get current _username_
>
> ***GET***
>
> ***/me***
2. **Request body**

> \<empty\>
3. **Test request**

> \<empty\>
4. **Response body**

> {
> "user_data": "Gantz"
> }

---
# refresh
1. **Endpoint description**

> __refresh__ - method for refresh JWT
>
> ***POST***
>
> ***/token/refresh***
2. **Request body**

> \<empty\>
3. **Test request**

> \<empty\>
4. **Response body**

> {
> "status": 200 | int
> }

---