import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Apple, Banana, Cherry, Grape, Cat, Dog, Fish, Bird, Rabbit, 
  Sun, Moon, Star, Cloud, Flower, TreePine, Mountain, Waves,
  Circle, Square, Triangle, Pentagon, Hexagon, Diamond, Heart, Zap, Sparkles,
  Crown, Shield, Sword, Gem, Trophy, Medal, Flag, Target, Key, Lock, Gift,
  Volume2, VolumeX, HelpCircle, Lightbulb, RotateCcw, Shuffle, Pause, Play, Home, ArrowRight
} from 'lucide-react';

// 关卡配置
const LEVELS = [
  {
    id: 1,
    name: '新手村',
    theme: '水果派对',
    icons: [Apple, Banana, Cherry, Grape],
    colors: ['#ef4444', '#eab308', '#dc2626', '#9333ea'],
    rows: 6,
    cols: 6,
    pairsPerType: 3,
    timeLimit: 300,
    maxShuffles: 5,
    maxHints: 5,
    maxUndos: 10,
    timeBonus: 2
  },
  {
    id: 2,
    name: '动物乐园',
    theme: '可爱动物',
    icons: [Cat, Dog, Fish, Bird, Rabbit, Heart],
    colors: ['#f97316', '#eab308', '#3b82f6', '#06b6d4', '#ec4899', '#ef4444'],
    rows: 8,
    cols: 8,
    pairsPerType: 4,
    timeLimit: 180,
    maxShuffles: 4,
    maxHints: 4,
    maxUndos: 8,
    timeBonus: 1.5
  },
  {
    id: 3,
    name: '自然奇观',
    theme: '自然元素',
    icons: [Sun, Moon, Star, Cloud, Flower, TreePine, Mountain, Waves],
    colors: ['#eab308', '#6366f1', '#fbbf24', '#94a3b8', '#ec4899', '#22c55e', '#78716c', '#06b6d4'],
    rows: 10,
    cols: 10,
    pairsPerType: 4,
    timeLimit: 120,
    maxShuffles: 3,
    maxHints: 3,
    maxUndos: 6,
    timeBonus: 1
  },
  {
    id: 4,
    name: '几何迷阵',
    theme: '几何图形',
    icons: [Circle, Square, Triangle, Pentagon, Hexagon, Diamond, Heart, Zap, Sparkles, Star],
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#fbbf24'],
    rows: 12,
    cols: 12,
    pairsPerType: 4,
    timeLimit: 90,
    maxShuffles: 2,
    maxHints: 2,
    maxUndos: 4,
    timeBonus: 0.5
  },
  {
    id: 5,
    name: '终极挑战',
    theme: '混合符号',
    icons: [Crown, Shield, Sword, Gem, Trophy, Medal, Flag, Target, Key, Lock, Gift, Star],
    colors: ['#eab308', '#64748b', '#ef4444', '#06b6d4', '#f59e0b', '#eab308', '#dc2626', '#f97316', '#fbbf24', '#475569', '#ec4899', '#fbbf24'],
    rows: 14,
    cols: 14,
    pairsPerType: 4,
    timeLimit: 60,
    maxShuffles: 1,
    maxHints: 1,
    maxUndos: 2,
    timeBonus: 0.5
  }
];

// 音效系统
const useSound = () => {
  const audioContextRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch(type) {
        case 'click':
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'match':
          oscillator.frequency.value = 1200;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
        case 'remove':
          oscillator.frequency.value = 1500;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'error':
          oscillator.frequency.value = 200;
          oscillator.type = 'sawtooth';
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
        case 'shuffle':
          oscillator.frequency.value = 400;
          oscillator.type = 'triangle';
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'victory':
          [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            gain.gain.value = 0.1;
            osc.start(audioContext.currentTime + i * 0.15);
            osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
          });
          break;
        case 'defeat':
          [400, 300, 200].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.value = 0.1;
            osc.start(audioContext.currentTime + i * 0.2);
            osc.stop(audioContext.currentTime + i * 0.2 + 0.3);
          });
          break;
      }
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, [soundEnabled]);

  return { playSound, soundEnabled, setSoundEnabled };
};

