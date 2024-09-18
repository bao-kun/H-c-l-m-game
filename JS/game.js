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

// Tải hình ảnh nhân vật
const playerImage = new Image();
playerImage.src = "./IMG/hero.jpg";
const player = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  hp: 100,
  maxHp: 100, // Lưu HP tối đa để tính toán thanh máu
};

// Tải hình ảnh kẻ thù
const enemyImage = new Image();
enemyImage.src = "./IMG/Enemies/goblin1.jpg";

// Tải hình ảnh vật phẩm
const itemImage = new Image();
itemImage.src = "./IMG/Item/potion.svg";

// Mảng chứa các hình ảnh bản đồ
const mapImages = {
  1: new Image(),
};

// Đặt nguồn (source) cho mỗi bản đồ
mapImages[1].src = "./IMG/Map/map1.jpg";

// Mảng dữ liệu bản đồ 2D cho từng khu vực
const mapData = {
  1: [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

// Mảng chứa kẻ thù cho mỗi khu vực
const enemiesByArea = {
  1: [
    {
      x: tileSize * 2,
      y: tileSize * 2,
      image: enemyImage,
      hp: 100,
      maxHp: 100,
    },
    {
      x: tileSize * 5,
      y: tileSize * 7,
      image: enemyImage,
      hp: 100,
      maxHp: 100,
    },
  ],
  2: [
    {
      x: tileSize * 3,
      y: tileSize * 3,
      image: enemyImage,
      hp: 100,
      maxHp: 100,
    },
    {
      x: tileSize * 6,
      y: tileSize * 2,
      image: enemyImage,
      hp: 100,
      maxHp: 100,
    },
  ],
  3: [
    {
      x: tileSize * 1,
      y: tileSize * 1,
      image: enemyImage,
      hp: 100,
      maxHp: 100,
    },
    {
      x: tileSize * 7,
      y: tileSize * 5,
      image: enemyImage,
      hp: 100,
      maxHp: 100,
    },
  ],
};

// Mảng chứa các vật phẩm
let items = [
  { x: tileSize * 3, y: tileSize * 4, image: itemImage },
  { x: tileSize * 8, y: tileSize * 1, image: itemImage },
];

// Khu vực hiện tại
let currentArea = 1;

// Vẽ bản đồ từ hình ảnh bản đồ
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(mapImages[currentArea], 0, 0, canvas.width, canvas.height);
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
  const barWidth = 100; // Chiều dài của thanh máu
  const barHeight = 10; // Chiều cao của thanh máu
  const healthPercentage = player.hp / player.maxHp; // Tính phần trăm máu còn lại
  const healthBarWidth = barWidth * healthPercentage; // Chiều dài của thanh máu dựa trên phần trăm HP

  // Vị trí thanh máu
  const barX = playerPosition.x + 5;
  const barY = playerPosition.y - 15; // Đặt thanh máu phía trên nhân vật

  // Vẽ nền thanh máu (màu đen)
  ctx.fillStyle = "black";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Vẽ thanh máu (màu xanh lá cây)
  ctx.fillStyle = "green";
  ctx.fillRect(barX, barY, healthBarWidth, barHeight);

  // Hiển thị số HP
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText(`${player.hp}/${player.maxHp}`, barX, barY - 5); // Hiển thị HP phía trên thanh máu
}

// Vẽ tất cả các kẻ thù cho khu vực hiện tại
function drawEnemies() {
  const currentEnemies = enemiesByArea[currentArea];
  currentEnemies.forEach((enemy) => {
    ctx.drawImage(enemy.image, enemy.x + 5, enemy.y + 5, enemySize, enemySize);
  });
}

// Vẽ tất cả các vật phẩm
function drawItems() {
  items.forEach((item) => {
    ctx.drawImage(item.image, item.x + 5, item.y + 5, itemSize, itemSize);
  });
}

// Kiểm tra va chạm giữa nhân vật và kẻ thù
function checkCollision() {
  const currentEnemies = enemiesByArea[currentArea];
  currentEnemies.forEach((enemy, index) => {
    if (
      playerPosition.x < enemy.x + enemySize &&
      playerPosition.x + playerSize > enemy.x &&
      playerPosition.y < enemy.y + enemySize &&
      playerPosition.y + playerSize > enemy.y
    ) {
      alert("Bạn đã chạm trán với kẻ thù! Trận chiến bắt đầu!");
      attack();
      currentEnemies.splice(index, 1); // Loại bỏ kẻ thù khi va chạm
    }
  });
}

function attack() {
  const currentEnemies = enemiesByArea[currentArea];
  if (currentEnemies.length > 0 && player.hp > 0) {
    let enemy = currentEnemies[0];
    let playerAttack = Math.floor(Math.random() * 10) + 5; // Sát thương từ 5-15
    enemy.hp -= playerAttack;
    if (enemy.hp < 0) enemy.hp = 0; // Không cho HP xuống dưới 0
    document.getElementById(
      "log"
    ).innerText = `You hit the enemy for ${playerAttack} damage!`;

    if (enemy.hp === 0) {
      document.getElementById("log").innerText += `\nYou defeated the enemy!`;
      currentEnemies.shift(); // Loại bỏ kẻ thù đã bị đánh bại
    }

    if (enemy.hp > 0) {
      setTimeout(function () {
        let enemyAttack = Math.floor(Math.random() * 10) + 5; // Sát thương từ 5-15
        player.hp -= enemyAttack;
        if (player.hp < 0) player.hp = 0; // Không cho HP xuống dưới 0
        document.getElementById(
          "log"
        ).innerText += `\nThe enemy hits you for ${enemyAttack} damage!`;

        if (player.hp === 0) {
          document.getElementById(
            "log"
          ).innerText += `\nYou were defeated by the enemy...`;
        }
      }, 1000);
    }
  }
}

// Kiểm tra va chạm giữa nhân vật và vật phẩm
function checkItemCollection() {
  items.forEach((item, index) => {
    if (
      playerPosition.x < item.x + itemSize &&
      playerPosition.x + playerSize > item.x &&
      playerPosition.y < item.y + itemSize &&
      playerPosition.y + playerSize > item.y
    ) {
      alert("Bạn đã thu thập một vật phẩm!");
      items.splice(index, 1); // Loại bỏ vật phẩm khi thu thập
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

// Di chuyển nhân vật
function movePlayer(direction) {
  let newX = playerPosition.x;
  let newY = playerPosition.y;

  switch (direction) {
    case "up":
      newY -= tileSize;
      break;
    case "down":
      newY += tileSize;
      break;
    case "left":
      newX -= tileSize;
      break;
    case "right":
      newX += tileSize;
      break;
  }

  const tileX = Math.floor(newX / tileSize);
  const tileY = Math.floor(newY / tileSize);

  // Kiểm tra xem ô có thể đi qua (giá trị 0)
  if (mapData[currentArea][tileY] && mapData[currentArea][tileY][tileX] === 0) {
    playerPosition.x = newX;
    playerPosition.y = newY;

    checkCollision(); // Kiểm tra va chạm sau khi di chuyển
  }
}

// Xử lý sự kiện di chuyển và tấn công
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      movePlayer("up");
      break;
    case "ArrowDown":
      movePlayer("down");
      break;
    case "ArrowLeft":
      movePlayer("left");
      break;
    case "ArrowRight":
      movePlayer("right");
      break;
    case " ": // Phím cách (spacebar)
      attack(); // Gọi hàm attack khi nhấn phím cách
      break;
  }

  changeArea(); // Kiểm tra nếu người chơi chuyển khu vực
  drawMap();
  drawPlayer();
  drawEnemies();
  drawItems();
  checkItemCollection(); // Kiểm tra va chạm với vật phẩm
});

// Đảm bảo tất cả hình ảnh được tải trước khi vẽ các thành phần trò chơi
const allImages = [
  ...Object.values(mapImages),
  playerImage,
  enemyImage,
  itemImage,
];
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
