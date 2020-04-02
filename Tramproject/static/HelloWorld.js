//How to define variables?
// Using var(don't use) , const, let

//For example
let age = 20;
age = 32; //let can be changed
console.log(age);

const constant_age = 30;
//constant variables values cannot be changed
console.log(constant_age);


//Datatypes in Javascript
// String, Numbers, Boolean, null, undefined, Symbol
const rating = 2.0;
const name = "Anshuman";
console.log(`My name is ${name} and my rating is ${rating}`);

//Properties and methods
//Properties doesn't have paranthesis 
//while methods do have paranthesis.

console.log(name.toLowerCase());
console.log(name.length);

//Arrays - you can use any datatype in the same array.  
//Old way
const numbers = new Array(1, 2, 3, 4, 5);
//new way
const fruits = ['apples', 'oranges', 10, 20, true];

//Accessing 
fruits[1];

//changing 
fruits[1] = 'Peers';

//For adding one item at the end
fruits.push('mangoes');

//For adding at the beginning
fruits.unshift('strawberries');

//For removing the last item 
fruits.pop();

//For checking if it an array 
Array.isArray(fruits);

//For checkung index 
fruits.indexOf('oranges');

/*
object literals
*/

const person = {
    firstName: 'Anshuman',
    lastName: 'Sharma',
    hisAge: 30,
    hobbies: ['music', 'movies', 'sports'],
    address: {
        street: 'Morton Street',
        city: 'Pullman'
    }
}

//How to access? 
console.log(`My name is ${person.firstName} 
and my most favourite hobby is ${person.address.city}`)

//Adding a property 
person.email = 'anshuman1012@gmail.com'
console.log(person.email);

//New way of defining an object
const { firstName, lastName, address: { city } } = person;

//Adding objects to an array. 
const todos = [
    {
        id: 1,
        text: 'Take out trash',
        isCompleted: true
    },
    {
        id: 2,
        text: 'Meeting with the boss',
        isCompleted: false
    }
];

//JSON data/format
const todoJSON = JSON.stringify(todos);
console.log(todoJSON);

//Loops
//For loop
let a = 0
for (let i = 0; i < 10; i++) {
    a += 1;
}

//while loop
let i = 0;
while (i < 10) {
    i++;
}

//another for loop
for (let todo of todos) {
    console.log(todo);
}

//forEach, map, filter
todos.forEach(function (todo) {
    console.log(todo.text)
});