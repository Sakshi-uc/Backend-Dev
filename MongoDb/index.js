//syntax
//dif b/w bcrypt and crypto
//bcrypt is a library that provides a way to hash passwords and compare them securely. 
// It uses a strong hashing algorithm and includes a salt to protect against rainbow table attacks. 
// Bcrypt is designed to be slow, which makes it more resistant to brute-force attacks.

//why slow ?
//The reason bcrypt is designed to be slow is to increase the time it takes for an attacker to guess a password through brute-force attacks. 
//By making the hashing process slower, bcrypt makes it more difficult for attackers to try a large number of password combinations in a short amount of time. 
//This helps to protect against brute-force attacks, where an attacker tries to guess a password by systematically trying all possible combinations.

//crypto is a built-in module in Node.js that provides cryptographic functionality.
//It includes various algorithms for hashing, encryption, and decryption.
//While crypto can be used for hashing passwords, it does not include the same level of security features as bcrypt, such as salting and slow hashing.


const bcrypt=require('bcrypt');
const passward="12345678";
const hashPassword=await bcrypt.hash(passward,10);
console.log(hashPassword);

//login
const isMatch=await bcrypt.compare(passward,hashPassword);
console.log(isMatch);

