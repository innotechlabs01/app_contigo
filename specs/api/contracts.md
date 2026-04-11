## 📂 7. api_contracts.md
```json
{
  "POST /onboarding/evaluate": { 
    "answers": "Object", 
    "res": { "passed": "bool" } 
  },
  "POST /onboarding/upload": { 
    "file": "FormData", 
    "res": { "url": "string" } 
  }
}