const gameContainer = document.getElementById('gameContainer');
const playerBall = document.getElementById('playerBall');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const messageDiv = document.getElementById('message');

let gameStarted = false;
let playerPosition = { x: 50, y: 50 };
let ballSpeed = 5;
let keysCollected = 0;
let gameOver = false;
let guardiansLoaded = false;

let locations = [];
let guardians = [];

// 存储玩家信息
function savePlayerInfo(playerId, nickname, gameHistory) {
  const playerInfo = JSON.stringify({ playerId, nickname, gameHistory });
  localStorage.setItem('playerInfo', playerInfo);
}

// 加载玩家信息
function loadPlayerInfo() {
  const playerInfo = localStorage.getItem('playerInfo');
  if (playerInfo) {
    return JSON.parse(playerInfo);
  }
  return null;
}

// 渲染游戏状态
function render() {
  playerBall.style.left = `${playerPosition.x}px`;
  playerBall.style.top = `${playerPosition.y}px`;

  // 获取所有.mapObject元素
  const mapObjects = document.querySelectorAll('.mapObject');
  mapObjects.forEach(el => {
    const locationType = el.className.split(' ')[1]; // 获取额外的类（L、S、B）
    const location = locations.find(loc => loc.type === locationType);
    if (location && Math.abs(playerPosition.x - location.x) < 20 && Math.abs(playerPosition.y - location.y) < 20) {
      handleInteraction(location);
    }
  });

  // 检查是否被守护者追上
  guardians.forEach(guardian => {
    const el = document.querySelector(`.guardian`); // 确保选择器正确
    if (el && Math.abs(playerPosition.x - guardian.x) < 20 && Math.abs(playerPosition.y - guardian.y) < 20) {
      if (!gameOver) {
        gameOver = true;
        messageDiv.innerHTML = '你被守护者追上了！游戏失败。<br>点击“重新开始”按钮重新开始。';
        restartButton.style.display = 'block'; // 显示重新开始按钮
      }
    }
  });

  // 游戏胜利：玩家已经获得钥匙并且到达宝藏位置
  if (keysCollected === 1 && Math.abs(playerPosition.x - 400) < 20 && Math.abs(playerPosition.y - 400) < 20) {
    messageDiv.innerHTML = '恭喜你，成功打开宝箱获得宝藏！游戏胜利！';
    gameOver = true;
    restartButton.style.display = 'block'; // 显示重新开始按钮
  }
}

  // 游戏胜利：玩家已经获得钥匙并且到达宝藏位置
  if (keysCollected === 1 && Math.abs(playerPosition.x - 400) < 20 && Math.abs(playerPosition.y - 400) < 20) {
    messageDiv.innerHTML = '恭喜你，成功打开宝箱获得宝藏！游戏胜利！';
    gameOver = true;
    restartButton.style.display = 'block'; // 显示重新开始按钮
  }
}

// 处理玩家与地图物品的互动
function handleInteraction(location) {
  switch (location.type) {
    case 'L':
      messageDiv.innerHTML = location.message + '<br>';
      break;
    case 'S':
      keysCollected++;
      messageDiv.innerHTML = '你获得了钥匙！可以打开宝箱。';
      break;
    case 'B':
      if (keysCollected > 0) {
        messageDiv.innerHTML = location.message + '<br>你已经获得宝藏，游戏结束！';
        gameOver = true;
        restartButton.style.display = 'block'; // 显示重新开始按钮
      }
      break;
  }
}

// 游戏初始化
function initGame() {
  gameStarted = true;
  playerPosition = { x: 50, y: 50 };
  keysCollected = 0;
  gameOver = false;
  guardians = [];
  messageDiv.innerHTML = '游戏开始，使用方向键或鼠标控制小球。';
  startButton.style.display = 'none';
  restartButton.style.display = 'none'; // 隐藏重新开始按钮
  gameContainer.style.display = 'block';
  render();
}

// 重新开始游戏
function restartGame() {
  initGame();
}

