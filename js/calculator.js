class Calculator {
  constructor() {
    this.display = document.querySelector('.result');
    this.historyDisplay = document.querySelector('.history');
    this.historyList = document.querySelector('.history-list');
    this.memory = 0;
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetScreen = false;
    this.isRadians = false;
    this.lastResult = null;
    this.openParentheses = 0;
    this.expression = '';
    this.waitingForOperand = false;
    this.init();
  }

  init() {
    // Add event listeners to all calculator buttons
    document.querySelectorAll('.calculator button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleButton(button);
      });
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Add clear history button functionality
    const clearHistoryBtn = document.querySelector('.clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    // Initialize display
    this.updateDisplay();
    this.updateMemoryDisplay();
    this.updateModeButtons();
  }

  handleKeyboard(e) {
    const key = e.key;
    
    // Prevent default for calculator keys
    if (/[0-9+\-*/.=()%]/.test(key) || ['Enter', 'Backspace', 'Escape', 'Delete'].includes(key)) {
      e.preventDefault();
    }

    if (/[0-9.]/.test(key)) {
      this.handleNumber(key);
    } else if (['+', '-', '*', '/', '=', 'Enter'].includes(key)) {
      this.handleOperatorKey(key);
    } else if (key === 'Backspace' || key === 'Delete') {
      this.handleBackspace();
    } else if (key === 'Escape') {
      this.handleClear();
    } else if (key === '(') {
      this.handleOpenParen();
    } else if (key === ')') {
      this.handleCloseParen();
    } else if (key === '%') {
      this.handlePercent();
    }
    
    this.updateDisplay();
  }

  handleOperatorKey(key) {
    const operatorMap = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      '/': 'divide',
      '=': 'equals',
      'Enter': 'equals'
    };
    
    const action = operatorMap[key];
    if (action) {
      this[`handle${this.capitalize(action)}`]();
    }
  }

  handleButton(button) {
    const action = button.dataset.action;
    const value = button.dataset.value;

    // Add visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 100);

    try {
      if (value !== undefined) {
        this.handleNumber(value);
      } else if (action) {
        // Handle all possible actions
        switch(action) {
          case 'add':
          case 'subtract':
          case 'multiply':
          case 'divide':
            this.handleOperator(this.getOperatorSymbol(action));
            break;
          case 'equals':
            this.handleEquals();
            break;
          case 'clear':
            this.handleClear();
            break;
          case 'clearEntry':
            this.handleClearEntry();
            break;
          case 'backspace':
            this.handleBackspace();
            break;
          case 'sin':
          case 'cos':
          case 'tan':
          case 'asin':
          case 'acos':
          case 'atan':
            this[`handle${this.capitalize(action)}`]();
            break;
          case 'log':
          case 'ln':
            this[`handle${this.capitalize(action)}`]();
            break;
          case 'sqrt':
            this.handleSqrt();
            break;
          case 'power':
            this.handleOperator('^');
            break;
          case 'power2':
            this.handlePower2();
            break;
          case 'power3':
            this.handlePower3();
            break;
          case 'pi':
            this.handlePi();
            break;
          case 'e':
            this.handleE();
            break;
          case 'abs':
            this.handleAbs();
            break;
          case 'fact':
            this.handleFact();
            break;
          case 'exp':
            this.handleExp();
            break;
          case 'percent':
            this.handlePercent();
            break;
          case 'plusminus':
            this.handlePlusminus();
            break;
          case 'mc':
            this.handleMc();
            break;
          case 'mr':
            this.handleMr();
            break;
          case 'ms':
            this.handleMs();
            break;
          case 'm+':
            this.handleMPlus();
            break;
          case 'm-':
            this.handleMMinus();
            break;
          case 'mh':
            this.handleMh();
            break;
          case 'rad':
            this.handleRad();
            break;
          case 'deg':
            this.handleDeg();
            break;
          case 'openParen':
            this.handleOpenParen();
            break;
          case 'closeParen':
            this.handleCloseParen();
            break;
          default:
            console.warn('Unknown action:', action);
        }
      }
      this.updateDisplay();
    } catch (error) {
      console.error('Calculator error:', error);
      this.displayError('Error');
      this.updateDisplay();
    }
  }

  getOperatorSymbol(action) {
    const symbols = {
      'add': '+',
      'subtract': '−',
      'multiply': '×',
      'divide': '÷'
    };
    return symbols[action] || action;
  }

  handleNumber(number) {
    if (this.shouldResetScreen) {
      this.currentValue = number === '.' ? '0.' : number;
      this.shouldResetScreen = false;
    } else {
      // Prevent multiple decimal points
      if (number === '.' && this.currentValue.includes('.')) return;
      
      // Limit number length
      if (this.currentValue.replace(/[.-]/g, '').length >= 15) return;
      
      // Handle leading zero
      if (this.currentValue === '0' && number !== '.') {
        this.currentValue = number;
      } else {
        this.currentValue += number;
      }
    }
    this.waitingForOperand = false;
  }

  handleOperator(operator) {
    const inputValue = parseFloat(this.currentValue);

    if (this.previousValue === '') {
      this.previousValue = this.currentValue;
    } else if (this.operation && !this.waitingForOperand) {
      const result = this.calculate();
      if (result === null) return; // Error occurred
      
      this.currentValue = String(result);
      this.previousValue = this.currentValue;
    }

    this.waitingForOperand = true;
    this.operation = operator;
    this.shouldResetScreen = true;
  }

  handleEquals() {
    if (this.operation === null || this.waitingForOperand) {
      return;
    }

    const result = this.calculate();
    if (result === null) return; // Error occurred

    const calculation = `${this.previousValue} ${this.operation} ${this.currentValue} = ${result}`;
    this.addToHistory(calculation);

    this.currentValue = String(result);
    this.previousValue = '';
    this.operation = null;
    this.waitingForOperand = true;
    this.shouldResetScreen = true;
  }

  calculate() {
    const prev = this.parseValue(this.previousValue);
    const current = this.parseValue(this.currentValue);
    
    if (isNaN(prev) || isNaN(current)) {
      this.displayError('Invalid input');
      return null;
    }

    let result;

    try {
      switch (this.operation) {
        case '+':
          result = prev + current;
          break;
        case '−':
          result = prev - current;
          break;
        case '×':
          result = prev * current;
          break;
        case '÷':
          if (current === 0) {
            this.displayError('Cannot divide by zero');
            return null;
          }
          result = prev / current;
          break;
        case '^':
          result = Math.pow(prev, current);
          break;
        default:
          return null;
      }

      // Check for invalid results
      if (!isFinite(result)) {
        this.displayError('Result too large');
        return null;
      }

      return this.formatResult(result);
    } catch (error) {
      this.displayError('Calculation error');
      return null;
    }
  }

  // Trigonometric Functions
  handleSin() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    let angle = value;
    if (!this.isRadians) angle = this.degToRad(value);
    
    const result = Math.sin(angle);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`sin(${value}${this.isRadians ? ' rad' : '°'}) = ${this.currentValue}`);
  }

  handleCos() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    let angle = value;
    if (!this.isRadians) angle = this.degToRad(value);
    
    const result = Math.cos(angle);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`cos(${value}${this.isRadians ? ' rad' : '°'}) = ${this.currentValue}`);
  }

  handleTan() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    let angle = value;
    if (!this.isRadians) angle = this.degToRad(value);
    
    const result = Math.tan(angle);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`tan(${value}${this.isRadians ? ' rad' : '°'}) = ${this.currentValue}`);
  }

  handleAsin() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value) || value < -1 || value > 1) {
      this.displayError('Invalid input for asin');
      return;
    }
    
    const result = Math.asin(value);
    const finalResult = this.isRadians ? result : this.radToDeg(result);
    this.currentValue = String(this.formatResult(finalResult));
    this.shouldResetScreen = true;
    this.addToHistory(`asin(${value}) = ${this.currentValue}${this.isRadians ? ' rad' : '°'}`);
  }

  handleAcos() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value) || value < -1 || value > 1) {
      this.displayError('Invalid input for acos');
      return;
    }
    
    const result = Math.acos(value);
    const finalResult = this.isRadians ? result : this.radToDeg(result);
    this.currentValue = String(this.formatResult(finalResult));
    this.shouldResetScreen = true;
    this.addToHistory(`acos(${value}) = ${this.currentValue}${this.isRadians ? ' rad' : '°'}`);
  }

  handleAtan() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    const result = Math.atan(value);
    const finalResult = this.isRadians ? result : this.radToDeg(result);
    this.currentValue = String(this.formatResult(finalResult));
    this.shouldResetScreen = true;
    this.addToHistory(`atan(${value}) = ${this.currentValue}${this.isRadians ? ' rad' : '°'}`);
  }

  // Logarithmic Functions
  handleLog() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value) || value <= 0) {
      this.displayError('Invalid input for log');
      return;
    }
    
    const result = Math.log10(value);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`log(${value}) = ${this.currentValue}`);
  }

  handleLn() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value) || value <= 0) {
      this.displayError('Invalid input for ln');
      return;
    }
    
    const result = Math.log(value);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`ln(${value}) = ${this.currentValue}`);
  }

  // Power Functions
  handleSqrt() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value) || value < 0) {
      this.displayError('Invalid input for sqrt');
      return;
    }
    
    const result = Math.sqrt(value);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`√${value} = ${this.currentValue}`);
  }

  handlePower2() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    const result = value * value;
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`${value}² = ${this.currentValue}`);
  }

  handlePower3() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    const result = value * value * value;
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`${value}³ = ${this.currentValue}`);
  }

  handleExp() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    const result = Math.exp(value);
    if (!isFinite(result)) {
      this.displayError('Result too large');
      return;
    }
    
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`e^${value} = ${this.currentValue}`);
  }

  // Memory Functions
  handleMc() {
    this.memory = 0;
    this.updateMemoryDisplay();
    this.addToHistory('Memory cleared');
  }

  handleMr() {
    this.currentValue = String(this.formatResult(this.memory));
    this.shouldResetScreen = true;
    this.addToHistory(`Memory recall: ${this.currentValue}`);
  }

  handleMs() {
    this.memory = this.parseValue(this.currentValue);
    this.updateMemoryDisplay();
    this.addToHistory(`Memory store: ${this.currentValue}`);
  }

  handleMPlus() {
    this.memory += this.parseValue(this.currentValue);
    this.updateMemoryDisplay();
    this.addToHistory(`Memory add: ${this.currentValue}`);
  }

  handleMMinus() {
    this.memory -= this.parseValue(this.currentValue);
    this.updateMemoryDisplay();
    this.addToHistory(`Memory subtract: ${this.currentValue}`);
  }

  handleMh() {
    const temp = this.parseValue(this.currentValue);
    this.currentValue = String(this.formatResult(this.memory));
    this.memory = temp;
    this.updateMemoryDisplay();
    this.addToHistory('Memory exchange');
  }

  // Additional Functions
  handlePercent() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    const result = value / 100;
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`${value}% = ${this.currentValue}`);
  }

  handlePlusminus() {
    if (this.currentValue === '0' || this.currentValue === 'Error') return;
    
    if (this.currentValue.startsWith('-')) {
      this.currentValue = this.currentValue.slice(1);
    } else {
      this.currentValue = '-' + this.currentValue;
    }
  }

  handlePi() {
    this.currentValue = String(Math.PI);
    this.shouldResetScreen = true;
    this.addToHistory(`π = ${this.currentValue}`);
  }

  handleE() {
    this.currentValue = String(Math.E);
    this.shouldResetScreen = true;
    this.addToHistory(`e = ${this.currentValue}`);
  }

  handleAbs() {
    const value = this.parseValue(this.currentValue);
    if (isNaN(value)) {
      this.displayError('Invalid input');
      return;
    }
    
    const result = Math.abs(value);
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`|${value}| = ${this.currentValue}`);
  }

  handleFact() {
    const n = parseInt(this.currentValue);
    if (isNaN(n) || n < 0 || n > 170 || n !== parseFloat(this.currentValue)) {
      this.displayError('Invalid input for factorial');
      return;
    }
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    this.currentValue = String(this.formatResult(result));
    this.shouldResetScreen = true;
    this.addToHistory(`${n}! = ${this.currentValue}`);
  }

  // Angle mode functions
  handleRad() {
    this.isRadians = true;
    this.updateModeButtons();
    this.addToHistory('Switched to radians mode');
  }

  handleDeg() {
    this.isRadians = false;
    this.updateModeButtons();
    this.addToHistory('Switched to degrees mode');
  }

  updateModeButtons() {
    const radBtn = document.querySelector('[data-action="rad"]');
    const degBtn = document.querySelector('[data-action="deg"]');
    
    if (radBtn && degBtn) {
      if (this.isRadians) {
        radBtn.classList.add('active');
        degBtn.classList.remove('active');
      } else {
        degBtn.classList.add('active');
        radBtn.classList.remove('active');
      }
    }
  }

  // Parentheses functions
  handleOpenParen() {
    // This is a simplified implementation
    // For full expression parsing, a more complex system would be needed
    this.addToHistory('( - Open parenthesis');
  }

  handleCloseParen() {
    // This is a simplified implementation
    this.addToHistory(') - Close parenthesis');
  }

  // Clear Functions
  handleClear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetScreen = false;
    this.waitingForOperand = false;
    this.lastResult = null;
    this.openParentheses = 0;
    this.expression = '';
  }

  handleClearEntry() {
    this.currentValue = '0';
    this.shouldResetScreen = false;
  }

  handleBackspace() {
    if (this.currentValue === 'Error' || this.shouldResetScreen) {
      this.currentValue = '0';
      this.shouldResetScreen = false;
      return;
    }

    if (this.currentValue.length === 1 || 
       (this.currentValue.length === 2 && this.currentValue.startsWith('-'))) {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
  }

  // Utility Functions
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  radToDeg(radians) {
    return radians * (180 / Math.PI);
  }

  parseValue(value) {
    return parseFloat(value);
  }

  formatResult(number) {
    if (isNaN(number)) return 'Error';
    if (!isFinite(number)) return number > 0 ? 'Infinity' : '-Infinity';
    
    // Handle very large or very small numbers
    if (Math.abs(number) >= 1e15 || (Math.abs(number) <= 1e-10 && number !== 0)) {
      return parseFloat(number.toExponential(10));
    }
    
    // Round to avoid floating point precision issues
    const rounded = Math.round(number * 1e12) / 1e12;
    
    // Convert to string and limit decimal places
    let str = rounded.toString();
    if (str.includes('.')) {
      const parts = str.split('.');
      if (parts[1].length > 10) {
        str = rounded.toFixed(10);
        // Remove trailing zeros
        str = str.replace(/\.?0+$/, '');
      }
    }
    
    return parseFloat(str);
  }

  displayError(message) {
    this.currentValue = message;
    this.shouldResetScreen = true;
    this.waitingForOperand = false;
    this.operation = null;
    this.previousValue = '';
  }

  updateMemoryDisplay() {
    const memoryIndicator = document.querySelector('.memory-indicator');
    if (memoryIndicator) {
      memoryIndicator.style.display = this.memory !== 0 ? 'block' : 'none';
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  addToHistory(calculation) {
    if (!this.historyList) return;
    
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = calculation;
    item.style.cursor = 'pointer';
    
    // Add click handler to use result
    item.addEventListener('click', () => {
      const match = calculation.match(/= (.+)$/);
      if (match) {
        this.currentValue = match[1];
        this.shouldResetScreen = true;
        this.updateDisplay();
      }
    });
    
    this.historyList.prepend(item);
    
    // Limit history to 50 items
    const items = this.historyList.children;
    if (items.length > 50) {
      this.historyList.removeChild(items[items.length - 1]);
    }
  }

  clearHistory() {
    if (this.historyList) {
      this.historyList.innerHTML = '';
    }
  }

  updateDisplay() {
    if (this.display) {
      this.display.textContent = this.currentValue;
    }
    
    if (this.historyDisplay) {
      let historyText = '';
      
      if (this.operation && this.previousValue) {
        historyText = `${this.previousValue} ${this.operation}`;
      } else {
        historyText = this.isRadians ? 'RAD' : 'DEG';
      }
      
      this.historyDisplay.textContent = historyText;
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new Calculator();
    console.log('Calculator initialized successfully');
  } catch (error) {
    console.error('Failed to initialize calculator:', error);
  }
}); 