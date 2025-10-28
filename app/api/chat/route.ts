import { NextRequest, NextResponse } from "next/server";

// Intelligent adaptive responses
const adaptiveResponses = {
  photosynthesis: {
    beginner: `🌱 **Let's Start with Photosynthesis!**

Great question! Let me break this down super simply:

**The Basic Idea:**
Plants are like little factories that make their own food using sunlight!

**Three Simple Steps:**
1. ☀️ **Sunlight** - Plants catch sunlight with their green leaves
2. 💧 **Water** - Roots pull water from the soil
3. 💨 **CO2** - Leaves take CO2 from the air
4. ✨ **Magic Happens** - They mix all these together using sunlight energy
5. 🍎 **Result** - Food (sugar) for the plant + Oxygen we breathe!

**Simple Formula:**
Sunlight + Water + CO2 = Sugar + Oxygen

**Now let me check your understanding:**
❓ **Quick Question:** When a plant makes its own food, what gas do you think it releases into the air that we breathe?
A) Carbon Dioxide
B) Nitrogen
C) Oxygen
D) Hydrogen

Reply with just A, B, C, or D!`,

    intermediate: `🌱 **Deep Dive: Photosynthesis**

Excellent curiosity! Let me explain the mechanism:

**The Two Stages:**

**1️⃣ Light Reactions (in Thylakoid)**
- Chlorophyll absorbs photons
- Water molecules split (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂
- Electrons move through electron transport chain
- ATP and NADPH are produced
- O₂ is released as byproduct

**2️⃣ Calvin Cycle (Dark Reactions in Stroma)**
- CO₂ is fixed by RuBisCO enzyme
- 3-phosphoglycerate is reduced
- G3P molecules are formed
- Some G3P regenerates RuBP
- Others build glucose

**Overall Equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**Key Concepts:**
- Photosystems I & II
- Electron transport chain
- Chemiosmosis
- Carbon fixation

❓ **Skill Check:** What's the role of the light reactions in photosynthesis?
A) Directly fix CO₂
B) Produce ATP and NADPH
C) Build glucose molecules
D) All of the above

Let me know your answer (A/B/C/D), and we'll discuss the next level!`,

    advanced: `🌱 **Advanced Photosynthesis: Quantum & Ecological Perspectives**

Excellent! You're ready for some advanced concepts:

**Quantum Aspects:**
- Quantum coherence in light-harvesting complexes
- Resonance energy transfer with 100% efficiency
- Excitonic states and decoherence
- Femtosecond spectroscopy findings

**C3, C4, and CAM Pathways:**
- **C3 Plants**: Rice, wheat, soybeans (2 carbons in Calvin cycle)
- **C4 Plants**: Corn, sugarcane (4 carbons initially) - more efficient in hot/dry
- **CAM Plants**: Succulents, cacti - open stomata at night

**Enzyme Kinetics:**
- RuBisCO: ~3 reactions/sec (slow enzyme)
- Carboxylation vs Oxygenation (photorespiration)
- Regulation by ATP, NADPH, ADP

**Ecological Implications:**
- Global carbon fixation: ~200 Gt/year
- Climate change effects on photosynthetic capacity
- Agricultural yield optimization

❓ **Advanced Validation:** Why do C4 plants outcompete C3 plants in hot, dry climates despite C4's extra ATP cost?

Think about stomatal limitations and CO₂ fixation efficiency!`,
  },

  math: {
    beginner: `📐 **Let's Solve: 2x + 5 = 15**

Perfect! Let me teach you step-by-step:

**Step 1: Understand the Goal**
We need to find what number x is!

**Step 2: Get x alone**
- Right now: 2x + 5 = 15
- We need to remove the +5
- So subtract 5 from BOTH sides:
  2x + 5 - 5 = 15 - 5
  2x = 10

**Step 3: Divide to find x**
- We have: 2x = 10
- Divide both sides by 2:
  2x ÷ 2 = 10 ÷ 2
  x = 5

**Step 4: Check Your Answer!**
Plug x = 5 back into original:
2(5) + 5 = 10 + 5 = 15 ✅ Correct!

**Key Rule:** Whatever you do to one side, do to the other side!

❓ **Your Turn - Quick Check:**
If 3x + 2 = 14, what is x?
Think about: What do you need to subtract first? Then divide?

Give it a try! Tell me your answer and how you got it! 🎯`,

    intermediate: `📐 **Linear Equations & Systems**

Good level! Let's go deeper:

**Method 1: Substitution**
- Solve one equation for a variable
- Substitute into the other
- Solve the resulting equation

**Method 2: Elimination**
- Multiply equations to align coefficients
- Add/subtract to eliminate a variable
- Solve for remaining variable

**Your Problem: 2x + 5 = 15**
- Isolate term with x: 2x = 15 - 5 = 10
- Divide by coefficient: x = 10/2 = 5

**Related Concepts:**
- Linear vs Non-linear equations
- Slope-intercept form: y = mx + b
- Solving systems: 2x2, 3x3 matrices
- Graphical solutions

**Real-world Applications:**
- Business: Cost-revenue analysis
- Physics: Kinematics equations
- Economics: Supply-demand curves

❓ **Challenge:** Solve this system:
2x + y = 7
x - y = 2

Show me your steps! What method would you use?`,

    advanced: `📐 **Abstract Algebra & Linear Systems**

You're ready! Deep mathematics ahead:

**Vector Space Approach:**
- Treat equations as vectors in ℝⁿ
- Linear transformation: Ax = b
- Matrix operations and rank
- Determinants and Cramer's rule

**Your Problem in Matrix Form:**
[2][x] = [10]
So: x = 10/2 = 5

**Advanced Topics:**
- Eigenvalues and eigenvectors
- Kernel and image of linear maps
- Rank-nullity theorem
- Gaussian elimination complexity: O(n³)

**Computational Methods:**
- LU decomposition
- QR factorization
- SVD (Singular Value Decomposition)
- Iterative solvers (Jacobi, Gauss-Seidel)

**Applications:**
- Machine learning: Linear regression
- Graphics: 3D transformations
- Engineering: FEM (Finite Element Methods)

❓ **Deep Question:** Why is Gaussian elimination O(n³) and can we do better for sparse matrices?

Let's explore computational complexity! 🔬`,
  },
};

