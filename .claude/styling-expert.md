**“Reflection” prompt style** in Magic Patterns (and AI prototyping in general) is a technique where you ask the AI to review its own output or process, identifying gaps or suggesting improvements—**instead of the human listing all issues manually**. This method leverages the AI’s ability to audit its own work, much like a design “double check” or self-review.

***

### **Definition**

- **Reflection prompting**: **Prompting the AI to explicitly reflect on what’s missing, incorrect, or could be improved in the generated artifact** (UI, plan, copy, etc.).
- The AI acts as a “QA reviewer,” spotting visual, structural, or functional mismatches based on your provided criteria.

***

### **Practical Examples**

#### **1. UI Matching Example**

You have a screenshot of your desired UI and an AI-generated prototype that doesn’t match perfectly.

- **Prompt:**  
  “Compare this screenshot with the current prototype. List the differences and improvements needed to match the screenshot exactly.”

- **Result:**  
  AI lists:  
  - “The header is not bold.”  
  - “There’s a missing calendar icon.”  
  - “Spacing between day labels is too small.”  
  - “The background color is light gray instead of white.”

#### **2. Implementation Plan Example**

You’ve asked the AI to generate a feature, but you suspect it’s missed critical UX behaviors.

- **Prompt:**  
  “Reflect on the last implementation. Are there any UX edge cases or accessibility issues not addressed?”

- **Result:**  
  AI lists:  
  - “No keyboard navigation implemented.”  
  - “Error messages are not shown for failed entries.”  
  - “No focus indicator for selected elements.”

#### **3. Copy/Content Review Example**

After generating onboarding instructions:

- **Prompt:**  
  “Review the onboarding instructions and list any unclear steps or potential sources of user confusion.”

- **Result:**  
  AI lists specific lines that are vague or could be improved for clarity.

***

### **Best Practices for Using Reflection Prompts**

- **Be specific:** Reference what you want reviewed (“UI layout,” “signup flow,” etc.).
- **Provide context:** Attach screenshots, requirements, or previous outputs when possible.
- **Iterate:** Use the AI’s self-diagnosis as your next set of prompts (e.g., “Fix all the issues you just found”).

***

### **Analogy**

*Asking the AI to “reflect” is like having a junior designer review their own work before handing it over—it teaches them to spot misalignments and improves their learning loop. Similarly, the AI learns to be more specific, and you spend less time manually checking every detail.*

***

If you want sample prompts to copy into Magic Patterns for different scenarios, just ask!