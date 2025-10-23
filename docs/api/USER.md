# create_user
1. **Endpoint description**

> __create_user__ - method to add user to DB with _name_, _email_ and _pass_
>
> ***POST***
>
> ***/register***
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
> "status": 200 | int
> }

---

# get_user
1. **Endpoint description**

> __get_user__ - method to get user from DB by id
>
> ***POST***
>
> ***/***
2. **Request body**

> {
> "id": int
> }
3. **Test request**

> {
> "id": 1
> }
4. **Response body**
> {
> "status": 200,
> "user":{
> "name": "ADMIN",
> "email": "maksimilianbegunov@inbox.ru"
> }
> }

---

# delete_user
1. **Endpoint description**

> __delete_user__ - method to erase user from DB by _id_
>
> ***DELETE***
>
> ***/remove***
2. **Request body**

> {
> "user_id": int
> }
3. **Test request**

> {
> "user_id": 1
> }
4. **Response body**

> {
> "status": 200 | int
> }

---

# update_user
1. **Endpoint description**

> __update_user__ - method to update user fields such as _name_, _email_ and _pass_
>
> ***PATCH***
>
> ***/edit***
2. **Request body**

> {
> "name": "string",
> "email": "string",
> "password": "string",  | those conditions are still effect
> "id": 0 | int
> }
3. **Test request**

> {
> "name": "Admin",
> "email": "maksimilianbegunov@inbox.ru",
> "password": "qwerty.1"
> "id": 1
> }
4. **Response body**

> {
> "status": 200,
> "user": {
> "name": "Admin",
> "email": "maksimilianbegunov@inbox.ru"
> }
> }

---