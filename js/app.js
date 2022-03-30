


function getCalculator() {
    let currentDisplayText = ''
    let numOperators = 0;
    let elementDisplay = document.querySelector('.calculator-display .display')
    let allButtons = Array.from(document.querySelectorAll('.button'))
    let alreadyEval = false;

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
            if (currentDisplayText.pop() == ' ') {   // Popping operators
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
        };
    }

    function getDisplay(button) {
        return () => {
            if (alreadyEval) {
                clearDisplay()();
                alreadyEval = false;
            }

            if (Array.from(button.classList).includes('button-op')) {
                currentDisplayText += ` ${button.firstElementChild.textContent} `;
                numOperators += 1;
            } else {
                currentDisplayText += `${button.firstElementChild.textContent}`
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

            let evalEntities = addParen(evalEntitiesOriginal)();

            elementDisplay.textContent = calculatorEval(evalEntities);
            alreadyEval = true;
        };
    }

    function addParen(b) {
        return () => {
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
                    if (p.length > 0) {
                        a.push(p.pop());
                    }
                }
            }

            for (let i=0; i<a.length; i++) {
                if  (a[i] === '+' || a[i] === '-') {
                    a.splice(a.length-1, 0, '(');
                    p.push(')');
                }
                if (a[i] === ')' && p.length > 0) {
                    a.push(p.pop());
                }
            }
            console.log(a);
            return a;
        }
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
        return vals.pop();
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
