USE users;

-- Exemple opcional
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user'
);

INSERT INTO users (name, password, role) VALUES
('admin', '$2b$10$qy2n2D1q/bf5j3dsPbDrr.rTUYsVIeiRhwKrznzmZaRqDK7Zhg9o6', 'admin'), -- password: admin
('user', '$2b$10$nJTv7TYqDMWm5.Pnaj9JPe9OA65bINhgdYP9TstwX9y0VVZnEnq8K', 'user');  -- password: user