// 路径查找算法
const findPath = (grid, pos1, pos2, rows, cols) => {
  if (pos1.row === pos2.row && pos1.col === pos2.col) return null;
  
  // 检查直线连接（0转弯）
  if (pos1.row === pos2.row) {
    const minCol = Math.min(pos1.col, pos2.col);
    const maxCol = Math.max(pos1.col, pos2.col);
    let clear = true;
    for (let c = minCol + 1; c < maxCol; c++) {
      if (grid[pos1.row][c] !== null) {
        clear = false;
        break;
      }
    }
    if (clear) return [[pos1.row, pos1.col], [pos2.row, pos2.col]];
  }
  
  if (pos1.col === pos2.col) {
    const minRow = Math.min(pos1.row, pos2.row);
    const maxRow = Math.max(pos1.row, pos2.row);
    let clear = true;
    for (let r = minRow + 1; r < maxRow; r++) {
      if (grid[r][pos1.col] !== null) {
        clear = false;
        break;
      }
    }
    if (clear) return [[pos1.row, pos1.col], [pos2.row, pos2.col]];
  }
  
  // 检查1次转弯（L形）
  // 拐点1：(pos1.row, pos2.col)
  if (grid[pos1.row][pos2.col] === null || (pos1.row === pos2.row && pos1.col === pos2.col)) {
    let path1Clear = true;
    const minCol = Math.min(pos1.col, pos2.col);
    const maxCol = Math.max(pos1.col, pos2.col);
    for (let c = minCol + 1; c < maxCol; c++) {
      if (grid[pos1.row][c] !== null) {
        path1Clear = false;
        break;
      }
    }
    
    let path2Clear = true;
    const minRow = Math.min(pos1.row, pos2.row);
    const maxRow = Math.max(pos1.row, pos2.row);
    for (let r = minRow + 1; r < maxRow; r++) {
      if (grid[r][pos2.col] !== null) {
        path2Clear = false;
        break;
      }
    }
    
    if (path1Clear && path2Clear) {
      return [[pos1.row, pos1.col], [pos1.row, pos2.col], [pos2.row, pos2.col]];
    }
  }
  
  // 拐点2：(pos2.row, pos1.col)
  if (grid[pos2.row][pos1.col] === null || (pos1.row === pos2.row && pos1.col === pos2.col)) {
    let path1Clear = true;
    const minRow = Math.min(pos1.row, pos2.row);
    const maxRow = Math.max(pos1.row, pos2.row);
    for (let r = minRow + 1; r < maxRow; r++) {
      if (grid[r][pos1.col] !== null) {
        path1Clear = false;
        break;
      }
    }
    
    let path2Clear = true;
    const minCol = Math.min(pos1.col, pos2.col);
    const maxCol = Math.max(pos1.col, pos2.col);
    for (let c = minCol + 1; c < maxCol; c++) {
      if (grid[pos2.row][c] !== null) {
        path2Clear = false;
        break;
      }
    }
    
    if (path1Clear && path2Clear) {
      return [[pos1.row, pos1.col], [pos2.row, pos1.col], [pos2.row, pos2.col]];
    }
  }
  
  // 检查2次转弯（Z/U形）
  // 横向扫描
  for (let row = -1; row <= rows; row++) {
    if (row >= 0 && row < rows && grid[row][pos1.col] !== null && row !== pos1.row) continue;
    if (row >= 0 && row < rows && grid[row][pos2.col] !== null && row !== pos2.row) continue;
    
    let path1Clear = true;
    if (row === -1 || row === rows) {
      const minRow = row === -1 ? 0 : pos1.row;
      const maxRow = row === -1 ? pos1.row : rows - 1;
      for (let r = minRow; r <= maxRow; r++) {
        if (grid[r][pos1.col] !== null && r !== pos1.row) {
          path1Clear = false;
          break;
        }
      }
    } else {
      const minRow = Math.min(pos1.row, row);
      const maxRow = Math.max(pos1.row, row);
      for (let r = minRow + 1; r < maxRow; r++) {
        if (grid[r][pos1.col] !== null) {
          path1Clear = false;
          break;
        }
      }
    }
    
    let path2Clear = true;
    const minCol = Math.min(pos1.col, pos2.col);
    const maxCol = Math.max(pos1.col, pos2.col);
    if (row >= 0 && row < rows) {
      for (let c = minCol + 1; c < maxCol; c++) {
        if (grid[row][c] !== null) {
          path2Clear = false;
          break;
        }
      }
    }
    
    let path3Clear = true;
    if (row === -1 || row === rows) {
      const minRow = row === -1 ? 0 : pos2.row;
      const maxRow = row === -1 ? pos2.row : rows - 1;
      for (let r = minRow; r <= maxRow; r++) {
        if (grid[r][pos2.col] !== null && r !== pos2.row) {
          path3Clear = false;
          break;
        }
      }
    } else {
      const minRow = Math.min(pos2.row, row);
      const maxRow = Math.max(pos2.row, row);
      for (let r = minRow + 1; r < maxRow; r++) {
        if (grid[r][pos2.col] !== null) {
          path3Clear = false;
          break;
        }
      }
    }
    
    if (path1Clear && path2Clear && path3Clear) {
      if (row === -1) {
        return [[pos1.row, pos1.col], [-0.5, pos1.col], [-0.5, pos2.col], [pos2.row, pos2.col]];
      } else if (row === rows) {
        return [[pos1.row, pos1.col], [rows - 0.5, pos1.col], [rows - 0.5, pos2.col], [pos2.row, pos2.col]];
      } else {
        return [[pos1.row, pos1.col], [row, pos1.col], [row, pos2.col], [pos2.row, pos2.col]];
      }
    }
  }
  
  // 纵向扫描
  for (let col = -1; col <= cols; col++) {
    if (col >= 0 && col < cols && grid[pos1.row][col] !== null && col !== pos1.col) continue;
    if (col >= 0 && col < cols && grid[pos2.row][col] !== null && col !== pos2.col) continue;
    
    let path1Clear = true;
    if (col === -1 || col === cols) {
      const minCol = col === -1 ? 0 : pos1.col;
      const maxCol = col === -1 ? pos1.col : cols - 1;
      for (let c = minCol; c <= maxCol; c++) {
        if (grid[pos1.row][c] !== null && c !== pos1.col) {
          path1Clear = false;
          break;
        }
      }
    } else {
      const minCol = Math.min(pos1.col, col);
      const maxCol = Math.max(pos1.col, col);
      for (let c = minCol + 1; c < maxCol; c++) {
        if (grid[pos1.row][c] !== null) {
          path1Clear = false;
          break;
        }
      }
    }
    
    let path2Clear = true;
    const minRow = Math.min(pos1.row, pos2.row);
    const maxRow = Math.max(pos1.row, pos2.row);
    if (col >= 0 && col < cols) {
      for (let r = minRow + 1; r < maxRow; r++) {
        if (grid[r][col] !== null) {
          path2Clear = false;
          break;
        }
      }
    }
    
    let path3Clear = true;
    if (col === -1 || col === cols) {
      const minCol = col === -1 ? 0 : pos2.col;
      const maxCol = col === -1 ? pos2.col : cols - 1;
      for (let c = minCol; c <= maxCol; c++) {
        if (grid[pos2.row][c] !== null && c !== pos2.col) {
          path3Clear = false;
          break;
        }
      }
    } else {
      const minCol = Math.min(pos2.col, col);
      const maxCol = Math.max(pos2.col, col);
      for (let c = minCol + 1; c < maxCol; c++) {
        if (grid[pos2.row][c] !== null) {
          path3Clear = false;
          break;
        }
      }
    }
    
    if (path1Clear && path2Clear && path3Clear) {
      if (col === -1) {
        return [[pos1.row, pos1.col], [pos1.row, -0.5], [pos2.row, -0.5], [pos2.row, pos2.col]];
      } else if (col === cols) {
        return [[pos1.row, pos1.col], [pos1.row, cols - 0.5], [pos2.row, cols - 0.5], [pos2.row, pos2.col]];
      } else {
        return [[pos1.row, pos1.col], [pos1.row, col], [pos2.row, col], [pos2.row, pos2.col]];
      }
    }
  }
  
  return null;
};

