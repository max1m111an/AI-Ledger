> Pipeline documentation for effective communication between
> front and back programmers on the project.

1. **Endpoint description**

> __create_user__ - method to add user to DB by _name_, _email_ and _pass_
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
> "password": "qwerty12"
> }
4. **Response body**

> {
> "status": 200
> }

5. **Comms**

`unnecessary`
