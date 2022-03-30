
function getCalculator() {
    let textReset = '';
    let textDisplay = textReset;
    let hasDecimal = false;
    let isEval = false;
    let elementDisplay = document.querySelector('.calculator-display .display');
    let elementAllButtons = Array.from(
        document.querySelectorAll('.button'));

    elementAllButtons.map((elementButton) => {
        elementButton.addEventListener(
            'click', getDisplay(elementButton));
    })


    /** display on the calculator when any buttons clicked
     * 
     * @returns none
     */
    function getDisplay(elementButton) {
        return () => {
            if (isEval) {
                textDisplay = clearDisplay()();
            }

            let textButton = elementButton
                            .firstElementChild.textContent;
            let checkDecimalButton = textButton === '.';

            switch(textButton) {
                case 'AC':
                    textDisplay = clearDisplay()();
                    break;
                case 'DEL':
                    textDisplay = delDisplay()();
                    break;
                case '=':
                    textDisplay = getResult()();
                    break;
                case '+':
                    textDisplay += getOperator(textButton);
                    break;
                case '-':
                    textDisplay += getOperator(textButton);
                    break;
                case 'x':
                    textDisplay += getOperator(textButton);
                    break;
                case '/':
                    textDisplay += getOperator(textButton);
                    break;
                default:
                    hasDecimal && checkDecimalButton ? 
                    {} : (textDisplay += `${textButton}`);
                    checkDecimalButton ? hasDecimal = true : {};
            }
            elementDisplay.textContent = textDisplay;
        }
    }


    /** delete the latest added op/val when user click "DEL"
     * 
     * @returns text to be displayed to user
     * with the op/val deleted
     */
    function delDisplay() {
        return () => {
            textDisplay = textDisplay.split('');
            delText = textDisplay.pop();
            if (delText === '.') {hasDecimal = false;}
            if (delText === ' ') {   // Popping operators
                textDisplay.pop();
                textDisplay.pop();
            };
            textDisplay = textDisplay.join('')
            return textDisplay;
        };
    }


    /** clear display when user click "AC"
     * 
     * @returns reset text to be displayed to user
     */
    function clearDisplay() {
        return () => {
            textDisplay = textReset;
            isEval = false;
            hasDecimal = false;
            return textDisplay;
        };
    }


    /** get result when user click "="
     * 
     * @returns text to be displayed to user
     */
    function getResult() {
        return () => {
            textDisplay = textDisplay
                    .replace('(', '( ')
                    .replace(')', ' )');
            let evalEntities = textDisplay.split(' ');

            evalEntities.unshift('(');
            evalEntities.push(')');
            console.log(evalEntities);

            textDisplay = dijkstraEval(
                addParen(evalEntities));
            isEval = true;

            return textDisplay;
        };
    }


    /** Get operator text to be added to user text displayed
     * when they click an operator button
     * 
     * @param {string} textButton raw button text
     * @returns operator text
     */
     function getOperator(textButton) {
        let textOperator = '';

        // check if text displayed is being led with an operator
        textDisplay === '' ? textOperator += '0' : {};

        textOperator += ` ${textButton} `;
        hasDecimal = false;
        return textOperator;
    }
    

    /** Add parentheses to array of ops and vals 
     * to be put into Dijkstra's algorithm
     * 
     * @param {Array} b Original array to add 
     * parentheses to
     * @returns new array a with parentheses added 
     * at mathematically correct locations
     */
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
                p.length > 0 ? a.push(p.pop()) : {};
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
        return a;
    }


    /** Dijkstra's algorithm implementation
     * 
     * @param {Array} a array of ops and vals
     * to be evaluated
     * @returns calculated result
     */
    function dijkstraEval(a) {
        let ops = [];
        let vals = [];
        for (let item of a) {
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
        return Math.round(vals.pop() * 100000000000000
        )/100000000000000;  // round to 
                            // nearest .00000000000000
    }

    /* Add 2 numbers and return the result */
    function add(a, b) {
        return a + b;
    };
    
    /* Subtract 2 numbers and return the result */
    function subtract(a, b) {
        return a - b;
    };

    /* Multiply 2 numbers and return the result */
    function multiply(a, b) {
        return a * b;
    };
    
    /* Divide 2 numbers and return the result */
    function divide(a, b) {
        return a / b;
    };
}


window.onload = () => {
    getCalculator();
  }
