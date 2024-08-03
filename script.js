(function () {
  // хелперы из lodash:
  const round = (number, precision = 0) => {
    // Если precision не указан, он будет равен 0 (по умолчанию).
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  const throttle = (func, wait) => {
    let lastCallTime = 0;
    let timeoutId;

    return function(...args) {
      const now = Date.now();
      const remainingTime = wait - (now - lastCallTime);

      if (remainingTime <= 0 || remainingTime > wait) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        lastCallTime = now;
        func.apply(this, args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          timeoutId = null;
          func.apply(this, args);
        }, remainingTime);
      }
    };
  }

  // логика
  const styleElement1 = document.createElement('style');
  const secretKnowledgeBlock = document.querySelector('.secret-knowledge-block');
  const selector = '.secret-knowledge-block .list';
  let ignoreMove = true;

  const mouseEnterHandler = () => {
    ignoreMove = false;
  }

  const mouseLeaveHandler = () => {
    ignoreMove = true;
    styleElement1.textContent = `${selector} {
      -webkit-clip-path: circle(0);
      clip-path: circle(0);
    }`;
  }

  const mouseMoveHandler = throttle(({ clientX, clientY }) => {
    const { top, left, width, height } = secretKnowledgeBlock.getBoundingClientRect();

    if (ignoreMove) {
      return;
    }

    const clipPathPropertyValue = `circle(150px at ${round(((clientX - left) / width) * 100, 2)}% ${round(
      ((clientY - top) / height) * 100,
      2
    )}%)`;

    styleElement1.textContent = `${selector} {
      -webkit-clip-path: ${clipPathPropertyValue};
      clip-path: ${clipPathPropertyValue};
    }`;
  }, 50);

  secretKnowledgeBlock.addEventListener('mouseenter', mouseEnterHandler, { passive: true });
  secretKnowledgeBlock.addEventListener('mouseleave', mouseLeaveHandler, { passive: true });
  secretKnowledgeBlock.addEventListener('mousemove', mouseMoveHandler, { passive: true });
  document.head.appendChild(styleElement1);
  mouseLeaveHandler();

  return () => {
    document.head.removeChild(styleElement1);
    secretKnowledgeBlock.removeEventListener('mousemove', mouseMoveHandler);
    secretKnowledgeBlock.removeEventListener('mouseleave', mouseLeaveHandler);
    secretKnowledgeBlock.removeEventListener('mouseenter', mouseEnterHandler);
  };
})();
