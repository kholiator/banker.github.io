"use strict";

const account1 = {
  owner: "Akhil Kholia",
  movements: [200, 455, -306, 25000, -642, -133, 79, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2020-11-18T21:31:17.178Z",
    "2020-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2021-04-01T10:17:24.185Z",
    "2021-05-08T14:11:59.604Z",
    "2021-07-26T17:01:17.194Z",
    "2021-07-28T23:36:17.929Z",
    "2021-08-01T10:51:36.790Z",
  ],

};

const account2 = {
  owner: "Mohit Kang",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2021-01-25T14:18:46.235Z",
    "2021-02-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2021-06-25T18:49:59.371Z",
    "2021-07-26T12:01:20.894Z",
  ],
};
const account3 = {
  owner: "Abhishek Thakur",
  movements: [500, 3900, -1500, 790, 3330, -1000, 500, -30],
  interestRate: 1,
  pin: 3333,

  movementsDates: [
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2021-01-25T14:18:46.235Z",
    "2021-02-05T16:33:06.386Z",
    "2021-04-10T14:43:26.374Z",
    "2021-06-25T18:49:59.371Z",
    "2021-07-26T12:01:20.894Z",
  ],
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");


const formatMovementDate=function(date){
  const calculateDaysPassed=(date1,date2)=>Math.round(Math.abs(date1-date2)/(1000*60*60*24));
  
  const daysPassed=calculateDaysPassed(new Date(),date);
  if(daysPassed===0)return 'Today';
  if(daysPassed===1)return 'Yesterday';
  if(daysPassed<=7)return `${daysPassed} days ago`;
  else{
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    
    const displayDate=formatMovementDate(date);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${type} </div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">₹${mov.toFixed(2)}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (element) {
        //  return element.slice(0,1);
        return element[0];
      })
      .join("");
  });
};

createUsernames(accounts);
console.log(accounts);

const displayTotalBalance = function (acct) {
  const totalBalance = acct.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  acct.tbalance = totalBalance;

  labelBalance.textContent = `₹${totalBalance.toFixed(2)}`;
};

const calcDisplaySummary = function (acct) {
  const incomes = acct.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `₹${incomes.toFixed(2)}`;

  const out = Math.abs(
    acct.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `₹${out.toFixed(2)}`;

  const interest = acct.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acct.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `₹${+interest.toFixed(2)}`;
};
// calcDisplaySummary(account1.movements);

// const accountt=accounts.find(acc=>acc.owner==='Akhil Kholia');
// console.log(accountt);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //display balance
  //  displayTotalBalance(currentAccount.movements);
  displayTotalBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

let currentAccount,timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year} ${hours}:${min}`;

  
    if(timer) clearInterval(timer);
    timer=startLogOutTimer();
    updateUI(currentAccount);
  }
  //clear the input fields
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginPin.blur();
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  //find the taccount and ensure value is more than total amount in current
  const amount = Number(inputTransferAmount.value);
  const tacct = accounts.find((acc) => acc.userName === inputTransferTo.value);
  if (tacct === undefined) alert("Sorry!! No such account exist.");
  else {
    if (
      amount > 0 &&
      amount <= currentAccount.tbalance &&
      tacct.userName !== currentAccount.userName
    ) {
      //add as deposit into the taccount
      tacct.movements.push(amount);
      //deduct amount from current as withrawal
      currentAccount.movements.push(0 - amount);
      console.log(tacct);
      console.log(currentAccount);
      //update the ui of current
      // displayMovements(currentAccount.movements);
      // displayTotalBalance(currentAccount);
      // calcDisplaySummary(currentAccount);
      currentAccount.movementsDates.push(new Date().toISOString());
      tacct.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    } else {
      alert("Sorry,Transaction Failed!! ");
    }
  }
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputTransferAmount.blur();
  clearInterval(timer);
  timer=startLogOutTimer();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // confirm username and pin
  //  const ind =accounts.findIndex(acc=> acc.userName===inputCloseUsername.value && acc.pin===Number(inputClosePin.value));
  //  console.log(ind);
  //  accounts.splice(ind,1);

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const ind = accounts.findIndex((acc) => acc === currentAccount);
    console.log(ind);
    accounts.splice(ind, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
  inputClosePin.blur();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout( function(){currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    },3000);
  }
  else {
    alert("Sorry!! Loan cannot be processed");
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
  clearInterval(timer);
 timer= startLogOutTimer();

});
 
let toggleSort = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !toggleSort);
  toggleSort = !toggleSort;
  btnSort.blur();
});

const startLogOutTimer=function(){
  //call for 5 min timer
  let time=300;

  const tick=function(){
    const min=String(Math.trunc(time/60)).padStart(2,0);
    const sec=String((time%60)).padStart(2,0);
    labelTimer.textContent=`${min}:${sec}`;
    
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent='Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  }
  //call the timer every seconds
  //in each call.print remaining time in ui
  //log out after 5 min
  tick();
  const timer=setInterval(tick,1000);
  return timer;
}

/////////////////////////////////////////////////
