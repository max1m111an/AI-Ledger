# create_paycheck
1. **Endpoint description**

> __create_paycheck__ - method to add paycheck to DB with _category_, _price_, _payment_form_, _store\_name_ and _paydate_
>
> ***POST***
>
> ***/paychecks/add***
2. **Request body**

> {
> "name": "string",
> "price": 0.0,
> "category": "enum",  (Cafe, Transfer, Transport, Utilities, Healthcare, Marketplace, Entertainment, Shop, Other)
> "pay_date": "1766238001"
> }
3. **Test request**

> {
> "name": "Burger King",
> "price": 159.9,
> "category": "Cafe",
> "pay_date": "1766238001"
> }
4. **Response body**

> {
> "status": 200,
> "paycheck": {
> "name": "Burger King",
> "price": 159.9,
> "category": "Cafe",
> "pay_date": "1766238001"
> }
> }
---

# get_paychecks
1. **Endpoint description**

> __get_paychecks__ - method to get paychecks from DB for current user
>
> ***GET***
>
> ***/paychecks/***
2. **Request body**

> \<empty\>
3. **Test request**

> \<empty\>
4. **Response body**
> {
> "status": 200,
> "paychecks": \[{
> "name": "Burger King",
> "price": 159.9
> "category": "Cafe",
> "pay_date": "1766238001"
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
> "name": "string",
> "price": 0.0,
> "category": "enum",
> "pay_date": "timestamp"
> }
3. **Test request**

> {
> "id": 1,
> "name": "Burger King",
> "price": 179.9,
> "category": "Cafe",
> "pay_date": "1766238001"
> }
4. **Response body**

> {
> "status": 200,
> "paycheck": {
> "id": 1,
> "name": "Tokyo city",
> "price": 269.9,
> "category": "Cafe",
> "pay_date": "1766238002"
> }
> }

---