// 监听键盘事件
document.addEventListener('keydown', function(event) {
  if (gameOver) return;
  
  switch (event.key) {
    case 'ArrowUp':
      playerPosition.y -= ballSpeed;
      break;
    case 'ArrowDown':
      playerPosition.y += ballSpeed;
      break;
    case 'ArrowLeft':
      playerPosition.x -= ballSpeed;
      break;
    case 'ArrowRight':
      playerPosition.x += ballSpeed;
      break;
  }

  // 保证小球不超出边界
  if (playerPosition.x < 0) playerPosition.x = 0;
  if (playerPosition.x > gameContainer.offsetWidth - 30) playerPosition.x = gameContainer.offsetWidth - 30;
  if (playerPosition.y < 0) playerPosition.y = 0;
  if (playerPosition.y > gameContainer.offsetHeight - 30) playerPosition.y = gameContainer.offsetHeight - 30;

  render();
});

// 点击开始游戏按钮
startButton.addEventListener('click', function() {
  initGame();
});

// 点击重新开始按钮
restartButton.addEventListener('click', function() {
  restartGame();
});

// 守护者的移动逻辑
function moveGuardians() {
  if (gameOver) return;
  
  guardians.forEach(guardian => {
    if (guardian.direction === 'left') {
      guardian.x -= 2;
      if (guardian.x <= 50) guardian.direction = 'right';
    } else {
      guardian.x += 2;
      if (guardian.x >= gameContainer.offsetWidth - 30) guardian.direction = 'left';
    }
  });
}

// 更新守护者的位置
function renderGuardians() {
  const guardianElements = document.querySelectorAll('.guardian');
  guardians.forEach((guardian, index) => {
    if (guardianElements[index]) { // 确保元素存在
      guardianElements[index].style.left = `${guardian.x}px`;
      guardianElements[index].style.top = `${guardian.y}px`;
    }
  });
}

// 背景音乐
let backgroundMusic = document.getElementById('backgroundMusic');

// 播放背景音乐
function playBackgroundMusic() {
  const backgroundMusic = document.getElementById('backgroundMusic');
  if (backgroundMusic) {
    // 用户交互后播放音乐
    backgroundMusic.play().catch(error => {
      console.error('Error playing background music:', error);
    });
  }
}

// 修改开始游戏按钮的事件监听器
startButton.addEventListener('click', function() {
  initGame();
  playBackgroundMusic(); // 用户点击后播放背景音乐
});

// 异步加载地图数据
function loadMapData() {
  fetch('data.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      const lines = data.split('\n');
      locations = lines.map(line => {
        const [name, x, y] = line.split(',');
        const type = name === '图书馆' ? 'L' : name === '神庙' ? 'S' : name === '宝箱' ? 'B' : '';
        const message = name === '图书馆' ? '小心！神庙有守护者！' : name === '神庙' ? '恭喜你，获得钥匙！' : name === '宝箱' ? '恭喜你，找到宝藏！' : '';
        const el = document.createElement('div');
        el.className = `mapObject ${type}`;
        el.style.left = `${parseInt(x, 10)}px`;
        el.style.top = `${parseInt(y, 10)}px`;
        gameContainer.appendChild(el);
        return { x: parseInt(x, 10), y: parseInt(y, 10), type, message };
      });

      // 创建守护者
      lines.forEach((line, index) => {
        const [name, x, y] = line.split(',');
        if (name === '守卫') {
          const guardianEl = document.createElement('div');
          guardianEl.className = 'guardian';
          guardianEl.style.left = `${parseInt(x, 10)}px`;
          guardianEl.style.top = `${parseInt(y, 10)}px`;
          gameContainer.appendChild(guardianEl);
          guardians.push({ x: parseInt(x, 10), y: parseInt(y, 10), direction: index % 2 === 0 ? 'left' : 'right' });
        }
      });

      initGame(); // 加载完数据后初始化游戏
    })
    .catch(error => {
      console.error('Error loading map data:', error);
      messageDiv.innerHTML = '无法加载地图数据。';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadMapData(); // 页面加载时加载地图数据
});

// 游戏的主循环
function gameLoop() {
  if (gameStarted && !gameOver && guardiansLoaded) {
    moveGuardians();
    renderGuardians();
    render();
  }
  requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();
