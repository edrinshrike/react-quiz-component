import snarkdown from 'snarkdown';
import dompurify from 'dompurify';

export const rawMarkup = (data) => {
  const sanitizer = dompurify.sanitize;
  return { __html: snarkdown(sanitizer(data)) };
};

export const checkAnswer = (index, correctAnswer, answerSelectionType, answers, {
  userInput,
  userAttempt,
  currentQuestionIndex,
  continueTillCorrect,
  showNextQuestionButton,
  incorrect,
  correct,
  setButtons,
  setIsCorrect,
  setIncorrectAnswer,
  setCorrect,
  setIncorrect,
  setShowNextQuestionButton,
  setUserInput,
  setUserAttempt,
}) => {
  const indexStr = `${index}`;
  const disabledAll = Object.keys(answers).map(() => ({ disabled: true }));
  const userInputCopy = [...userInput];

  if (answerSelectionType === 'single') {
    if (userInputCopy[currentQuestionIndex] === undefined) {
      userInputCopy[currentQuestionIndex] = index;
    }

    if (indexStr === correctAnswer) {
      if (!incorrect.includes(currentQuestionIndex) && !correct.includes(currentQuestionIndex)) {
        correct.push(currentQuestionIndex);
      }

      setButtons(prevState => ({
        ...prevState,
        ...disabledAll,
        [index - 1]: {
          className: 'correct',
        },
      }));

      setIsCorrect(true);
      setIncorrectAnswer(false);
      setCorrect([...correct]);
      setShowNextQuestionButton(true);
    } else {
      if (!correct.includes(currentQuestionIndex) && !incorrect.includes(currentQuestionIndex)) {
        incorrect.push(currentQuestionIndex);
      }

      if (continueTillCorrect) {
        setButtons(prevState => ({
          ...prevState,
          [index - 1]: {
            disabled: true,
          },
        }));
      } else {
        setButtons(prevState => ({
          ...prevState,
          ...disabledAll,
          [index - 1]: {
            className: 'incorrect',
          },
        }));

        setShowNextQuestionButton(true);
      }

      setIncorrectAnswer(true);
      setIsCorrect(false);
      setIncorrect([...incorrect]);
    }
  } else {
    const maxNumberOfMultipleSelection = correctAnswer.length;

    if (userInputCopy[currentQuestionIndex] === undefined) {
      userInputCopy[currentQuestionIndex] = [];
    }

    const currentSelection = userInputCopy[currentQuestionIndex];
    if (currentSelection.length < maxNumberOfMultipleSelection) {
      currentSelection.push(index);

      if (correctAnswer.includes(index)) {
        setButtons(prevState => ({
          ...prevState,
          [index - 1]: {
            disabled: true,
            className: 'correct',
          },
        }));
      } else {
        setButtons(prevState => ({
          ...prevState,
          [index - 1]: {
            className: 'incorrect',
          },
        }));
      }
    }

    if (currentSelection.length === maxNumberOfMultipleSelection) {
      const isCorrectSelection = correctAnswer.every(ans => currentSelection.includes(ans));

      if (isCorrectSelection) {
        correct.push(currentQuestionIndex);
        setIsCorrect(true);
        setIncorrectAnswer(false);
        setCorrect([...correct]);
        setShowNextQuestionButton(true);
        setUserAttempt(1);
      } else {
        incorrect.push(currentQuestionIndex);
        setIncorrectAnswer(true);
        setIsCorrect(false);
        setIncorrect([...incorrect]);
        setShowNextQuestionButton(true);
        setUserAttempt(1);
      }
    } else {
      setUserAttempt(userAttempt + 1);
    }
  }

  setUserInput(userInputCopy);
};


export const selectAnswer = (index, correctAnswer, answerSelectionType, answers, {
  userInput,
  currentQuestionIndex,
  setButtons,
  setShowNextQuestionButton,
  incorrect,
  correct,
  setCorrect,
  setIncorrect,
  setUserInput,
}) => {
  const selectedButtons = Object.keys(answers).map(() => ({ selected: false }));
  const userInputCopy = [...userInput];
  if (answerSelectionType === 'single') {
    correctAnswer = Number(correctAnswer);
    userInputCopy[currentQuestionIndex] = index;

    if (index === correctAnswer) {
      if (correct.indexOf(currentQuestionIndex) < 0) {
        correct.push(currentQuestionIndex);
      }
      if (incorrect.indexOf(currentQuestionIndex) >= 0) {
        incorrect.splice(incorrect.indexOf(currentQuestionIndex), 1);
      }
    } else {
      if (incorrect.indexOf(currentQuestionIndex) < 0) {
        incorrect.push(currentQuestionIndex);
      }
      if (correct.indexOf(currentQuestionIndex) >= 0) {
        correct.splice(correct.indexOf(currentQuestionIndex), 1);
      }
    }
    setCorrect(correct);
    setIncorrect(incorrect);

    setButtons((prevState) => ({
      ...prevState,
      ...selectedButtons,
      [index - 1]: {
        className: 'selected',
      },
    }));

    setShowNextQuestionButton(true);
  } else {
    if (userInputCopy[currentQuestionIndex] === undefined) {
      userInputCopy[currentQuestionIndex] = [];
    }
    if (userInputCopy[currentQuestionIndex].includes(index)) {
      userInputCopy[currentQuestionIndex].splice(userInputCopy[currentQuestionIndex].indexOf(index), 1);
    } else {
      userInputCopy[currentQuestionIndex].push(index);
    }

    if (userInputCopy[currentQuestionIndex].length === correctAnswer.length) {
      let exactMatch = true;
      // eslint-disable-next-line no-restricted-syntax
      for (const input of userInput[currentQuestionIndex]) {
        if (!correctAnswer.includes(input)) {
          exactMatch = false;
          if (incorrect.indexOf(currentQuestionIndex) < 0) {
            incorrect.push(currentQuestionIndex);
          }
          if (correct.indexOf(currentQuestionIndex) >= 0) {
            correct.splice(correct.indexOf(currentQuestionIndex), 1);
          }
          break;
        }
      }
      if (exactMatch) {
        if (correct.indexOf(currentQuestionIndex) < 0) {
          correct.push(currentQuestionIndex);
        }
        if (incorrect.indexOf(currentQuestionIndex) >= 0) {
          incorrect.splice(incorrect.indexOf(currentQuestionIndex), 1);
        }
      }
    } else {
      if (incorrect.indexOf(currentQuestionIndex) < 0) {
        incorrect.push(currentQuestionIndex);
      }
      if (correct.indexOf(currentQuestionIndex) >= 0) {
        correct.splice(correct.indexOf(currentQuestionIndex), 1);
      }
    }
    setCorrect(correct);
    setIncorrect(incorrect);
    setButtons((prevState) => ({
      ...prevState,
      [index - 1]: {
        className: userInputCopy[currentQuestionIndex].includes(index) ? 'selected' : undefined,
      },
    }));

    if (userInputCopy[currentQuestionIndex].length > 0) {
      setShowNextQuestionButton(true);
    }
  }
  setUserInput(userInputCopy);
};
