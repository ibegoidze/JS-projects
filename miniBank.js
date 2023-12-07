'use strict';

const account1 = {
  owner: 'Irakli R A K L I',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2013-11-10T21:31:17.178Z',
    '2013-11-10T07:42:02.383Z',
    '2023-11-12T09:15:04.904Z',
    '2023-11-20T10:17:24.185Z',
    '2023-11-25T14:11:59.604Z',
    '2023-12-01T17:01:17.194Z',
    '2023-12-02T23:36:17.929Z',
    '2023-12-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Guest U E S T',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.Welcome');
const labelDate = document.querySelector('.Date');
const labelBalance = document.querySelector('.BalanceValue');
const labelSumIn = document.querySelector('.SummaryValueIn');
const labelSumOut = document.querySelector('.SummaryValueOut');
const labelSumInterest = document.querySelector('.SummaryValueInterest');
const labelTimer = document.querySelector('.Timer');

const containerApp = document.querySelector('.App');
const containerMovements = document.querySelector('.Movements');

const btnLogin = document.querySelector('.LoginBtn');
const btnTransfer = document.querySelector('.FormBtnTransfer');
const btnLoan = document.querySelector('.FormBtnLoan');
const btnClose = document.querySelector('.FormBtnClose');
const btnSort = document.querySelector('.BtnSort');

const inputLoginUsername = document.querySelector('.LoginInputUser');
const inputLoginPin = document.querySelector('.LoginInputPin');
const inputTransferTo = document.querySelector('.FormInputTo');
const inputTransferAmount = document.querySelector('.FormInputAmount');
const inputLoanAmount = document.querySelector('.FormInputLoanAmount');
const inputCloseUsername = document.querySelector('.FormInputUser');
const inputClosePin = document.querySelector('.FormInputPin');

////////////////////
const navigatorElement = document.querySelector('.navigator');
const appElement = document.querySelector('.App');
const welcomeText = document.querySelector('.Welcome');
///////////////////
// Determine the initial height of the navigator
const initialNavigatorHeight = navigatorElement.offsetHeight;
///////////////////
// Define a function to adjust the navigator height
function adjustNavigatorHeight(isLoggedIn) {
  if (isLoggedIn) {
    navigatorElement.style.height = initialNavigatorHeight + 'px';
    navigatorElement.style.backgroundColor = '#f3f3f3';
    navigatorElement.style.marginTop = '0';
    navigatorElement.style.flexDirection = 'row';
    navigatorElement.style.justifyContent = 'space-between';
    imgElement.remove()
    welcomeText.style.backgroundColor = '#f3f3f3'
  } else {
    navigatorElement.style.height = '80vh';
    appElement.style.opacity = 0;
    navigatorElement.style.flexDirection = 'column';
    navigatorElement.style.justifyContent = 'center';
    navigatorElement.style.backgroundColor = '#5ec576';
    navigatorElement.style.marginTop = '40px';
    navigatorElement.style.borderRadius = '0.7rem';
    welcomeText.textContent =
      'Welcome to miniBank, to enter plese type: irakli 1111 or guest 1111';
    welcomeText.style.fontSize = '30px';
    welcomeText.style.marginBottom = '30px';
    welcomeText.style.backgroundColor = '#fddb53'
    welcomeText.style.padding = '55px';
    welcomeText.style.borderRadius = '0.7rem';
    navigatorElement.appendChild(imgElement)
    imgElement.style.marginTop = '50px'
    imgElement.style.width = 'auto'
    imgElement.style.width = '100%'
  }
}
///////////////////
var imgElement = document.querySelector('img');
if (imgElement) {
  // Remove the img element
  imgElement.remove();
}
// Formating transfer dates
const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Formating currencies
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Displaying transfers
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
       <div class="MovementsRow">
          <div class="MovementsType MovementsType${type}">${i + 1} ${type}</div>
          <div class="MovementsDate">${displayDate}</div>
          <div class="MovementsValue">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display main total outgoing and interest balance
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Taking first symbols of usernames
const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = acc => {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// Logout timer
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Login
let currentAccount, timer;
if (btnLogin) {
  btnLogin.addEventListener('click', e => {
    e.preventDefault();
    currentAccount = accounts.find(
      acc => acc.username === inputLoginUsername.value
    );
    if (currentAccount?.pin === +inputLoginPin.value) {
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 100;
      const now = new Date();
      const options = {
        hour: 'numeric',
        minutes: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      };
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
      if (timer) clearInterval(timer);
      timer = startLogOutTimer();
      updateUI(currentAccount);
      /////////////////////
      adjustNavigatorHeight(true); // Set isLoggedIn to true
      appElement.style.opacity = 1; // Show app content
      /////////////////////
    }
  });
}
adjustNavigatorHeight(false);

if (btnTransfer) {
  btnTransfer.addEventListener('click', e => {
    e.preventDefault();
    const amount = +inputTransferAmount.value;
    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = 0;
    if (
      amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username
    ) {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }
  });
}

if (btnLoan) {
  btnLoan.addEventListener('click', e => {
    e.preventDefault();
    const amount = Math.floor(+inputLoanAmount.value);
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount / 10)
    ) {
      setTimeout(function () {
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
        clearInterval(timer);
        timer = startLogOutTimer();
      }, 2500);
    }
    inputLoanAmount.value = '';
  });
}

if (btnClose) {
  btnClose.addEventListener('click', e => {
    e.preventDefault();
    if (
      inputCloseUsername.value === currentAccount.username &&
      +inputClosePin.value === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
  });
}

let sorted = false;
if (btnSort) {
  btnSort.addEventListener('click', e => {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
  });
}

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
