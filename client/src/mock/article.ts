export const data = [
  {
    _id: "********-****-****-****-************",
    email: "joshdgilley@gmail.com",
    articles: [
      {
        url: "https://www.youtube.com/watch?v=_T9s2K4UWaA",
        articleDetails: [
          "# 🚀 Full-Stack Boilerplate: React TypeScript + Fastify MongoDB \n This boilerplate provides a modern and efficient full-stack setup for web applications, combining a **React TypeScript** frontend with a **Fastify MongoDB** backend. It is designed for scalability, maintainability, and developer productivity, featuring best practices for coding standards, testing, and internationalization.",
          "# 🚀 Full-Stack Boilerplate 2: React TypeScript + Fastify MongoDB \n This boilerplate provides a modern and efficient full-stack setup for web applications, combining a **React TypeScript** frontend with a **Fastify MongoDB** backend. It is designed for scalability, maintainability, and developer productivity, featuring best practices for coding standards, testing, and internationalization.",
        ],
        articleId: "1b8f723c-a2cf-46e2-bf38-b1d874103950",
        articleName: "How The Digital Vanguard was built",
        tag: "React.js",
        summary:
          "orem ipsum dolor sit amet, consectetur adipiscing elit. In lacinia sapien purus, non tempus ipsum cursus quis. Sed quis est nulla. In faucibus massa id erat tincidunt dictum quis bibendum enim. Sed eleifend dui lacus, sit amet laoreet libero viverra non. Ut eu tincidunt lacus. Aliquam dictum mauris euismod orci semper molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse sed magna vitae est suscipit condimentum. Maecenas non rutrum urna. Vivamus suscipit nisl ultrices, pulvinar purus quis, ornare ligula. Aenean in leo imperdiet, fermentum lectus eget, hendrerit nibh. Integer ac erat et tortor ultricies auctor.",
      },
    ],
    phoneNumber: "(843)259-9681",
    userId: "2cc2d264-020a-4690-be0f-2ad84a729942",
    username: "Joshua Gilley",
    linkedIn: "https://www.linkedin.com/in/joshuadgilley/",
    github: "https://github.com/TheDigitalVanguard",
  },
];

export const headerData = [
  {
    url: "https://www.youtube.com/watch?v=Ux6AsGQ7VBA&t=208s",
    summary:
      "Staying up to date with tech is overwhelming. Resources are scattered, and platforms like YouTube flood users with outdated or irrelevant tutorials. The Digital Vanguard (TDV) solves this by organizing everything into a single ecosystem, ranking content through an AI-powered system that prioritizes value—keeping information current, relevant, and widely applicable. Check out the github here: https://github.com/TheDigitalVanguard ",
    tag: "Full-stack Development",
    markdown:
      '# Setting Up a Vite + React + Fastify + MongoDB Project\n\nIn this guide, I will walk through how I set up a simple project structure using Vite for the frontend, Fastify for the backend, and MongoDB for the database. This setup will help kickstart development and allow smooth local testing.\n\n## Prerequisites\n\nEnsure you have the following installed:\n\n- [Node.js](https://nodejs.org/) (LTS version recommended)\n- [MongoDB](https://www.mongodb.com/) (local or cloud instance)\n- [PNPM](https://pnpm.io/) or NPM/Yarn\n\n## Project Structure\n\nThe project will follow this structure:\n\n```\nmy-app/\n├── backend/          # Fastify server\n│   ├── src/\n│   │   ├── routes/\n│   │   ├── plugins/\n│   │   ├── index.js\n│   ├── package.json\n│   ├── .env\n│   ├── tsconfig.json (if using TypeScript)\n├── frontend/         # Vite + React\n│   ├── src/\n│   │   ├── components/\n│   │   ├── pages/\n│   │   ├── main.jsx\n│   ├── index.html\n│   ├── package.json\n│   ├── vite.config.js\n├── README.md\n```\n\n## Step 1: Setting Up the Frontend with Vite\n\n1. Navigate to the project root and create the frontend:\n   ```sh\n   npm create vite@latest my-app -- --template react\n   cd client\n   npm install\n   ```\n2. Start the development server:\n   ```sh\n   npm run start\n   ```\n\n## Step 2: Setting Up the Backend with Fastify\n\n1. Navigate to the project root and create the backend:\n   ```sh\n   mkdir backend && cd backend\n   npm init\n   ```\n2. Install dependencies:\n   ```sh\n   npm install fastify fastify-cors dotenv mongodb\n   ```\n3. Create `src/server.ts`:\n\n   ```js\n   import Fastify from "fastify";\n   import dotenv from "dotenv";\n   import cors from "@fastify/cors";\n   import { MongoClient } from "mongodb";\n\n   dotenv.config();\n   const fastify = Fastify({ logger: true });\n\n   fastify.register(cors, { origin: "*" });\n\n   const client = new MongoClient(process.env.MONGO_URI);\n   async function connectDB() {\n     await client.connect();\n     fastify.decorate("db", client.db("mydatabase"));\n   }\n\n   fastify.get("/", async () => ({ message: "API is working" }));\n\n   const start = async () => {\n     try {\n       await connectDB();\n       await fastify.listen({ port: 5000 });\n     } catch (err) {\n       fastify.log.error(err);\n       process.exit(1);\n     }\n   };\n   start();\n   ```\n\n4. Add `.env` file:\n   ```\n   EXAMPLE_MONGO_URI=mongodb://localhost:27017/mydatabase\n   ```\n5. Run the backend:\n   ```sh\n   ts-node server.ts\n   ```\n\n## Step 3: Connecting Frontend to Backend\n\n1. Update `client/src/main.jsx`:\n\n   ```jsx\n   import { useEffect, useState } from "react";\n\n   function App() {\n     const [message, setMessage] = useState("");\n\n     useEffect(() => {\n       fetch("http://localhost:5173/")\n         .then((res) => res.json())\n         .then((data) => setMessage(data.message));\n     }, []);\n\n     return <h1>{message}</h1>;\n   }\n\n   export default App;\n   ```\n\n2. Install concurrently and write a start script in client package.json\n\n   ```sh\n   "server": "cd .. && cd server && npm run dev",\n   "dev": "concurrently \\"npm run client\\" \\"npm run server\\"",\n   ```\n\n3. Run npm run dev to start up your development environment.\n\n## Conclusion\n\nVisit [The Digital Vanguard\'s Github](https://github.com/TheDigitalVanguard/the-digital-vanguard) to see the current version.\n',
    articleId: "a0db8bd4-afb2-40b8-a28d-9d53101fe86d",
    userId: "9367cbee-9f32-4d8b-b375-fc1af17f3a62",
    articleName: "How The Digital Vanguard was built",
    detailId: "3d0bbd1c-7276-4c8d-bad1-fdd644020025",
    sortValue: 2,
  },
];
