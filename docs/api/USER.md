# create_user
1. **Endpoint description**

> __create_user__ - method to add user to DB with _name_, _email_ and _pass_
>
> ***POST***
>
> ***/users/register***
2. **Request body**

> {
> "name": "string",
> "email": "string",
> "password": "string" | _len > 8 && spec symb necessary_
> }
3. **Test request**

> {
> "name": "Gantz",
> "email": "gantzzer@gmail.com",
> "password": "qwerty.1"
> }
4. **Response body**

> {
> "status": 200
> }

---

# get_users
1. **Endpoint description**

> __get_users__ - method to get users from DB by _list of ids_
>
> ***POST***
>
> ***/users/***
2. **Request body**

> {
> "id": \[0\]
> }
3. **Test request**

> {
> "id": \[1\]
> }
4. **Response body**
> {
> "status": 200,
> "users": \[{
> "name": "Gantz",
> "email": "gantzzer@gmail.com"
> }\]
> }

---

# delete_user
1. **Endpoint description**

> __delete_user__ - method to erase user from DB by _id_
>
> ***DELETE***
>
> ***/users/remove***
2. **Request body**

> {
> "user_id": 0
> }
3. **Test request**

> {
> "user_id": 1
> }
4. **Response body**

> {
> "status": 200 
> }

---

# update_user
1. **Endpoint description**

> __update_user__ - method to update user fields such as _name_, _email_ and _pass_
>
> ***PATCH***
>
> ***/users/edit***
2. **Request body**

> {
> "name": "string",
> "email": "string",
> "password": "string",  | those conditions are still effect
> "id": 0
> }
3. **Test request**

> {
> "name": "Gantz",
> "email": "gantzzer@gmail.com",
> "password": "qwerty.1"
> "id": 1
> }
4. **Response body**

> {
> "status": 200,
> "user": {
> "name": "Gantz",
> "email": "gantzzer@gmail.com"
> }
> }

---