// 检查是否有解
const hasSolution = (grid, rows, cols) => {
  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== null) {
        positions.push({ row: r, col: c, type: grid[r][c] });
      }
    }
  }
  
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[i].type === positions[j].type) {
        const path = findPath(grid, 
          { row: positions[i].row, col: positions[i].col },
          { row: positions[j].row, col: positions[j].col },
          rows, cols
        );
        if (path) return { pos1: positions[i], pos2: positions[j], path };
      }
    }
  }
  return null;
};

// 游戏主组件
export default function LianLianKan() {
  const [screen, setScreen] = useState('start');
  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const { playSound, soundEnabled, setSoundEnabled } = useSound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      {screen === 'start' && (
        <StartScreen 
          onStart={() => setScreen('levelSelect')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      )}
      
      {screen === 'levelSelect' && (
        <LevelSelect 
          levels={LEVELS}
          unlockedLevels={unlockedLevels}
          onSelectLevel={(level) => {
            setCurrentLevel(level);
            setScreen('game');
          }}
          onBack={() => setScreen('start')}
        />
      )}
      
      {screen === 'game' && currentLevel && (
        <GameBoard 
          level={currentLevel}
          playSound={playSound}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onVictory={(score, timeUsed) => {
            if (!unlockedLevels.includes(currentLevel.id + 1) && currentLevel.id < LEVELS.length) {
              setUnlockedLevels([...unlockedLevels, currentLevel.id + 1]);
            }
            setScreen('victory');
          }}
          onDefeat={() => setScreen('defeat')}
          onBack={() => setScreen('levelSelect')}
        />
      )}
      
      {screen === 'victory' && (
        <VictoryScreen 
          level={currentLevel}
          onNext={() => {
            if (currentLevel.id < LEVELS.length) {
              setCurrentLevel(LEVELS[currentLevel.id]);
              setScreen('game');
            } else {
              setScreen('levelSelect');
            }
          }}
          onReplay={() => setScreen('game')}
          onBack={() => setScreen('levelSelect')}
        />
      )}
      
      {screen === 'defeat' && (
        <DefeatScreen 
          onRetry={() => setScreen('game')}
          onBack={() => setScreen('levelSelect')}
        />
      )}
    </div>
  );
}

