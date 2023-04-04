const calculator = document.querySelector('.calc');
const keys = document.querySelector('.calc-buttons');
const screen = document.querySelector('.screen');
const operatorKeys = keys.querySelectorAll('[data-type="operator"]');

keys.addEventListener('click', event => {
    if (!event.target.closest('button')) return;

    const key = event.target;
    const keyValue = key.textContent;
    const screenValue = screen.textContent;
    const {type} = key.dataset;
    const { previousKeyType } = calculator.dataset;

    // is this a number key?
    if (type === 'number') {
        if (screenValue === '0' && keyValue !== '.') {
            screen.textContent = keyValue;
        } else if (previousKeyType === 'operator')
        {
            screen.textContent = keyValue;
        } else if (keyValue === '.') {
            if (!screenValue.includes('.')) {
                screen.textContent = screenValue + keyValue;
            }
        } else {
            screen.textContent = screenValue + keyValue;
        }
    }

    // is this an operator key?
    if (type === 'operator') {
        operatorKeys.forEach(el => el.dataset.state = '');
        key.dataset.state = 'selected';

        calculator.dataset.firstNumber = screenValue;
        calculator.dataset.operator = key.dataset.key;
    }
    if (type === 'equal') {
        //perform calculation
        const firstNumber = calculator.dataset.firstNumber;
        const operator = calculator.dataset.operator;
        const secondNumber = screenValue;
        screen.textContent = calculate(firstNumber, operator, secondNumber);
        
    }
    if (type === 'clear') {
        screen.textContent = '0';
        delete calculator.dataset.firstNumber;
        delete calculator.dataset.operator;
    }
    if (type === 'backspace') {
        screen.textContent = screenValue.slice(0, -1);
    }

    calculator.dataset.previousKeyType = type;
})

function calculate (firstNumber, operator, secondNumber) {
    firstNumber = Number(firstNumber);
    secondNumber = Number(secondNumber);
    let result = '';
        if (operator === 'plus') result = firstNumber + secondNumber
        if (operator === 'minus') result = firstNumber - secondNumber
        if (operator === 'times') result = firstNumber * secondNumber
        if (operator === 'divide') result = firstNumber / secondNumber
    return result;
}

// ------------------------------
// TESTING
// ------------------------------
function clearCalculator () {
    // Press the clear key
    const clearKey = document.querySelector('[data-type="clear"]');
    clearKey.click();

    // Clear operator states
    operatorKeys.forEach(key => key.dataset.state = '')
}

function testClearKey () {
    clearCalculator();
    console.assert(screen.textContent === '0', 'Clear key. Screen should be 0');
    console.assert(!calculator.dataset.firstNumber, 'Clear key. No first number remains');
    console.assert(!calculator.dataset.operator, 'Clear key. No operator remains');
}

function testKeySequence (test) {

    // Press keys
    test.keys.forEach(key => {
        document.querySelector(`[data-key="${key}"]`).click();
    });

    // Assertion
    console.assert(screen.textContent === test.value, test.message);

    // Clear calculator
    clearCalculator();
    testClearKey();
}

const tests = [{
    keys: ['1'],
    value: '1',
    message: 'Clicked 1'
}, {
    keys: ['1', '5'],
    value: '15',
    message: 'Clicked 15'
}, {
    keys: ['1', '5', '9'],
    value: '159',
    message: 'Clicked 159'
}, {
    keys: ['2', '4', 'plus', '7', 'equal'],
    value: '31',
    message: 'Calculation with plus'
}, {
    keys: ['3', 'minus', '7', '0', 'equal'],
    value: '-67',
    message: 'Calculation with minus'
},
 {
    keys: ['1', '5', 'times', '9', 'equal'],
    value: '135',
    message: 'Calculation with times'
}, {
    keys: ['9', 'divide', '3', 'equal'],
    value: '3',
    message: 'Calculation with divide'
}, {
    keys: ['9', 'divide', '0', 'equal'],
    value: 'Infinity',
    message: 'Calculation. Divide by 0'
},
]

tests.forEach(testKeySequence);
