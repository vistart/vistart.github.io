import React, { useState, useEffect } from 'react';

// 数独求解器（回溯算法）
const solveSudoku = (board) => {
  const newBoard = board.map(row => [...row]);
  
  const isValid = (row, col, num) => {
    // 检查行
    for (let x = 0; x < 9; x++) {
      if (newBoard[row][x] === num) return false;
    }
    // 检查列
    for (let x = 0; x < 9; x++) {
      if (newBoard[x][col] === num) return false;
    }
    // 检查3x3宫格
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (newBoard[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };
  
  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
              newBoard[row][col] = num;
              if (solve()) return true;
              newBoard[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  solve();
  return newBoard;
};

// 检查数独是否有效（有唯一解）
const isValidSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== 0) {
        const num = board[row][col];
        board[row][col] = 0;
        
        // 检查是否有效
        const isValid = (r, c, n) => {
          for (let x = 0; x < 9; x++) {
            if (x !== c && board[r][x] === n) return false;
            if (x !== r && board[x][c] === n) return false;
          }
          const startRow = Math.floor(r / 3) * 3;
          const startCol = Math.floor(c / 3) * 3;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const nr = startRow + i;
              const nc = startCol + j;
              if (nr !== r && nc !== c && board[nr][nc] === n) return false;
            }
          }
          return true;
        };
        
        if (!isValid(row, col, num)) {
          board[row][col] = num;
          return false;
        }
        board[row][col] = num;
      }
    }
  }
  return true;
};

// 生成完整的数独（使用随机数种子）
const generateFullSudoku = (seed) => {
  const board = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // 简单的伪随机数生成器
  let random = seed;
  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };
  
  const isValid = (row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };
  
  const fill = (row, col) => {
    if (row === 9) return true;
    if (col === 9) return fill(row + 1, 0);
    
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 使用种子随机打乱
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    for (const num of nums) {
      if (isValid(row, col, num)) {
        board[row][col] = num;
        if (fill(row, col + 1)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  };
  
  fill(0, 0);
  return board;
};

// 根据难度挖空
const createPuzzle = (fullBoard, difficulty, seed) => {
  const puzzle = fullBoard.map(row => [...row]);
  
  let cellsToRemove;
  if (difficulty === 1) cellsToRemove = 35; // 简易
  else if (difficulty === 2) cellsToRemove = 45; // 中等
  else cellsToRemove = 55; // 困难
  
  let random = seed;
  const nextRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };
  
  const positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  
  // 随机打乱位置
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // 挖空
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }
  
  return puzzle;
};