// Assessment questions
const assessmentQuestions = [
  "What's your learning style? Visual (diagrams), Auditory (explanations), or Kinesthetic (practice)?",
  "How much time can you spend learning per day? (Quick lessons vs deep dives)",
  "What's your current knowledge level in this subject? Beginner, Intermediate, or Advanced?",
];

// Skill validation questions asked mid-learning
const validationQuestions = {
  photosynthesis: [
    "What are the two main stages of photosynthesis and where do they occur?",
    "Why do plants need both light and darkness for photosynthesis?",
    "How would photosynthesis be affected if there was no CO₂ available?",
  ],
  math: [
    "Can you explain why we do the same operation on both sides of an equation?",
    "What's the difference between a coefficient and a variable?",
    "Can you solve a similar equation on your own?",
  ],
};

function determineLevel(messageCount: number): "beginner" | "intermediate" | "advanced" {
  if (messageCount < 3) return "beginner";
  if (messageCount < 8) return "intermediate";
  return "advanced";
}

function getAdaptiveResponse(topic: string, userMessage: string, messageCount: number): string {
  const level = determineLevel(messageCount);

  // Check if it's an assessment question response
  if (messageCount === 1) {
    return `Great! I appreciate you sharing that. Now let me understand your current level better.\n\n${assessmentQuestions[1]}`;
  }

  if (messageCount === 2) {
    return `Perfect! Now tell me:\n\n${assessmentQuestions[2]}`;
  }

  // Main teaching responses based on level
  if (topic.toLowerCase().includes("photosynthesis") || topic.toLowerCase().includes("plant")) {
    const responses = adaptiveResponses.photosynthesis;
    const response = responses[level as keyof typeof responses];

    // Add validation question every 2-3 messages
    if (messageCount % 2 === 0) {
      const validationQ = validationQuestions.photosynthesis[Math.floor(messageCount / 3) % validationQuestions.photosynthesis.length];
      return response + `\n\n🎯 **Before we continue, let me validate your understanding:**\n${validationQ}`;
    }

    return response;
  }

  if (topic.toLowerCase().includes("2x + 5") || (topic.toLowerCase().includes("solve") && topic.toLowerCase().includes("equation"))) {
    const responses = adaptiveResponses.math;
    const response = responses[level as keyof typeof responses];

    if (messageCount % 2 === 0) {
      const validationQ = validationQuestions.math[Math.floor(messageCount / 3) % validationQuestions.math.length];
      return response + `\n\n🎯 **Now let me check your understanding:**\n${validationQ}`;
    }

    return response;
  }

  // Default adaptive response
  return `That's a great question! Based on your learning style, let me explain this in a way that works best for you.\n\nFirst, I'd like to understand better:\n${assessmentQuestions[0]}\n\nThis helps me teach you in the most effective way! 📚`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const messageCount = messages.length;

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage.content;

    // Determine the topic from user input
    let topic = "general";
    if (userInput.toLowerCase().includes("photosynthesis") || userInput.toLowerCase().includes("plant")) {
      topic = "photosynthesis";
    } else if (userInput.toLowerCase().includes("2x + 5") || userInput.toLowerCase().includes("solve") || userInput.toLowerCase().includes("equation")) {
      topic = "math";
    }

    // Get adaptive response based on user level
    const adaptiveResponse = getAdaptiveResponse(userInput, userInput, messageCount);

    // Simulate real API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({
      message: adaptiveResponse,
      metadata: {
        topic,
        level: determineLevel(messageCount),
        messageCount,
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