// 开始界面
function StartScreen({ onStart, soundEnabled, onToggleSound }) {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-slate-700">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            连连看大冒险
          </h1>
          <p className="text-slate-400 mb-12">挑战你的观察力与策略</p>
          
          <div className="space-y-4">
            <button
              onClick={onStart}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
            >
              🎯 开始游戏
            </button>
            
            <button
              onClick={onToggleSound}
              className="w-full py-3 px-6 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <span>{soundEnabled ? '音效已开启' : '音效已关闭'}</span>
            </button>
            
            <div className="mt-8 p-6 bg-slate-900/50 rounded-xl text-left">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle size={20} className="text-blue-400" />
                <h3 className="font-semibold">游戏规则</h3>
              </div>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• 找出两个相同的图案并点击连接</li>
                <li>• 连接路径最多只能转弯2次</li>
                <li>• 在时间耗尽前消除所有方块</li>
                <li>• 使用提示、撤销和洗牌来帮助过关</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 关卡选择界面
function LevelSelect({ levels, unlockedLevels, onSelectLevel, onBack }) {
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold">选择关卡</h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all flex items-center gap-2"
        >
          <Home size={20} />
          返回
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          const Icon = level.icons[0];
          
          return (
            <button
              key={level.id}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              className={`p-6 rounded-2xl border-2 transition-all ${
                isUnlocked
                  ? 'bg-slate-800/50 border-slate-600 hover:border-blue-500 hover:scale-105 cursor-pointer'
                  : 'bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-5xl mb-4">
                {isUnlocked ? <Icon size={48} color={level.colors[0]} /> : '🔒'}
              </div>
              <h3 className="text-2xl font-bold mb-2">第{level.id}关</h3>
              <p className="text-lg text-blue-400 mb-1">{level.name}</p>
              <p className="text-sm text-slate-400 mb-4">{level.theme}</p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>⏱️ {level.timeLimit}秒</div>
                <div>🔄 洗牌{level.maxShuffles}次</div>
                <div>💡 提示{level.maxHints}次</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 游戏主界面
function GameBoard({ level, playSound, soundEnabled, onToggleSound, onVictory, onDefeat, onBack }) {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [shufflesLeft, setShufflesLeft] = useState(level.maxShuffles);
  const [hintsLeft, setHintsLeft] = useState(level.maxHints);
  const [undosLeft, setUndosLeft] = useState(level.maxUndos);
  const [undoStack, setUndoStack] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [path, setPath] = useState(null);
  const [hintPair, setHintPair] = useState(null);
  const [removingPairs, setRemovingPairs] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const timerRef = useRef(null);

  // 初始化网格
  useEffect(() => {
    initGrid();
  }, []);

  // 计时器
  useEffect(() => {
    if (isPaused) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          playSound('defeat');
          setTimeout(() => onDefeat(), 500);
          return 0;
        }
        if (prev <= 10 && prev % 2 === 0) {
          playSound('click');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const initGrid = () => {
    const newGrid = Array(level.rows).fill(null).map(() => Array(level.cols).fill(null));
    const tiles = [];
    
    // 生成配对的图案
    for (let i = 0; i < level.icons.length; i++) {
      for (let j = 0; j < level.pairsPerType * 2; j++) {
        tiles.push(i);
      }
    }
    
    // 随机打乱
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    // 填充网格
    let idx = 0;
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        if (idx < tiles.length) {
          newGrid[r][c] = tiles[idx++];
        }
      }
    }
    
    setGrid(newGrid);
    setSelected([]);
    setPath(null);
  };

  const handleTileClick = (row, col) => {
    if (isPaused || isShuffling || grid[row][col] === null) return;
    if (removingPairs.some(p => p.row === row && p.col === col)) return;
    
    playSound('click');
    
    if (selected.length === 0) {
      setSelected([{ row, col }]);
    } else if (selected.length === 1) {
      if (selected[0].row === row && selected[0].col === col) {
        setSelected([]);
        return;
      }
      
      if (grid[selected[0].row][selected[0].col] === grid[row][col]) {
        const foundPath = findPath(
          grid,
          { row: selected[0].row, col: selected[0].col },
          { row, col },
          level.rows,
          level.cols
        );
        
        if (foundPath) {
          playSound('match');
          setPath(foundPath);
          setSelected([selected[0], { row, col }]);
          
          setTimeout(() => {
            playSound('remove');
            
            const newGrid = grid.map(r => [...r]);
            newGrid[selected[0].row][selected[0].col] = null;
            newGrid[row][col] = null;
            
            // 保存到撤销栈
            setUndoStack(prev => [
              ...prev.slice(-9),
              {
                grid: grid.map(r => [...r]),
                score,
                pos1: selected[0],
                pos2: { row, col }
              }
            ]);
            
            setRemovingPairs([selected[0], { row, col }]);
            
            setTimeout(() => {
              setGrid(newGrid);
              setRemovingPairs([]);
              setSelected([]);
              setPath(null);
              
              // 计算得分
              const now = Date.now();
              const combo = now - lastMatchTime < 3000 ? 5 : 0;
              setScore(prev => prev + 10 + combo);
              setLastMatchTime(now);
              
              // 增加时间
              setTimeLeft(prev => Math.min(prev + level.timeBonus, level.timeLimit));
              
              // 检查是否胜利
              const hasRemaining = newGrid.some(r => r.some(c => c !== null));
              if (!hasRemaining) {
                playSound('victory');
                setTimeout(() => onVictory(score + 10 + combo, level.timeLimit - timeLeft), 500);
                return;
              }
              
              // 检查是否有解
              const solution = hasSolution(newGrid, level.rows, level.cols);
              if (!solution && shufflesLeft > 0) {
                setTimeout(() => autoShuffle(newGrid), 500);
              } else if (!solution && shufflesLeft === 0) {
                playSound('defeat');
                setTimeout(() => onDefeat(), 500);
              }
            }, 400);
          }, 300);
        } else {
          playSound('error');
          setSelected([{ row, col }]);
        }
      } else {
        setSelected([{ row, col }]);
      }
    }
  };

  const autoShuffle = (currentGrid) => {
    setIsShuffling(true);
    playSound('shuffle');
    
    const tiles = [];
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        if (currentGrid[r][c] !== null) {
          tiles.push(currentGrid[r][c]);
        }
      }
    }
    
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    setTimeout(() => {
      const newGrid = Array(level.rows).fill(null).map(() => Array(level.cols).fill(null));
      let idx = 0;
      
      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          if (currentGrid[r][c] !== null) {
            newGrid[r][c] = tiles[idx++];
          }
        }
      }
      
      setGrid(newGrid);
      setShufflesLeft(prev => prev - 1);
      setIsShuffling(false);
      setSelected([]);
      
      // 再次检查是否有解
      const solution = hasSolution(newGrid, level.rows, level.cols);
      if (!solution && shufflesLeft - 1 === 0) {
        playSound('defeat');
        setTimeout(() => onDefeat(), 500);
      }
    }, 800);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || hintPair) return;
    
    const solution = hasSolution(grid, level.rows, level.cols);
    if (solution) {
      playSound('click');
      setHintPair([solution.pos1, solution.pos2]);
      setScore(prev => Math.max(0, prev - 50));
      setHintsLeft(prev => prev - 1);
      
      setTimeout(() => {
        setHintPair(null);
      }, 3000);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || undosLeft <= 0) return;
    
    playSound('click');
    const lastState = undoStack[undoStack.length - 1];
    setGrid(lastState.grid);
    setScore(lastState.score - 20);
    setUndoStack(prev => prev.slice(0, -1));
    setUndosLeft(prev => prev - 1);
    setSelected([]);
    setPath(null);
  };

  const handleManualShuffle = () => {
    if (shufflesLeft <= 0 || isShuffling) return;
    
    setScore(prev => Math.max(0, prev - 100));
    autoShuffle(grid);
  };

  const tileSize = Math.min(60, Math.floor(Math.min(800 / level.cols, 600 / level.rows)));

  return (
    <div className="max-w-7xl mx-auto">
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
          >
            <Home size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">第{level.id}关 - {level.name}</h2>
            <p className="text-sm text-slate-400">{level.theme}</p>
          </div>
        </div>
        <button
          onClick={onToggleSound}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* 状态栏 */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
          <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
          <div className="text-3xl font-bold text-purple-400">
            💎 {score}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
          <div className="text-3xl font-bold text-green-400">
            🔄 {shufflesLeft}/{level.maxShuffles}
          </div>
        </div>
      </div>

      {/* 游戏网格 */}
      <div className="mb-6 flex justify-center">
        <div className="relative bg-slate-800/30 rounded-2xl p-4 border border-slate-700">
          <div 
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${level.cols}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${level.rows}, ${tileSize}px)`
            }}
          >
            {grid.map((row, r) => row.map((cell, c) => {
              if (cell === null) return <div key={`${r}-${c}`} />;
              
              const Icon = level.icons[cell];
              const color = level.colors[cell];
              const isSelected = selected.some(s => s.row === r && s.col === c);
              const isRemoving = removingPairs.some(p => p.row === r && p.col === c);
              const isHinted = hintPair && hintPair.some(h => h.row === r && h.col === c);
              
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleTileClick(r, c)}
                  className={`
                    rounded-lg transition-all duration-200
                    ${isRemoving ? 'scale-0 opacity-0 rotate-180' : 'scale-100'}
                    ${isSelected ? 'scale-110 ring-4 ring-blue-500' : 'hover:scale-105'}
                    ${isHinted ? 'ring-4 ring-yellow-500 animate-pulse' : ''}
                    ${isShuffling ? 'animate-spin' : ''}
                  `}
                  style={{
                    width: `${tileSize}px`,
                    height: `${tileSize}px`,
                    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                    boxShadow: isSelected ? '0 8px 16px rgba(59, 130, 246, 0.4)' : '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  <Icon size={tileSize * 0.6} color={color} strokeWidth={2} />
                </button>
              );
            }))}
          </div>

          {/* 连接线动画 */}
          {path && (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: `${level.cols * (tileSize + 4) + 32}px`,
                height: `${level.rows * (tileSize + 4) + 32}px`
              }}
            >
              <polyline
                points={path.map(([r, c]) => {
                  const x = 16 + c * (tileSize + 4) + tileSize / 2;
                  const y = 16 + r * (tileSize + 4) + tileSize / 2;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* 暂停遮罩 */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">⏸️</div>
                <div className="text-2xl font-bold">游戏已暂停</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={handleHint}
          disabled={hintsLeft <= 0 || hintPair}
          className="px-6 py-3 bg-yellow-600 rounded-xl hover:bg-yellow-700 disabled:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Lightbulb size={20} />
          提示 ({hintsLeft})
        </button>
        
        <button
          onClick={handleUndo}
          disabled={undoStack.length === 0 || undosLeft <= 0}
          className="px-6 py-3 bg-orange-600 rounded-xl hover:bg-orange-700 disabled:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <RotateCcw size={20} />
          撤销 ({undosLeft})
        </button>
        
        <button
          onClick={handleManualShuffle}
          disabled={shufflesLeft <= 0 || isShuffling}
          className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 disabled:bg-slate-700 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Shuffle size={20} />
          洗牌 ({shufflesLeft})
        </button>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          {isPaused ? '继续' : '暂停'}
        </button>
      </div>
    </div>
  );
}

// 胜利界面
function VictoryScreen({ level, onNext, onReplay, onBack }) {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-slate-700 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold mb-4 text-green-400">恭喜过关！</h2>
        <p className="text-xl text-slate-300 mb-8">完成第{level.id}关 - {level.name}</p>
        
        <div className="mb-8 text-5xl">
          ⭐⭐⭐
        </div>
        
        <div className="space-y-4">
          {level.id < LEVELS.length && (
            <button
              onClick={onNext}
              className="w-full py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              下一关 <ArrowRight size={20} />
            </button>
          )}
          
          <button
            onClick={onReplay}
            className="w-full py-4 px-8 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            重玩本关
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-3 px-6 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} />
            返回关卡选择
          </button>
        </div>
      </div>
    </div>
  );
}

// 失败界面
function DefeatScreen({ onRetry, onBack }) {
  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-slate-700 text-center">
        <div className="text-6xl mb-6">😢</div>
        <h2 className="text-4xl font-bold mb-4 text-red-400">游戏结束</h2>
        <p className="text-xl text-slate-300 mb-8">时间耗尽或无法继续</p>
        
        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            重试
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-3 px-6 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} />
            返回关卡选择
          </button>
        </div>
      </div>
    </div>
  );
}