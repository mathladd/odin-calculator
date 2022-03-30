
function getCalculator() {
    let textReset = '';
    let textEquation = textReset;
    let textResult = textReset;
    let hasDecimal = false;
    let isEval = false;
    let numCharEquation = 15;
    let numCharRet = 9;
    let elementEquationDisplay = document.querySelector('.equation-display');
    let elementResultDisplay = document.querySelector('.result-display');
    let elementAllButtons = Array.from(
        document.querySelectorAll('.button'));

    elementAllButtons.map((elementButton) => {
        elementButton.addEventListener(
            'click', getDisplay(elementButton));
    })

    addKeyboardSupport();


    /** add keyboard support to calculator through 
     *window.addEventListener
     *
     * @returns none
     */
    function addKeyboardSupport() {
        window.addEventListener('keydown', (e) => {
            let objKey = {
                '1': '1', '2': '2', '3': '3', 
                '4': '4', '5': '5', '6': '6', 
                '7': '7', '8': '8', '9': '9', 
                '0': '0', '.': '.', 'Backspace': 'DEL', 
                'Escape': 'AC', 'Enter': '=', 
                '+': '+', '-': '-', 'x': 'x', '/': '/'
            }
            for (let key in objKey) {
                if (e.key === key) {
                    elementAllButtons.find((element) => element.firstElementChild.textContent === objKey[key]).click();
                }                
            }
        });
    }


    /** display on the calculator when any buttons clicked
     * 
     * @returns none
     */
    function getDisplay(elementButton) {
        return () => {
            if (isEval) {
                textEquation = getClearDisplay()();
                elementResultDisplay.textContent = textEquation;
            }

            let textButton = elementButton
                            .firstElementChild.textContent;
            let checkDecimalButton = textButton === '.';

            switch(textButton) {
                case 'AC':
                    textEquation = getClearDisplay()();
                    elementResultDisplay.textContent = textEquation;
                    break;
                case 'DEL':
                    textEquation = getDelDisplay()();
                    break;
                case '=':
                    textResult = getResult()();
                    elementResultDisplay.textContent = textResult;
                    break;
                case '+':
                    textEquation += getOperator(textButton);
                    break;
                case '-':
                    textEquation += getOperator(textButton);
                    break;
                case 'x':
                    textEquation += getOperator(textButton);
                    break;
                case '/':
                    textEquation += getOperator(textButton);
                    break;
                default:
                    hasDecimal && checkDecimalButton ? 
                    {} : (textEquation += `${textButton}`);
                    checkDecimalButton ? hasDecimal = true : {};
            }
            let textEquationLength = textEquation.toString().length;
            let textEquationShow = textEquation.slice(Math.max(textEquationLength - numCharEquation, 0), textEquationLength);
            elementEquationDisplay.textContent = textEquationShow;
        }
    }


    /** delete the latest added op/val when user click "DEL"
     * 
     * @returns text to be displayed to user
     * with the op/val deleted
     */
    function getDelDisplay() {
        return () => {
            textEquation = textEquation.split('');
            delText = textEquation.pop();
            if (delText === '.') {hasDecimal = false;}
            if (delText === ' ') {   // Popping operators
                textEquation.pop();
                textEquation.pop();
            };
            textEquation = textEquation.join('')
            return textEquation;
        };
    }


    /** clear display when user click "AC"
     * 
     * @returns reset text to be displayed to user
     */
    function getClearDisplay() {
        return () => {
            textEquation = textReset;
            isEval = false;
            hasDecimal = false;
            return textEquation;
        };
    }


    /** get result when user click "="
     * 
     * @returns text to be displayed to user
     */
    function getResult() {
        return () => {
            textResult = textEquation
                    .replace('(', '( ')
                    .replace(')', ' )');
            let evalEntities = textResult.split(' ');

            evalEntities.unshift('(');
            evalEntities.push(')');

            textResult = dijkstraEval(
                addParen(evalEntities));
            isEval = true;

            return textResult;
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
        textEquation === '' ? textOperator += '0' : {};

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
                        return 'DIV BY 0';
                    }
                    val = divide(vals.pop(), val);
                }
                vals.push(val);
            }
            else vals.push(item);
        }
        ret = vals.pop();
        if (ret.toString().length > numCharRet) {
            ret = ret.toExponential(5);
        }
        return ret;  
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
