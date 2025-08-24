class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    handleButtonClick(button) {
        const action = button.getAttribute('data-action');
        const number = button.getAttribute('data-number');

        // Add button press animation
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 200);

        if (number) {
            this.appendNumber(number);
        } else if (action) {
            this.handleAction(action);
        }

        this.updateDisplay();
    }

    handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        } else if (e.key === '.') {
            this.appendNumber('.');
        } else if (e.key === '+') {
            this.chooseOperation('add');
        } else if (e.key === '-') {
            this.chooseOperation('subtract');
        } else if (e.key === '*') {
            this.chooseOperation('multiply');
        } else if (e.key === '/') {
            this.chooseOperation('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.compute();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.backspace();
        } else if (e.key === '%') {
            this.percentage();
        }

        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'percentage':
                this.percentage();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.chooseOperation(action);
                break;
            case 'equals':
                this.compute();
                break;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError("Cannot divide by zero");
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Add display animation
        const display = document.querySelector('.display');
        display.classList.add('updated');
        setTimeout(() => {
            display.classList.remove('updated');
        }, 300);

        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    backspace() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    showError(message) {
        const display = document.querySelector('.display');
        const currentOperandElement = document.getElementById('current-operand');
        
        // Save current state
        const originalValue = this.currentOperand;
        
        // Show error with animation
        display.classList.add('error');
        currentOperandElement.textContent = message;
        
        setTimeout(() => {
            display.classList.remove('error');
            this.currentOperand = originalValue;
            this.updateDisplay();
        }, 1500);
    }

    updateDisplay() {
        const previousOperandElement = document.getElementById('previous-operand');
        const currentOperandElement = document.getElementById('current-operand');

        if (this.operation != null) {
            let operationSymbol;
            switch (this.operation) {
                case 'add': operationSymbol = '+'; break;
                case 'subtract': operationSymbol = '-'; break;
                case 'multiply': operationSymbol = '×'; break;
                case 'divide': operationSymbol = '÷'; break;
            }
            previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            previousOperandElement.textContent = '';
        }

        currentOperandElement.textContent = this.formatNumber(this.currentOperand);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
