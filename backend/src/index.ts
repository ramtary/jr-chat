import express, { Request, Response } from "express";
import cors from "cors";
import { Client } from "pg";

const PORT = process.env.APP_PORT || 4000;

type User = {
  "user_id": number,
  "username": string,
};

type Message = {
  "id": number,
  "username": string | null,
  "text": string,
  "timestamp": string,
};

// Валидатор
type Validator<T> = {
  validate: (value: T) => boolean;
  message: string;
};

// Результат валидации
type ValidationResult =
  | { isValid: true; error: null }
  | { isValid: false; error: string };

// Валидация
function validate<T>(value: T, validators: Validator<T>[]): ValidationResult {
  for (const { validate, message } of validators) {
    if(!validate(value)) {
      return { isValid: false, error: message};
    }
  }
  return { isValid: true, error: null };
}

// Валидаторы для username
const usernameValidations: Validator<string>[] = [
  { validate: (username) => typeof username === "string", message: "Username must be a string" },
  { validate: (username) => username.length >= 2, message: "Username must be at least 2 characters" },
  { validate: (username) => username.length <= 50, message: "Username must be at most 50 characters" },
]

// Валидаторы для message (text)
const messageValidations: Validator<string>[] = [
  { validate: (message) => typeof message === "string", message: "Message must be a string" },
  { validate: (message) => message.length >= 1, message: "Message must be at least 1 character" },
  { validate: (message) => message.length <= 500, message: "Message must be at most 500 characters" },
]

const pgClient = new Client();

const server = express();

async function initServer() {
  if (!process.env.PGUSER) {
    throw new Error("Server cannot be started without database credentials provided in .env file");
  }

  server.use(cors());

  server.use(express.json());

  async function getUsers() {
    const usersResponse = await pgClient.query("SELECT * FROM users");
    return usersResponse.rows as User[];
  }

  async function getUserById(userId: number) {
    const usersResponse = await pgClient.query(`SELECT * FROM users WHERE user_id = $1::integer`, [userId]);

    if (usersResponse.rows.length > 0) {
      return usersResponse.rows[0] as User;
    }

    return null;
  }

  async function getUserByName(username: string) {
    const usersResponse = await pgClient.query(`SELECT * FROM users WHERE username = $1::text`, [username]);

    if (usersResponse.rows.length > 0) {
      return usersResponse.rows[0] as User;
    }

    return null;
  }

  server.get("/", function (req: Request, res: Response) {
    res.status(200).json("Hello from backend");
  });

  server.get("/users", async function (req: Request, res: Response) {
    const usersResponse = await getUsers();
    res.status(200).send(usersResponse);
  });

  server.post("/users", async function (req: Request, res: Response) {
    const { username } = req.body;
    const user = await getUserByName(username);

    if (user !== null) {
      res.status(200).send({
        "user_id": user.user_id,
      });
      return;
    }

    if (username == null) {
      res.status(401).send({
          message: "Username is null",
      });

      return;
    } 
    else {
      const usernameCheck = validate(username, usernameValidations);  

      if (!usernameCheck.isValid) {
        res.status(401).send({
          message: usernameCheck.error,
        });

        return;
      }
    }

    const newUserResponse = await pgClient.query(`INSERT INTO users(
      username
    ) VALUES (
      $1::text
    )`, [username]);

    if (newUserResponse.rowCount === 0) {
      res.sendStatus(500);
    }

    const newUser = await getUserByName(username);

    if (newUser === null) {
      res.sendStatus(500);
      return;
    } 

    res.status(200).send({
      "user_id": newUser.user_id,
    });
  });

  server.get("/messages", async function (req: Request, res: Response) {
    const messagesResponse = await pgClient.query(`SELECT
      messages.message_id AS id,
      users.username AS username,
      messages.text AS text,
      messages.created_at AS timestamp
    FROM messages
    LEFT JOIN users ON messages.user_id = users.user_id
    ORDER BY messages.created_at ASC`);

    res.status(200).send(messagesResponse.rows as Message[]);
  });

  server.post("/messages", async function (req: Request, res: Response) {
    const { user_id, text } = req.body;
    const user = await getUserById(user_id);
    const username = user?.username;

    if (username == undefined) {
      res.status(401).send({
          message: "Username does not exist",
      });

      return;
    } 
    else {
      const usernameCheck = validate(username, usernameValidations);  

      if (!usernameCheck.isValid) {
        res.status(401).send({
          message: usernameCheck.error,
        });

        return;
      }
    }

    const messageCheck = validate(text, messageValidations);  

    if (!messageCheck.isValid) {
      res.status(401).send({
        message: messageCheck.error,
      });

      return;
    }

    if (typeof text !== "string" || text.length < 1 || text.length > 500) {
      res.status(400).send({
        message: "Incorrect message text",
      });

      return;
    }

    let newMessageResponse;

    try {
      newMessageResponse = await pgClient.query(`INSERT INTO messages(
        text,
        user_id
      ) VALUES ($1::text, $2::integer)`, [text, user_id]);

      res.sendStatus(201);
    } catch (err) {
      console.error(err);
      console.dir(newMessageResponse, {
        depth: 10
      });

      res.sendStatus(500);
    }
  });

  await pgClient.connect();

  server.listen(PORT, function () {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

process.on("exit", async function () {
  await pgClient.end();
});

initServer();