const SudokuGame = () => {
  const [puzzle, setPuzzle] = useState(null);
  const [userBoard, setUserBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [seedCode, setSeedCode] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [message, setMessage] = useState('');

  const generateGame = (difficulty) => {
    const randomValue = Math.floor(Math.random() * 1000000);
    const seed = difficulty * 1000000 + randomValue;
    const code = `${difficulty}${randomValue.toString().padStart(6, '0')}`;
    
    const fullBoard = generateFullSudoku(seed);
    const puzzleBoard = createPuzzle(fullBoard, difficulty, seed + 1);
    
    setPuzzle(puzzleBoard);
    setUserBoard(puzzleBoard.map(row => [...row]));
    setSolution(solveSudoku(puzzleBoard));
    setShowSolution(false);
    setSeedCode(code);
    setCustomMode(false);
    setMessage('');
  };

  const loadFromSeed = () => {
    if (seedCode.length !== 7) {
      setMessage('随机数格式错误！应为7位数字');
      return;
    }
    
    const difficulty = parseInt(seedCode[0]);
    if (difficulty < 1 || difficulty > 3) {
      setMessage('难度指标错误！应为1-3');
      return;
    }
    
    const randomValue = parseInt(seedCode.slice(1));
    const seed = difficulty * 1000000 + randomValue;
    
    const fullBoard = generateFullSudoku(seed);
    const puzzleBoard = createPuzzle(fullBoard, difficulty, seed + 1);
    
    setPuzzle(puzzleBoard);
    setUserBoard(puzzleBoard.map(row => [...row]));
    setSolution(solveSudoku(puzzleBoard));
    setShowSolution(false);
    setCustomMode(false);
    setMessage('成功加载数独！');
  };

  const loadCustomPuzzle = () => {
    try {
      const lines = customInput.trim().split('\n');
      if (lines.length !== 9) {
        setMessage('输入错误！应为9行');
        return;
      }
      
      const board = lines.map(line => {
        const nums = line.trim().split(/\s+/).map(n => parseInt(n) || 0);
        if (nums.length !== 9) {
          throw new Error('每行应有9个数字');
        }
        return nums;
      });
      
      if (!isValidSudoku(board)) {
        setMessage('数独局面不合法！存在冲突');
        return;
      }
      
      const solved = solveSudoku(board);
      const hasEmptyCells = board.some(row => row.includes(0));
      if (!hasEmptyCells) {
        setMessage('已是完整数独！');
      }
      
      setPuzzle(board);
      setUserBoard(board.map(row => [...row]));
      setSolution(solved);
      setShowSolution(false);
      setSeedCode('自定义');
      setCustomMode(false);
      setMessage('自定义数独加载成功！');
    } catch (err) {
      setMessage(`加载失败：${err.message}`);
    }
  };

  const handleCellChange = (row, col, value) => {
    if (puzzle[row][col] !== 0) return; // 初始数字不可修改
    
    const newBoard = userBoard.map(r => [...r]);
    const num = parseInt(value) || 0;
    newBoard[row][col] = num >= 0 && num <= 9 ? num : 0;
    setUserBoard(newBoard);
  };

  const checkSolution = () => {
    const isComplete = !userBoard.some(row => row.includes(0));
    if (!isComplete) {
      setMessage('还有空格未填！');
      return;
    }
    
    const isCorrect = JSON.stringify(userBoard) === JSON.stringify(solution);
    setMessage(isCorrect ? '🎉 恭喜！答案完全正确！' : '❌ 答案有误，请检查');
  };

  const reset = () => {
    if (puzzle) {
      setUserBoard(puzzle.map(row => [...row]));
      setShowSolution(false);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">数独游戏</h1>
        
        {/* 控制面板 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">选择难度：</h3>
              <div className="flex gap-2">
                <button onClick={() => generateGame(1)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                  简易
                </button>
                <button onClick={() => generateGame(2)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                  中等
                </button>
                <button onClick={() => generateGame(3)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  困难
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">当前随机数：</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seedCode}
                  onChange={(e) => setSeedCode(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="输入7位随机数"
                />
                <button onClick={loadFromSeed} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition">
                  加载
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <button 
              onClick={() => setCustomMode(!customMode)} 
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              {customMode ? '关闭' : '自定义局面'}
            </button>
          </div>
          
          {customMode && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2 text-gray-700">输入数独（0表示空格，每行9个数字，用空格分隔）：</h3>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full h-32 px-3 py-2 border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="例如：&#10;5 3 0 0 7 0 0 0 0&#10;6 0 0 1 9 5 0 0 0&#10;..."
              />
              <button onClick={loadCustomPuzzle} className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
                加载自定义
              </button>
            </div>
          )}
          
          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('成功') || message.includes('恭喜') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
          
          <div className="flex gap-2">
            <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
              重置
            </button>
            <button onClick={() => setShowSolution(!showSolution)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              {showSolution ? '隐藏' : '显示'}答案
            </button>
            <button onClick={checkSolution} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              检查答案
            </button>
          </div>
        </div>
        
        {/* 数独网格 */}
        {userBoard && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="inline-block border-4 border-gray-800">
              {userBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => {
                    const isInitial = puzzle[rowIndex][colIndex] !== 0;
                    const isCorrect = showSolution && solution && cell === solution[rowIndex][colIndex];
                    const isWrong = showSolution && solution && cell !== 0 && cell !== solution[rowIndex][colIndex];
                    const showAnswer = showSolution && cell === 0 && solution;
                    
                    return (
                      <input
                        key={colIndex}
                        type="text"
                        maxLength="1"
                        value={showAnswer ? solution[rowIndex][colIndex] : (cell === 0 ? '' : cell)}
                        onChange={(e) => !showAnswer && handleCellChange(rowIndex, colIndex, e.target.value)}
                        className={`w-12 h-12 text-center text-xl font-bold border
                          ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-gray-800' : 'border-r border-r-gray-300'}
                          ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-gray-800' : 'border-b border-b-gray-300'}
                          ${isInitial ? 'bg-gray-200 text-gray-900 cursor-not-allowed' : 'bg-white text-blue-600'}
                          ${isCorrect ? 'bg-green-100' : ''}
                          ${isWrong ? 'bg-red-100' : ''}
                          ${showAnswer ? 'bg-yellow-100 text-gray-500' : ''}
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
                        `}
                        readOnly={isInitial || showAnswer}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>提示：灰色数字为初始数字，蓝色数字为你填写的数字</p>
              {showSolution && <p className="text-yellow-600">黄色背景显示的是答案</p>}
            </div>
          </div>
        )}
        
        {!userBoard && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center text-gray-500">
            <p className="text-xl">请选择难度开始游戏，或加载自定义局面</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SudokuGame;