// Service Workerの登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed: ', error);
      });
  });
}

// 以下は電卓のロジック（変更なし）
document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let shouldResetDisplay = false;

    buttons.addEventListener('click', function(e) {
        if (!e.target.matches('.btn')) return;

        const value = e.target.dataset.value;
        const type = e.target.classList;

        if (type.contains('number')) {
            handleNumber(value);
        } else if (type.contains('operator')) {
            handleOperator(value);
        } else if (value === '=') {
            handleEqual();
        }
        updateDisplay();
    });

    function handleNumber(value) {
        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
        }
        if (value === '.' && currentInput.includes('.')) return;
        currentInput = currentInput === '0' && value !== '.' ? value : currentInput + value;
    }

    function handleOperator(value) {
        switch (value) {
            case 'clear':
                resetCalculator();
                break;
            case '%':
                currentInput = String(parseFloat(currentInput) / 100);
                break;
            case 'sign':
                currentInput = String(parseFloat(currentInput) * -1);
                break;
            default: // +, -, *, /
                if (operator && !shouldResetDisplay) {
                    handleEqual();
                }
                operator = value;
                previousInput = currentInput;
                shouldResetDisplay = true;
                break;
        }
    }

    function handleEqual() {
        if (!operator || previousInput === null) return;
        
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
        }
        
        currentInput = String(result);
        operator = null;
        previousInput = null;
        shouldResetDisplay = true;
    }

    function resetCalculator() {
        currentInput = '0';
        operator = null;
        previousInput = null;
        shouldResetDisplay = false;
    }

    function updateDisplay() {
        display.textContent = currentInput;
    }
});
