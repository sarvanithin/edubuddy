# EduBuddy - Your Personalized AI Tutor 🎓

**EduBuddy** is an intelligent AI-powered tutoring platform built with Azure OpenAI's GPT-4o mini model. It provides personalized, adaptive learning experiences to help students understand complex concepts across various subjects.

## 🌟 Features

- **AI-Powered Tutoring**: Leverages Azure OpenAI's GPT-4o mini model for intelligent, context-aware explanations
- **Multi-Subject Support**: Math, Science, History, Literature, Programming, and more
- **Adaptive Learning**: Adjusts explanation complexity based on student responses
- **Practice Problem Generation**: Creates custom practice questions to reinforce learning
- **Real-Time Chat Interface**: Clean, modern UI for seamless interactions
- **Socratic Method**: Guides students to discover answers through critical thinking
- **Subject Selection**: Easy toggle between different learning subjects

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Model**: Azure OpenAI (GPT-4o mini)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you get started, make sure you have:

- Node.js 18+ installed
- Azure account with Azure OpenAI service deployed
- Azure OpenAI API key and endpoint
- Deployed GPT-4o mini model on Azure

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/edubuddy.git
cd edubuddy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with your Azure OpenAI credentials:

```
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_DEPLOYMENT_NAME=gpt-4o-mini
```

You can get these values from:
- **API Key**: Azure Portal → Your OpenAI Resource → Keys and Endpoint
- **Endpoint**: Azure Portal → Your OpenAI Resource → Keys and Endpoint
- **Deployment Name**: The name you gave to your model deployment

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to use EduBuddy!

## 🛠️ Development

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## 📦 Project Structure

```
edubuddy/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   └── ChatInterface.tsx           # Main chat component
├── .env.local                      # Environment variables (create this)
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## 🎯 How It Works

1. **User Input**: Students type questions or topics they want to learn about
2. **AI Processing**: Azure OpenAI processes the request using the system prompt (tutor guidelines)
3. **Intelligent Response**: The model generates context-aware, educational responses
4. **Adaptive Learning**: Responses adjust based on conversation history and subject selection
5. **Real-Time Display**: Responses stream to the user in real-time

## 🧠 System Prompt

EduBuddy uses a custom system prompt that instructs the AI to:
- Break down complex topics into simple explanations
- Use relevant analogies and examples
- Generate practice problems
- Employ the Socratic method for critical thinking
- Provide encouraging feedback
- Adapt to different learning styles

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_DEPLOYMENT_NAME`
5. Deploy!

### Alternative: Deploy Anywhere

This is a standard Next.js app, so you can deploy it to:
- Netlify
- AWS Amplify
- DigitalOcean
- Azure App Service
- Docker containers

## 📊 Azure OpenAI Setup

If you haven't set up Azure OpenAI yet:

1. Create an Azure account at [azure.microsoft.com](https://azure.microsoft.com)
2. Create an Azure OpenAI resource
3. Deploy the `gpt-4o-mini` model
4. Get your API key and endpoint from the resource's Keys and Endpoint page
5. Add them to your `.env.local` file

## 🎓 Use Cases

- **Students**: Get personalized tutoring in any subject
- **Teachers**: Use as a supplementary learning tool
- **Self-Learners**: Learn new topics at your own pace
- **Test Preparation**: Generate practice problems and explanations
- **Homework Help**: Get step-by-step solutions and explanations

## 💡 Tips for Best Results

- **Be Specific**: Ask specific questions rather than vague ones
- **Follow Up**: Build on previous answers for deeper understanding
- **Request Examples**: Ask for real-world examples of concepts
- **Generate Practice**: Request practice problems to test your knowledge
- **Try Different Subjects**: Switch between subjects to explore multiple topics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for the Azure Codeathon 2025
- Powered by Azure OpenAI's GPT-4o mini
- Modern UI inspired by best practices in educational technology

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for learners everywhere**
