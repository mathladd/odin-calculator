


function getCalculator() {
    let currentDisplayText = '';
    let alreadyDecimal = false;
    let alreadyEval = false;
    let elementDisplay = document.querySelector('.calculator-display .display');
    let allButtons = Array.from(document.querySelectorAll('.button'));

    allButtons.map((button) => {
        if (button.firstElementChild.textContent === 'DEL') {
            button.addEventListener('click', delDisplay());
        } else if (button.firstElementChild.textContent === 'AC') {
            button.addEventListener('click', clearDisplay());
        } else if (button.firstElementChild.textContent === '=') {
            button.addEventListener('click', getResult());
        } else {
            button.addEventListener('click', getDisplay(button));
        }
    })


    function delDisplay() {
        return () => {
            currentDisplayText = currentDisplayText.split('');
            delText = currentDisplayText.pop();
            if (delText === '.') {
                alreadyDecimal = false;
            }
            if (delText === ' ') {   // Popping operators
                currentDisplayText.pop();
                currentDisplayText.pop();
            };
            currentDisplayText = currentDisplayText.join('')
            elementDisplay.textContent = currentDisplayText;
        };
    }

    function clearDisplay() {
        return () => {
            currentDisplayText = '';
            elementDisplay.textContent = currentDisplayText;
            alreadyEval = false;
            alreadyDecimal = false;
        };
    }

    function getDisplay(button) {
        return () => {
            let decimalButton = button.firstElementChild.textContent === '.';

            if (alreadyEval) {
                clearDisplay()();
            }

            if (Array.from(button.classList).includes('button-op')) {
                currentDisplayText += ` ${button.firstElementChild.textContent} `;
                alreadyDecimal ? alreadyDecimal = false : {};

            } else {
                alreadyDecimal && decimalButton ? {} : 
                currentDisplayText += `${button.firstElementChild.textContent}`;
                decimalButton ? alreadyDecimal = true : {};
            }
            elementDisplay.textContent = currentDisplayText;
        }
    }

    function getResult() {
        return () => {
            currentDisplayText = currentDisplayText.replace('(', '( ')
            currentDisplayText = currentDisplayText.replace(')', ' )')
            let evalEntitiesOriginal = currentDisplayText.split(' ');
            
            evalEntitiesOriginal.push(')');
            evalEntitiesOriginal.unshift('(');

            let evalEntities = addParen(evalEntitiesOriginal);
            elementDisplay.textContent = calculatorEval(evalEntities);

            alreadyEval = true;
        };
    }

    function addParen(b) {
        let a = [];
        let p = [];  // paren stack
        for (let i=0; i<b.length; i++) {
            if  (b[i] === 'x' || b[i] === '/') {
                a.splice(a.length-1, 0, '(');
                p.push(')');
            }
            if (isNaN(Number(b[i]))) {
                a.push(b[i]);
            } else {
                a.push(Number(b[i]));
                (p.length > 0) ? a.push(p.pop()) : {};
            }
        }

        for (let i=0; i<a.length; i++) {
            if  (a[i] === '+' || a[i] === '-') {
                a.splice(a.length-1, 0, '(');
                p.push(')');
            } else if (a[i] === ')' && p.length > 0) {
                a.push(p.pop());
            }
        }
        console.log(a);
        return a;
    }

    function calculatorEval(evalEntities) {
        let ops = [];
        let vals = [];
        for (let item of evalEntities) {
            if      (item === "(") {}
            else if (item === "+") {ops.push(item);}
            else if (item === "-") {ops.push(item);}
            else if (item === "x") {ops.push(item);}
            else if (item === "/") {ops.push(item);}
            else if (item === ")") {
                let op = ops.pop();
                let val = vals.pop();
                if      (op === "+") {val = add(vals.pop(), val);}
                else if (op === "-") {val = subtract(vals.pop(), val);}
                else if (op === "x") {val = multiply(vals.pop(), val);}
                else if (op === "/") {
                    if (val === 0) {
                        return 'DIVISION BY 0';
                    }
                    val = divide(vals.pop(), val);
                }
                vals.push(val);
            }
            else vals.push(item);
        }
        return Math.round(vals.pop() * 100000000000000)/100000000000000;  // round to nearest .00000000000000
    }

    function add(a, b) {
        return a + b;
    };
    
    function subtract(a, b) {
        return a - b;
    };

    function multiply(a, b) {
        return a * b;
    };
    
    function divide(a, b) {
        return a / b;
    };
}


// function getDisplay(button, currentDisplayText, elementDisplay) {
// }

// module.exports = {
//     add,
//     subtract,
//     sum,
//     multiply,
//     power,
//     factorial
// };


window.onload = () => {
    getCalculator();
  }
