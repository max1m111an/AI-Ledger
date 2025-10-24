# create_paycheck
1. **Endpoint description**

> __create_paycheck__ - method to add paycheck to DB with _category_, _price_, _payment_form_, _store\_name_ and _paydate_
>
> ***POST***
>
> ***/paychecks/add***
2. **Request body**

> {
> "store_name": "string",
> "price": 0,
> "category": "enum",  (Cafe, Transfer, Transport, Utilities, Healthcare, Marketplace, Entertainment, Shop, Other)
> "payment_form": "enum",  (Cash, Non_cash)
> "paydate": "yyyy-mm-dd"
> }
3. **Test request**

> {
> "store_name": "Burger King",
> "price": 159,
> "category": "Cafe",
> "payment_form": "Cash",
> "paydate": "2025-10-24"
> }
4. **Response body**

> {
> "status": 200,
> "paycheck": {
> "store_name": "Burger King",
> "price": 159,
> "category": "Cafe",
> "payment_form": "Cash",
> "paydate": "2025-10-24"
> }
> }
---

# get_paychecks
1. **Endpoint description**

> __get_paychecks__ - method to get paychecks from DB by _list of ids_
>
> ***POST***
>
> ***/paychecks/***
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
> "paychecks": \[{
> "store_name": "Burger King",
> "price": 159,
> "category": "Cafe",
> "payment_form": "Cash",
> "paydate": "2025-10-24"
> }\]
> }

---

# delete_paychecks
1. **Endpoint description**

> __delete_paychecks__ - method to erase paycheck from DB by _list of ids_
>
> ***DELETE***
>
> ***/paychecks/remove***
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

# update_paycheck
1. **Endpoint description**

> __update_paycheck__ - method to update paycheck fields such as _category_, _price_, _payment_form_, _store\_name_ and _paydate_
>
> ***PATCH***
>
> ***/paychecks/edit***
2. **Request body**

> {
> "id": 0,
> "store_name": "string",
> "price": 0,
> "category": "enum",
> "payment_form": "enum",
> "paydate": "yyyy-mm-dd"
> }
3. **Test request**

> {
> "id": 1,
> "store_name": "Burger King",
> "price": 159,
> "category": "Cafe",
> "payment_form": "Cash",
> "paydate": "2025-10-24"
> }
4. **Response body**

> {
> "status": 200,
> "paycheck": {
> "id": 1,
> "store_name": "Tokyo city",
> "price": 269,
> "category": "Cafe",
> "payment_form": "Non_cash",
> "paydate": "2025-10-24"
> }
> }

---