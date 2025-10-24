# create_sub
1. **Endpoint description**

> __create_sub__ - method to add sub to DB with _name_, _price_ _period_ and _payday_
>
> ***POST***
>
> ***/subs/add***
2. **Request body**

> {
> "name": "string",
> "price": 0,
> "period": 0,
> "payday": "yyyy-mm-dd"
> }
3. **Test request**

> {
> "name": "Yandex",
> "price": 339,
> "period": 3,
> "payday": "2025-12-21"
> }
4. **Response body**

> {
> "status": 200,
> "sub": {
> "name": "Yandex",
> "price": 339,
> "period": 3,
> "payday": "2025-12-21"
> }
> }
---

# get_subs
1. **Endpoint description**

> __get_subs__ - method to get subs from DB by _list of ids_
>
> ***POST***
>
> ***/subs/***
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
> "subs": \[{
> "name": "Yandex",
> "price": 339,
> "period": 3,
> "payday": "2025-12-21"
> }\]
> }

---

# delete_subs
1. **Endpoint description**

> __delete_subs__ - method to erase sub from DB by _list of ids_
>
> ***DELETE***
>
> ***/subs/remove***
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
> "status": 200
> }

---

# update_sub
1. **Endpoint description**

> __update_sub__ - method to update sub fields such as _name_, _price_ _period_ and _payday_
>
> ***PATCH***
>
> ***/subs/edit***
2. **Request body**

> {
> "id": 0,
> "name": "string",
> "price": 0,
> "period": 0,
> "payday": "yyyy-mm-dd"
> }
3. **Test request**

> {
> "id": 1,
> "name": "Netflix",
> "price": 1399,
> "period": 6,
> "payday": "2025-12-21"
> }
4. **Response body**

> {
> "status": 200,
> "sub": {
> "id": 1,
> "name": "Netflix",
> "price": 1399,
> "period": 6,
> "payday": "2025-12-21"
> }
> }

---