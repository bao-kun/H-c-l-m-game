const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Kích thước của canvas
canvas.width = 600;
canvas.height = 600;

// Kích thước ô và nhân vật
const tileSize = 40;
const playerSize = tileSize - 10;
const enemySize = tileSize - 10;
const itemSize = tileSize - 10;

// Vị trí ban đầu của nhân vật
let playerPosition = {
  x: tileSize * 4,
  y: tileSize * 4,
};

// Tải hình ảnh bản đồ
const mapImage = new Image();
mapImage.src = "map.png";

// Tải hình ảnh nhân vật
const playerImage = new Image();
playerImage.src = "player.png";

// Tải hình ảnh kẻ thù
const enemyImage = new Image();
enemyImage.src = "enemy.png";

// Tải hình ảnh vật phẩm
const itemImage = new Image();
itemImage.src = "item.png";

// Mảng chứa các kẻ thù cho các khu vực khác nhau
const areas = {
  1: {
    enemies: [
      { x: tileSize * 2, y: tileSize * 2 },
      { x: tileSize * 5, y: tileSize * 7 },
      // Thêm các kẻ thù khác...
    ],
    items: [
      { x: tileSize * 3, y: tileSize * 4 },
      { x: tileSize * 8, y: tileSize * 1 },
      // Thêm các vật phẩm khác...
    ],
  },
  2: {
    enemies: [
      { x: tileSize * 1, y: tileSize * 1 },
      { x: tileSize * 7, y: tileSize * 5 },
      // Thêm các kẻ thù khác...
    ],
    items: [
      { x: tileSize * 6, y: tileSize * 3 },
      { x: tileSize * 2, y: tileSize * 8 },
      // Thêm các vật phẩm khác...
    ],
  },
  3: {
    enemies: [
      { x: tileSize * 4, y: tileSize * 2 },
      { x: tileSize * 3, y: tileSize * 7 },
      // Thêm các kẻ thù khác...
    ],
    items: [
      { x: tileSize * 5, y: tileSize * 5 },
      { x: tileSize * 8, y: tileSize * 2 },
      // Thêm các vật phẩm khác...
    ],
  },
};

// Khu vực hiện tại
let currentArea = 1;

// Vẽ bản đồ từ hình ảnh bản đồ
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
}

// Vẽ nhân vật
function drawPlayer() {
  ctx.drawImage(
    playerImage,
    playerPosition.x + 5,
    playerPosition.y + 5,
    playerSize,
    playerSize
  );
}

// Vẽ tất cả các kẻ thù trong khu vực hiện tại
function drawEnemies() {
  areas[currentArea].enemies.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x + 5, enemy.y + 5, enemySize, enemySize);
  });
}

// Vẽ tất cả các vật phẩm trong khu vực hiện tại
function drawItems() {
  areas[currentArea].items.forEach((item) => {
    ctx.drawImage(itemImage, item.x + 5, item.y + 5, itemSize, itemSize);
  });
}

// Kiểm tra va chạm giữa nhân vật và kẻ thù
function checkCollision() {
  areas[currentArea].enemies.forEach((enemy, index) => {
    if (playerPosition.x === enemy.x && playerPosition.y === enemy.y) {
      alert("Bạn đã chạm trán với kẻ thù! Trận chiến bắt đầu!");
      areas[currentArea].enemies.splice(index, 1);
    }
  });
}

// Kiểm tra va chạm giữa nhân vật và vật phẩm
function checkItemCollection() {
  areas[currentArea].items.forEach((item, index) => {
    if (playerPosition.x === item.x && playerPosition.y === item.y) {
      alert("Bạn đã thu thập một vật phẩm!");
      areas[currentArea].items.splice(index, 1);
    }
  });
}

// Chuyển sang khu vực mới
function changeArea() {
  if (playerPosition.x < 0) {
    playerPosition.x = canvas.width - tileSize;
    currentArea = currentArea === 1 ? 2 : 3;
  } else if (playerPosition.x >= canvas.width) {
    playerPosition.x = 0;
    currentArea = currentArea === 3 ? 1 : 2;
  } else if (playerPosition.y < 0) {
    playerPosition.y = canvas.height - tileSize;
    currentArea = currentArea === 1 ? 3 : 2;
  } else if (playerPosition.y >= canvas.height) {
    playerPosition.y = 0;
    currentArea = currentArea === 2 ? 1 : 3;
  }
}

// Xử lý di chuyển nhân vật
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowUp":
      if (playerPosition.y > 0) playerPosition.y -= tileSize;
      break;
    case "ArrowDown":
      if (playerPosition.y < canvas.height - tileSize)
        playerPosition.y += tileSize;
      break;
    case "ArrowLeft":
      if (playerPosition.x > 0) playerPosition.x -= tileSize;
      break;
    case "ArrowRight":
      if (playerPosition.x < canvas.width - tileSize)
        playerPosition.x += tileSize;
      break;
  }
  changeArea(); // Kiểm tra nếu người chơi chuyển khu vực
  drawMap();
  drawPlayer();
  drawEnemies();
  drawItems();
  checkCollision(); // Kiểm tra va chạm với kẻ thù
  checkItemCollection(); // Kiểm tra va chạm với vật phẩm
});

// Đảm bảo tất cả hình ảnh được tải trước khi vẽ các thành phần trò chơi
const allImages = [mapImage, playerImage, enemyImage, itemImage];
let loadedImages = 0;

allImages.forEach((image) => {
  image.onload = function () {
    loadedImages++;
    if (loadedImages === allImages.length) {
      drawMap();
      drawPlayer();
      drawEnemies();
      drawItems();
    }
  };
});
